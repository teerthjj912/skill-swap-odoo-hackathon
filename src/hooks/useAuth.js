import { useState, useEffect } from 'react';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInAnonymously,
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import toast from 'react-hot-toast';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        try {
          // Fetch user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', authUser.uid));
          
          if (userDoc.exists()) {
            const firestoreData = userDoc.data();
            
            // Merge Auth user with Firestore data, preserving all Firestore fields
            const mergedUser = {
              // Auth user properties
              uid: authUser.uid,
              email: authUser.email,
              emailVerified: authUser.emailVerified,
              displayName: authUser.displayName,
              photoURL: authUser.photoURL,
              phoneNumber: authUser.phoneNumber,
              providerId: authUser.providerId,
              tenantId: authUser.tenantId,
              metadata: authUser.metadata,
              providerData: authUser.providerData,
              refreshToken: authUser.refreshToken,
              // Firestore data (this will override Auth data if there are conflicts)
              ...firestoreData,
              // Ensure critical fields are preserved from Firestore
              name: firestoreData.name || authUser.displayName || 'Anonymous',
              skillsOffered: firestoreData.skillsOffered || [],
              skillsWanted: firestoreData.skillsWanted || [],
              availability: firestoreData.availability || [],
              isPublic: firestoreData.isPublic !== undefined ? firestoreData.isPublic : true,
              isBanned: firestoreData.isBanned || false,
              isAdmin: firestoreData.isAdmin || true, // Temporarily set to true for testing
              location: firestoreData.location || '',
              createdAt: firestoreData.createdAt,
              updatedAt: firestoreData.updatedAt,
              lastLogin: new Date()
            };
            
            console.log('User data merged successfully:', {
              uid: mergedUser.uid,
              name: mergedUser.name,
              skillsOffered: mergedUser.skillsOffered?.length || 0,
              skillsWanted: mergedUser.skillsWanted?.length || 0
            });
            
            setUser(mergedUser);
          } else {
            // User doesn't exist in Firestore yet, use Auth data only
            console.log('User not found in Firestore, using Auth data only');
            setUser(authUser);
          }
        } catch (error) {
          console.error('Error fetching user data from Firestore:', error);
          // Fallback to Auth user data if Firestore fetch fails
          setUser(authUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Check if user already exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      
      if (userDoc.exists()) {
        // User exists, only update lastLogin and basic info
        const existingData = userDoc.data();
        await setDoc(doc(db, 'users', result.user.uid), {
          ...existingData, // Preserve all existing data
          name: existingData.name || result.user.displayName || 'Anonymous',
          email: result.user.email,
          photoURL: result.user.photoURL || existingData.photoURL,
          lastLogin: new Date()
        }, { merge: true });
        
        console.log('Existing user signed in, preserved data:', {
          skillsOffered: existingData.skillsOffered?.length || 0,
          skillsWanted: existingData.skillsWanted?.length || 0
        });
      } else {
        // New user, create initial document
        await setDoc(doc(db, 'users', result.user.uid), {
          uid: result.user.uid,
          name: result.user.displayName || 'Anonymous',
          email: result.user.email,
          photoURL: result.user.photoURL,
          skillsOffered: [],
          skillsWanted: [],
          availability: [],
          isPublic: true,
          isBanned: false,
          isAdmin: false,
          createdAt: new Date(),
          lastLogin: new Date()
        });
        
        console.log('New user created with initial data');
      }

      toast.success('Successfully signed in with Google!', { duration: 2000 });
    } catch (error) {
      console.error('Google sign-in error:', error);
      toast.error('Failed to sign in with Google', { duration: 3000 });
    }
  };

  const signInAsGuest = async () => {
    try {
      const result = await signInAnonymously(auth);
      
      // Check if user already exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      
      if (userDoc.exists()) {
        // User exists, only update lastLogin
        const existingData = userDoc.data();
        await setDoc(doc(db, 'users', result.user.uid), {
          ...existingData, // Preserve all existing data
          lastLogin: new Date()
        }, { merge: true });
        
        console.log('Existing guest user signed in, preserved data:', {
          skillsOffered: existingData.skillsOffered?.length || 0,
          skillsWanted: existingData.skillsWanted?.length || 0
        });
      } else {
        // New user, create initial document
        await setDoc(doc(db, 'users', result.user.uid), {
          uid: result.user.uid,
          name: 'Guest User',
          email: null,
          photoURL: null,
          skillsOffered: [],
          skillsWanted: [],
          availability: [],
          isPublic: true,
          isBanned: false,
          isAdmin: false,
          createdAt: new Date(),
          lastLogin: new Date()
        });
        
        console.log('New guest user created with initial data');
      }

      toast.success('Successfully signed in as guest!', { duration: 2000 });
    } catch (error) {
      console.error('Guest sign-in error:', error);
      toast.error('Failed to sign in as guest', { duration: 3000 });
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success('Successfully signed out!', { duration: 2000 });
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to sign out', { duration: 3000 });
    }
  };

  const refreshUserData = async () => {
    if (!auth.currentUser) return;
    
    try {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      if (userDoc.exists()) {
        const firestoreData = userDoc.data();
        const mergedUser = {
          // Auth user properties
          uid: auth.currentUser.uid,
          email: auth.currentUser.email,
          emailVerified: auth.currentUser.emailVerified,
          displayName: auth.currentUser.displayName,
          photoURL: auth.currentUser.photoURL,
          phoneNumber: auth.currentUser.phoneNumber,
          providerId: auth.currentUser.providerId,
          tenantId: auth.currentUser.tenantId,
          metadata: auth.currentUser.metadata,
          providerData: auth.currentUser.providerData,
          refreshToken: auth.currentUser.refreshToken,
          // Firestore data
          ...firestoreData,
          // Ensure critical fields are preserved
          name: firestoreData.name || auth.currentUser.displayName || 'Anonymous',
          skillsOffered: firestoreData.skillsOffered || [],
          skillsWanted: firestoreData.skillsWanted || [],
          availability: firestoreData.availability || [],
          isPublic: firestoreData.isPublic !== undefined ? firestoreData.isPublic : true,
          isBanned: firestoreData.isBanned || false,
          isAdmin: firestoreData.isAdmin || false,
          location: firestoreData.location || '',
          createdAt: firestoreData.createdAt,
          updatedAt: firestoreData.updatedAt,
          lastLogin: firestoreData.lastLogin || new Date()
        };
        
        setUser(mergedUser);
        console.log('User data refreshed:', {
          skillsOffered: mergedUser.skillsOffered?.length || 0,
          skillsWanted: mergedUser.skillsWanted?.length || 0
        });
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  return {
    user,
    loading,
    signInWithGoogle,
    signInAsGuest,
    logout,
    refreshUserData
  };
} 