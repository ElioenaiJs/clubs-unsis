import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Button } from "@mui/material";
import { DialogAddStudent } from "../components/user";

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
  const [open, setOpen] = useState(false);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);

      const collectionName = `club_${clubId}`;
      const snapshot = await getDocs(collection(db, collectionName));

      const studentsData = snapshot.docs.map((doc) => ({
        name: doc.data().nombre_alumno,
        id: doc.data().numero_alumno,
        email: doc.data().correo,
      }));

      setStudents(studentsData);
    } catch (err) {
      console.error("Error fetching students:", err);
      setError("Error al cargar los miembros del club");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [clubId]);

  const handleAddSuccess = () => {
    // Recargar la lista de estudiantes después de agregar uno nuevo
    fetchStudents();
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  if (loading) return <div className="p-4">Cargando miembros...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        {clubId
          ? clubId.charAt(0).toUpperCase() + clubId.slice(1).toLowerCase()
          : ""}
      </h1>
      <div className="flex justify-end">
        <Button variant="contained" onClick={() => setOpen(true)}>
          + Agregar alumno
        </Button>
      </div>

      <DialogAddStudent
        open={open}
        onClose={handleCloseDialog}
        currentClub={`club_${clubId}`} // Club fijo basado en la ruta
        onSuccess={handleAddSuccess}
      />
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right">
          <thead className="text-xs uppercase">
            <tr>
              <th scope="col" className="px-6 py-3">
                Nombre
              </th>
              <th scope="col" className="px-6 py-3">
                Matricula
              </th>
              <th scope="col" className="px-6 py-3">
                Correo
              </th>
              <th scope="col" className="px-6 py-3"></th>
              <th scope="col" className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? (
              students.map((student) => (
                <tr className="bg-white">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium whitespace-nowrap"
                  >
                    {student.name}
                  </th>
                  <td className="px-6 py-4">{student.id}</td>
                  <td className="px-6 py-4">{student.email}</td>
                  <td className="px-6 py-4"></td>
                  <td className="px-6 py-4"></td>
                </tr>
              ))
            ) : (
              <p>No hay miembros registrados en este club</p>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
