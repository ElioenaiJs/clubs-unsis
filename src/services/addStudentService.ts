import { db } from "../lib/firebase";
import { addDoc, collection } from "firebase/firestore";

export const addStudent = async (club: string, matricula: string, nombre: string, correo: string) => {
  try {
    const alumnoData = {
      numero_alumno: matricula,
      nombre_alumno: nombre,
      correo: correo,
    };

    await addDoc(collection(db, club), alumnoData);
  } catch (err) {
    throw new Error("Error al agregar el alumno: " + (err instanceof Error ? err.message : "Error desconocido"));
  }
};
