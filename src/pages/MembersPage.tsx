import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";

interface Student {
  name: string;
  id: string;
  email: string;
}

export function MembersPage() {
  const { clubId } = useParams<{ clubId: string }>();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        // Construye el nombre de la colección basado en el clubId
        const collectionName = `club_${clubId}`;
        const snapshot = await getDocs(collection(db, collectionName));
        
        const studentsData = snapshot.docs.map(doc => ({
          name: doc.data().nombre_alumno,
          id: doc.data().numero_alumno,
          email: doc.data().correo
        }));

        setStudents(studentsData);
      } catch (err) {
        console.error("Error fetching students:", err);
        setError("Error al cargar los miembros del club");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [clubId]);

  if (loading) return <div className="p-4">Cargando miembros...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Miembros del Club</h1>
      
      <div className="grid gap-4">
        {students.length > 0 ? (
          students.map((student) => (
            <div key={student.id} className="border p-3 rounded-lg">
              <h3 className="font-medium">{student.name}</h3>
              <p className="text-sm text-gray-600">ID: {student.id}</p>
              <p className="text-sm text-gray-600">Email: {student.email}</p>
            </div>
          ))
        ) : (
          <p>No hay miembros registrados en este club</p>
        )}
      </div>
    </div>
  );
}