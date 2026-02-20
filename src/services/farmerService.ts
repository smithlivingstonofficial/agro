import { db } from "../lib/firebase"; // Ensure this path matches your firebase config file
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy, 
  getDocs,
  updateDoc,
  Timestamp 
} from "firebase/firestore";

export interface Farmer {
  id?: string;
  name: string;
  location: string;
  crops: string[];
  acreage: number;
  status: 'Active' | 'Pending' | 'Inactive';
  createdAt?: Timestamp;
}

const farmerCol = collection(db, "farmers");

// 1. One-time fetch (The function your error was looking for)
export const getFarmers = async (): Promise<Farmer[]> => {
  const q = query(farmerCol, orderBy("name"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Farmer));
};

// 2. Real-time Subscription (Better for a "Complete Product")
export const subscribeToFarmers = (callback: (data: Farmer[]) => void) => {
  const q = query(farmerCol, orderBy("name"));
  return onSnapshot(q, (snapshot) => {
    const farmers = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Farmer[];
    callback(farmers);
  });
};

// 3. Add Farmer
export const addFarmer = async (farmer: Omit<Farmer, 'id' | 'createdAt'>) => {
  return await addDoc(farmerCol, {
    ...farmer,
    createdAt: Timestamp.now()
  });
};

// 4. Delete Farmer
export const deleteFarmer = async (id: string) => {
  return await deleteDoc(doc(db, "farmers", id));
};

// 5. Update Farmer Status
export const updateFarmerStatus = async (id: string, status: Farmer['status']) => {
  const docRef = doc(db, "farmers", id);
  return await updateDoc(docRef, { status });
};