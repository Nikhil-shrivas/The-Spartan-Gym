import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc, serverTimestamp, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const googleProvider = new GoogleAuthProvider();

// Validation test
async function testConnection() {
  try {
    // Attempting a read to trigger potential firewall/access issues early
    await getDocFromServer(doc(db, '_internal', 'health'));
  } catch (error: any) {
    if (error.message?.includes('insufficient permissions')) {
       // This is expected if the doc doesn't exist but rules are working
       console.log("Firebase connection verified (Permissions working)");
    } else {
       console.error("Firebase connection error:", error);
    }
  }
}
testConnection();

// Types
export interface MemberData {
  id?: string;
  name: string;
  phone: string;
  membershipCode: string;
  plan: string;
  status: 'active' | 'paused' | 'expired' | 'extended';
  expiryDate: string;
  extendedDate?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface StaffData {
  id?: string;
  name: string;
  phone?: string;
  role: string;
  staffCode: string;
  createdAt?: any;
  updatedAt?: any;
}

// Special Hardcoded Admin Code
export const ADMIN_TERMINAL_CODE = "TSGK3755V237]28";

// Admin Check
export async function isUserAdmin(uid: string): Promise<boolean> {
  const adminDoc = await getDoc(doc(db, 'admins', uid));
  return adminDoc.exists();
}

// Error Handler
export function handleFirestoreError(error: any, operation: string, path: string | null = null) {
  const errorInfo = {
    error: error.message,
    operationType: operation,
    path: path,
    authInfo: {
      userId: auth.currentUser?.uid || 'anonymous',
      email: auth.currentUser?.email || 'none',
      emailVerified: auth.currentUser?.emailVerified || false,
    }
  };
  console.error("Firestore Error:", JSON.stringify(errorInfo, null, 2));
  throw new Error(`Gym Database Error: ${error.message}`);
}
