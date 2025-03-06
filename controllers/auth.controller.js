// controllers/auth.controller.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db,auth } from '../config/firebase.js';
import { collection, doc, getDoc, setDoc, query, where, getDocs } from 'firebase/firestore';
import { errorHandler } from '../utils/error.js';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';

export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check if email already exists
    const usersRef = collection(db, 'users');
    const emailQuery = query(usersRef, where('email', '==', email));
    const emailSnapshot = await getDocs(emailQuery);

    if (!emailSnapshot.empty) {
      return next(errorHandler(400, 'Email already in use'));
    }

    // Check if username already exists
    const usernameQuery = query(usersRef, where('username', '==', username));
    const usernameSnapshot = await getDocs(usernameQuery);

    if (!usernameSnapshot.empty) {
      return next(errorHandler(400, 'Username already taken'));
    }

    // Hash password
    const hashPassword = bcrypt.hashSync(password, 12);

    // Create a new user document
    const newUser = {
      username,
      email,
      password: hashPassword,
      avatar: '',
      createdAt: new Date().toISOString()
    };

    // Add user to Firestore
    const userDocRef = doc(usersRef); // creates a reference with auto-generated ID
    await setDoc(userDocRef, newUser);

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return next(errorHandler(404, 'User not found'));
    }

    // Get the first (and should be only) matching document
    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    // Verify password
    const validPassword = bcrypt.compareSync(password, userData.password);
    if (!validPassword) {
      return next(errorHandler(401, 'Invalid password'));
    }

    // Create JWT token
    const token = jwt.sign({ id: userDoc.id }, process.env.SECRET);

    // Remove password from response
    const { password: userPassword, ...userWithoutPassword } = userData;

    // Set cookie and send response
    res.cookie('access_token', token, { httpOnly: true })
      .status(200)
      .json({ user: { id: userDoc.id, ...userWithoutPassword } });
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    // For Cloud Functions, we'll expect an idToken from the client
    // const { idToken } = req.body;

    // if (!idToken) {
    //   return next(errorHandler(400, 'Google ID token is required'));
    // }

    // // Create credential from token
    // const credential = GoogleAuthProvider.credential(idToken);

    // // Sign in with credential
    // const result = await signInWithCredential(auth, credential);
    // const user = result.user;

    // // Extract user info
    // const { email, displayName: name, photoURL: photo, uid } = user;


    const {email, displayName: name, photoURL: photo, uid} = req.body; 
    // Check if user exists
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    // Get secret key from environment or Firebase config
    const secretKey = process.env.SECRET

    if (!querySnapshot.empty) {
      // User exists, sign them in
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      // Update user's Firebase UID if it's not set
      if (!userData.uid) {
        await setDoc(userDoc.ref, { uid }, { merge: true });
      }

      const token = jwt.sign({ id: userDoc.id }, secretKey);

      // Remove password from response
      const { password, ...userWithoutPassword } = userData;

      res.cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json({ id: userDoc.id, ...userWithoutPassword });
    } else {
      // Create new user
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashPassword = bcrypt.hashSync(generatedPassword, 12);

      const username = name.split(' ').join('').toLowerCase() + Math.random().toString(36).slice(-4);

      const newUser = {
        username,
        email,
        password: hashPassword,
        avatar: photo || '',
        createdAt: new Date().toISOString(),
        uid // Store Firebase Auth UID
      };

      // Add user to Firestore
      const userDocRef = doc(usersRef); // creates a reference with auto-generated ID
      await setDoc(userDocRef, newUser);

      // Create JWT token
      const token = jwt.sign({ id: userDocRef.id }, secretKey);

      // Remove password from response
      const { password, ...userWithoutPassword } = newUser;

      res.cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json({ id: userDocRef.id, ...userWithoutPassword });
    }
  } catch (error) {
    console.error('Google auth error:', error);
    next(error);
  }
};


export const signout = (req, res, next) => {
  try {
    res.clearCookie('access_token');
    res.status(200).json('User has been logged out');
  } catch (error) {
    next(error);
  }
};
