// controllers/admin.controller.js
import { db } from '../config/firebase.js';
import { collection, doc, getDoc, setDoc, updateDoc, deleteDoc, query, where, getDocs } from 'firebase/firestore';
import { errorHandler } from '../utils/error.js';
import { storage } from '../config/firebase.js';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

// Helper function to create searchable fields from PDF metadata
const createSearchableFields = (pdfData) => {
  const searchableFields = [];
  
  // Add all the keywords as lowercase for better searching
  if (pdfData.title) searchableFields.push(pdfData.title.toLowerCase());
  if (pdfData.subject) searchableFields.push(pdfData.subject.toLowerCase());
  if (pdfData.description) {
    const words = pdfData.description.toLowerCase().split(' ');
    searchableFields.push(...words.filter(word => word.length > 2)); // Only include words with more than 2 characters
  }
  if (pdfData.topic) searchableFields.push(pdfData.topic.toLowerCase());
  if (pdfData.subtopic) searchableFields.push(pdfData.subtopic.toLowerCase());
  if (pdfData.tags && Array.isArray(pdfData.tags)) {
    searchableFields.push(...pdfData.tags.map(tag => tag.toLowerCase()));
  }
  
  // Remove duplicates
  return [...new Set(searchableFields)];
};

// Upload PDF
export const uploadPDF = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(errorHandler(400, 'No PDF file uploaded'));
    }
    
    const { 
      title, 
      subject, 
      standard, 
      topic, 
      subtopic, 
      description, 
      tags 
    } = req.body;
    
    // Validate required fields
    if (!title || !subject || !standard) {
      return next(errorHandler(400, 'Title, subject, and standard are required'));
    }
    
    // Parse tags if they exist
    const parsedTags = tags ? JSON.parse(tags) : [];
    
    // Create a reference to the Firebase Storage
    const fileRef = ref(storage, `pdfs/${Date.now()}-${req.file.originalname}`);
    
    // Upload the file to Firebase Storage
    await uploadBytes(fileRef, req.file.buffer);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(fileRef);
    
    // Prepare PDF data
    const pdfData = {
      title,
      subject,
      standard,
      topic: topic || '',
      subtopic: subtopic || '',
      description: description || '',
      tags: parsedTags,
      fileUrl: downloadURL,
      fileName: req.file.originalname,
      filePath: fileRef.fullPath,
      fileSize: req.file.size,
      uploadedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Create searchable fields
    pdfData.searchableFields = createSearchableFields(pdfData);
    
    // Add to Firestore
    const pdfsRef = collection(db, 'pdfs');
    const docRef = doc(pdfsRef);
    await setDoc(docRef, pdfData);
    
    // Create notification for new PDF upload
    await createNotification({
      type: 'NEW_PDF',
      title: `New ${standard} worksheet uploaded`,
      message: `${title} has been uploaded. Check it out!`,
      data: {
        pdfId: docRef.id,
        standard
      }
    });
    
    res.status(201).json({
      success: true,
      message: 'PDF uploaded successfully',
      pdf: {
        id: docRef.id,
        ...pdfData
      }
    });
  } catch (error) {
    next(error);
  }
};

// Edit PDF
export const editPDF = async (req, res, next) => {
  try {
    const { pdfId } = req.params;
    const updateData = req.body;
    let fileChanged = false;
    
    // Reference to the PDF document
    const pdfRef = doc(db, 'pdfs', pdfId);
    
    // Check if PDF exists
    const pdfDoc = await getDoc(pdfRef);
    if (!pdfDoc.exists()) {
      return next(errorHandler(404, 'PDF not found'));
    }
    
    const currentPdfData = pdfDoc.data();
    
    // Check if file was updated
    if (req.file) {
      fileChanged = true;
      
      // Delete the old file from storage
      const oldFileRef = ref(storage, currentPdfData.filePath);
      try {
        await deleteObject(oldFileRef);
      } catch (storageError) {
        console.log('Error deleting old file:', storageError);
        // Continue even if delete fails
      }
      
      // Upload the new file
      const newFileRef = ref(storage, `pdfs/${Date.now()}-${req.file.originalname}`);
      await uploadBytes(newFileRef, req.file.buffer);
      
      // Get the new download URL
      const downloadURL = await getDownloadURL(newFileRef);
      
      // Update file-related fields
      updateData.fileUrl = downloadURL;
      updateData.fileName = req.file.originalname;
      updateData.filePath = newFileRef.fullPath;
      updateData.fileSize = req.file.size;
    }
    
    // Parse tags if they exist in update data
    if (updateData.tags && typeof updateData.tags === 'string') {
      updateData.tags = JSON.parse(updateData.tags);
    }
    
    // Merge update data with existing data to create searchable fields
    const mergedData = {
      ...currentPdfData,
      ...updateData
    };
    
    // Generate new searchable fields
    updateData.searchableFields = createSearchableFields(mergedData);
    
    // Add updated timestamp
    updateData.updatedAt = new Date().toISOString();
    
    // Update the document
    await updateDoc(pdfRef, updateData);
    
    // Get updated PDF data
    const updatedPdfDoc = await getDoc(pdfRef);
    
    res.status(200).json({
      success: true,
      message: 'PDF updated successfully',
      pdf: {
        id: pdfId,
        ...updatedPdfDoc.data()
      }
    });
  } catch (error) {
    next(error);
  }
};

// Delete PDF
export const deletePDF = async (req, res, next) => {
  try {
    const { pdfId } = req.params;
    
    // Reference to the PDF document
    const pdfRef = doc(db, 'pdfs', pdfId);
    
    // Check if PDF exists
    const pdfDoc = await getDoc(pdfRef);
    if (!pdfDoc.exists()) {
      return next(errorHandler(404, 'PDF not found'));
    }
    
    const pdfData = pdfDoc.data();
    
    // Delete the file from storage
    const fileRef = ref(storage, pdfData.filePath);
    try {
      await deleteObject(fileRef);
    } catch (storageError) {
      console.log('Error deleting file:', storageError);
      // Continue even if delete fails
    }
    
    // Delete the document from Firestore
    await deleteDoc(pdfRef);
    
    res.status(200).json({
      success: true,
      message: 'PDF deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to create notification
const createNotification = async (notificationData) => {
  try {
    // For a real-time notification system, this would typically
    // create a notification in the database and then use a websocket
    // or similar technology to push it to connected clients
    
    const notification = {
      ...notificationData,
      createdAt: new Date().toISOString(),
      read: false
    };
    
    // Add to Firestore - for an actual implementation, you would determine
    // which users should receive this notification
    const notificationsRef = collection(db, 'notifications');
    
    // Get all users
    const usersRef = collection(db, 'users');
    const usersSnapshot = await getDocs(usersRef);
    
    // Create a notification for each user
    const promises = [];
    
    usersSnapshot.forEach(userDoc => {
      const userNotification = {
        ...notification,
        userId: userDoc.id
      };
      
      promises.push(setDoc(doc(notificationsRef), userNotification));
    });
    
    await Promise.all(promises);
    
    return true;
  } catch (error) {
    console.error('Error creating notification:', error);
    return false;
  }
};