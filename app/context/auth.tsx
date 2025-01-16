// app/context/auth.tsx
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
import { ProfileService } from '../../types/profiles';

interface UserData {
  uid: string;
  email: string | null;
  username?: string;
  uname?: string;
}

interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  signup: (email: string, password: string, username: string, uname: string) => Promise<FirebaseUser>;
  login: (email: string, password: string) => Promise<FirebaseUser>; // Update the return type
  logout: () => Promise<void>;
  updateUserProfile: (updates: Partial<UserData>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signup: async () => { throw new Error('not implemented') },
  login: async () => { throw new Error('not implemented') },
  logout: async () => { throw new Error('not implemented') },
  updateUserProfile: async () => { throw new Error('not implemented') }

  
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser); // Debugging log
      if (firebaseUser) {
        const firestoreData = await getUserFromFirestore(firebaseUser.uid);
        const userData: UserData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          username: firestoreData?.username,
          uname: firestoreData?.uname,
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

  const signup = async (email: string, password: string, username: string, uname: string): Promise<FirebaseUser> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await saveUserToFirestore(userCredential.user.uid, { uname, username, email });
    await ProfileService.createProfile(userCredential.user.uid, username, uname);
    return userCredential.user; // Return the FirebaseUser
  };

  const login = async (email: string, password: string): Promise<FirebaseUser> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user; // Return the FirebaseUser
  };

  const logout = async () => {
    await signOut(auth);
  };

  const updateUserProfile = async (updates: Partial<UserData>) => {
    if (!user) return;
    await saveUserToFirestore(user.uid, updates);
    setUser({ ...user, ...updates });
    await saveUserToStorage({ ...user, ...updates });
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout, updateUserProfile }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);