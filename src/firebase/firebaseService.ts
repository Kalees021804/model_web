import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc,
  query,
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { db, auth } from './config.ts';

// ==================== PROJECT TYPES ====================
export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  technologies: string[];
  rating: number;
  deliveryTime: string;
  imageUrl: string;
  colorGradient: string;
  createdAt: string;
}

export interface ProjectInput {
  title: string;
  category: string;
  description: string;
  technologies: string[];
  rating: number;
  deliveryTime: string;
  imageUrl: string;
  colorGradient: string;
}

// ==================== REVIEW TYPES ====================
export interface Review {
  id: string;
  name: string;
  college: string;
  project: string;
  rating: number;
  review: string;
  date: string;
  createdAt: string;
}

export interface ReviewInput {
  name: string;
  college: string;
  project: string;
  rating: number;
  review: string;
}

// ==================== QUOTE TYPES ====================
export interface QuoteRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  projectType: string;
  description: string;
  deadline: string;
  budget: string;
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
  submittedAt: string;
  decisionAt?: string;
  decisionNote?: string;
}

export interface QuoteInput {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  description: string;
  deadline: string;
  budget: string;
}

// ==================== PROJECT FUNCTIONS ====================

export const addProject = async (projectData: ProjectInput): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'projects'), {
      ...projectData,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding project:', error);
    throw error;
  }
};

export const getProjects = async (): Promise<Project[]> => {
  try {
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate().toISOString() || new Date().toISOString()
    })) as Project[];
  } catch (error) {
    console.error('Error getting projects:', error);
    throw error;
  }
};

export const updateProject = async (id: string, projectData: Partial<ProjectInput>): Promise<void> => {
  try {
    const projectRef = doc(db, 'projects', id);
    await updateDoc(projectRef, projectData);
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

export const deleteProject = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'projects', id));
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};

// ==================== REVIEW FUNCTIONS ====================

export const addReview = async (reviewData: ReviewInput): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'reviews'), {
      ...reviewData,
      date: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
      createdAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding review:', error);
    throw error;
  }
};

export const getReviews = async (): Promise<Review[]> => {
  try {
    const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate().toISOString() || new Date().toISOString()
    })) as Review[];
  } catch (error) {
    console.error('Error getting reviews:', error);
    throw error;
  }
};

export const deleteReview = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'reviews', id));
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
};

// ==================== QUOTE FUNCTIONS ====================

export const addQuote = async (quoteData: QuoteInput): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'quotes'), {
      ...quoteData,
      status: 'pending',
      submittedAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding quote:', error);
    throw error;
  }
};

export const getQuotes = async (): Promise<QuoteRequest[]> => {
  try {
    const q = query(collection(db, 'quotes'), orderBy('submittedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((quoteDoc) => {
      const data = quoteDoc.data();
      return {
        id: quoteDoc.id,
        ...data,
        submittedAt: data.submittedAt?.toDate().toISOString() || new Date().toISOString(),
        decisionAt: data.decisionAt?.toDate?.().toISOString?.() || ''
      };
    }) as QuoteRequest[];
  } catch (error) {
    console.error('Error getting quotes:', error);
    throw error;
  }
};

export const updateQuoteStatus = async (
  id: string, 
  status: 'pending' | 'reviewed' | 'approved' | 'rejected',
  decisionNote?: string
): Promise<void> => {
  try {
    const quoteRef = doc(db, 'quotes', id);
    await updateDoc(quoteRef, {
      status,
      decisionAt: Timestamp.now(),
      decisionNote: decisionNote || ''
    });
  } catch (error) {
    console.error('Error updating quote status:', error);
    throw error;
  }
};

export const deleteQuote = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'quotes', id));
  } catch (error) {
    console.error('Error deleting quote:', error);
    throw error;
  }
};

// ==================== FIRESTORE RULES NEEDED ====================
/*
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /projects/{project} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /reviews/{review} {
      allow read: if true;
      allow create: if true;
      allow update, delete: if request.auth != null;
    }
    match /quotes/{quote} {
      allow read, write: if request.auth != null;
      allow create: if true;
    }
  }
}
*/

// ==================== AUTH FUNCTION ====================

export const loginAdmin = async (email: string, password: string): Promise<boolean> => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return true;
  } catch (error: any) {
    console.error("LOGIN ERROR:", error.code, error.message);
    return false;
  }
};
export const forgotPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Error sending reset email:', error);
    throw error;
  }
};