import { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser 
} from 'firebase/auth';
import { 
  auth, 
  saveUserToStorage, 
  getUserFromStorage,
  saveUserToFirestore,
  getUserFromFirestore 
} from '../../firebaseConfig';

// Define the shape of our user object
interface UserData {
  uid: string;
  email: string | null;
  username?: string;
  uname?: string;
}

// Define the shape of our context
interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  signup: (email: string, password: string, username: string, uname: string) => Promise<FirebaseUser>;
  login: (email: string, password: string) => Promise<FirebaseUser>;
  logout: () => Promise<void>;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signup: async () => { throw new Error('not implemented') },
  login: async () => { throw new Error('not implemented') },
  logout: async () => { throw new Error('not implemented') }
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data on mount
    getUserFromStorage().then(storedUser => {
      if (storedUser) {
        setUser(storedUser);
      }
      setLoading(false);
    });

    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get additional user data from Firestore
        const firestoreData = await getUserFromFirestore(firebaseUser.uid);
        
        // Store complete user data
        const userData: UserData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          username: firestoreData?.username,
          uname: firestoreData?.uname
        };
        
        setUser(userData);
        await saveUserToStorage(userData);
      } else {
        setUser(null);
        await saveUserToStorage(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email: string, password: string, username: string, uname: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Save additional user data to Firestore
    await saveUserToFirestore(userCredential.user.uid, {
      uname,
      username,
      email
    });

    return userCredential.user;
  };

  const login = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signup,
      login,
      logout,
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export const useAuth = () => {
  return useContext(AuthContext);
};