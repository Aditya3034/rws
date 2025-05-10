// controllers/user.controller.js
import { db } from '../config/firebase.js';
import { collection, doc, getDoc, updateDoc, query, where, getDocs, orderBy, limit, startAfter } from 'firebase/firestore';
import { errorHandler } from '../utils/error.js';

// Update user profile
export const updateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;
    
    // Don't allow email updates as per requirements
    if (updateData.email) {
      delete updateData.email;
    }
    
    // Reference to the user document
    const userRef = doc(db, 'users', userId);
    
    // Check if user exists
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      return next(errorHandler(404, 'User not found'));
    }
    
    // Update user document
    await updateDoc(userRef, updateData);
    
    // Get updated user data
    const updatedUserDoc = await getDoc(userRef);
    const userData = updatedUserDoc.data();
    
    // Remove sensitive information
    const { password, ...userWithoutPassword } = userData;
    
    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user: { id: userId, ...userWithoutPassword }
    });
  } catch (error) {
    next(error);
  }
};

// Get PDFs by standard with pagination
export const getPDFsByStandard = async (req, res, next) => {
  try {
    const { standard } = req.params;
    const { query: searchQuery, pageSize = 10, lastDoc } = req.query;
    
    // Convert pageSize to number
    const limit_size = parseInt(pageSize);
    
    // Reference to PDFs collection
    const pdfsRef = collection(db, 'pdfs');
    
    let q;
    
    if (searchQuery) {
      // If search query is provided, filter by both standard and search term
      q = query(
        pdfsRef, 
        where('standard', '==', standard),
        where('searchableFields', 'array-contains', searchQuery.toLowerCase()),
        orderBy('uploadedAt', 'desc'),
        limit(limit_size)
      );
    } else {
      // Base query - filter by standard only
      q = query(
        pdfsRef, 
        where('standard', '==', standard),
        orderBy('uploadedAt', 'desc'),
        limit(limit_size)
      );
    }
    
    // If lastDoc is provided for pagination
    if (lastDoc) {
      const lastDocRef = doc(db, 'pdfs', lastDoc);
      const lastDocSnapshot = await getDoc(lastDocRef);
      
      if (lastDocSnapshot.exists()) {
        q = query(q, startAfter(lastDocSnapshot));
      }
    }
    
    // Execute query
    const querySnapshot = await getDocs(q);
    
    // Prepare response data
    const pdfs = [];
    querySnapshot.forEach(doc => {
      pdfs.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // Get the last document for next pagination
    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    
    res.status(200).json({
      success: true,
      data: pdfs,
      lastDoc: lastVisible ? lastVisible.id : null,
      hasMore: pdfs.length === limit_size
    });
  } catch (error) {
    next(error);
  }
};

// Submit contact form
export const submitContactForm = async (req, res, next) => {
  try {
    const { name, email, phoneNumber, description } = req.body;
    
    // Validate required fields
    if (!name || !email || !phoneNumber || !description) {
      return next(errorHandler(400, 'All fields are required'));
    }
    
    // Create contact entry in Firestore
    const contactsRef = collection(db, 'contacts');
    const newContact = {
      name,
      email,
      phoneNumber,
      description,
      createdAt: new Date().toISOString(),
      status: 'unread' // Can be used for tracking on admin side
    };
    
    // Add to Firestore
    const docRef = doc(contactsRef);
    await setDoc(docRef, newContact);
    
    res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully',
      contactId: docRef.id
    });
  } catch (error) {
    next(error);
  }
};

// Get notifications
export const getNotifications = async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    // Reference to notifications collection
    const notificationsRef = collection(db, 'notifications');
    
    // Query for user notifications, order by createdAt in descending order
    const q = query(
      notificationsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(20) // Limit to most recent 20 notifications
    );
    
    // Execute query
    const querySnapshot = await getDocs(q);
    
    // Prepare response data
    const notifications = [];
    querySnapshot.forEach(doc => {
      notifications.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    res.status(200).json({
      success: true,
      notifications
    });
  } catch (error) {
    next(error);
  }
};