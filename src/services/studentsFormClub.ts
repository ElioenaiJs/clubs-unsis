import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";

export interface Student {
  name: string;
  id: string;
  email: string;
}

export const fetchStudentsFromClub = async (clubId: string): Promise<Student[]> => {
  const collectionName = `club_${clubId}`;
  const snapshot = await getDocs(collection(db, collectionName));

  return snapshot.docs.map((doc) => ({
    name: doc.data().nombre_alumno,
    id: doc.data().numero_alumno,
    email: doc.data().correo,
  }));
};
