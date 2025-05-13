import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import Button from '@mui/material/Button';
import { DialogAddStudent } from "../components/user";

interface Student {
  club: string;
  name: string;
  id: string;
  email: string;
}

export function StudentsPage() {
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  // Lista estática de colecciones de clubes
  const clubCollections = [
    "club_ajedrez",
    "club_danza",
    "club_taekwondo",
    // Agrega más colecciones si es necesario
  ];

  useEffect(() => {
    const fetchAllStudents = async () => {
      try {
        const students: Student[] = [];

        // Usamos Promise.all para hacer las consultas en paralelo
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

        setAllStudents(students);
      } catch (err) {
        console.error("Error fetching all students:", err);
        setError("Error al cargar todos los miembros");
      } finally {
        setLoading(false);
      }
    };

    fetchAllStudents();
  }, []);

  if (loading) return <div className="p-4">Cargando todos los miembros...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Alumnos</h1>
      <div className="flex justify-end">
        <Button variant="contained" onClick={() => setOpen(true)}>+ Agregar alumno</Button>
      </div>
      <DialogAddStudent open={open} onClose={() => setOpen(false)} />
      <br />
      <div className="grid gap-4">
        {allStudents.length > 0 ? (
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
                <th scope="col" className="px-6 py-3">
                  Club
                </th>
              </tr>
            </thead>
            <tbody>
              {allStudents.map((student) => (
                <tr key={`${student.id}-${student.club}`} className="bg-white">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium whitespace-nowrap"
                  >
                    {student.name}
                  </th>
                  <td className="px-6 py-4">{student.id}</td>
                  <td className="px-6 py-4">{student.email}</td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {student.club}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No hay miembros registrados</p>
        )}
      </div>
    </div>
  );
}
