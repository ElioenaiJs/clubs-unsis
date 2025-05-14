import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";

export interface Student {
  club: string;
  name: string;
  id: string;
  email: string;
}

const clubCollections = ["club_ajedrez", "club_danza", "club_taekwondo"];

export const getAllStudents = async (): Promise<Student[]> => {
  const students: Student[] = [];

  const promises = clubCollections.map((clubCol) =>
    getDocs(collection(db, clubCol))
  );

  const snapshots = await Promise.all(promises);

  snapshots.forEach((snapshot, index) => {
    const clubName = clubCollections[index].replace("club_", "");
    snapshot.forEach((doc) => {
      students.push({
        club: clubName,
        name: doc.data().nombre_alumno,
        id: doc.data().numero_alumno,
        email: doc.data().correo,
      });
    });
  });

  return students;
};
