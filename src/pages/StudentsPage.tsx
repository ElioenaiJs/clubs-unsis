import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import Button from '@mui/material/Button';
import { DialogAddStudent } from "../components/user";
import { Box, CircularProgress, Snackbar, Alert } from "@mui/material";

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
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const clubCollections = [
    "club_ajedrez",
    "club_danza",
    "club_taekwondo",
  ];

  useEffect(() => {
    const fetchAllStudents = async () => {
      try {
        setLoading(true);
        setError(null);
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

        setAllStudents(students);
      } catch (err) {
        console.error("Error fetching all students:", err);
        setError("Error al cargar todos los miembros");
      } finally {
        setLoading(false);
      }
    };

    fetchAllStudents();
  }, [refreshTrigger]);

  const handleAddSuccess = () => {
    setRefreshTrigger(prev => prev + 1); // Forzar recarga de datos
    setSnackbarOpen(true); // Mostrar notificación
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress size={80} />
    </Box>
  );
  
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Alumnos</h1>
      <div className="flex justify-end">
        <Button 
          variant="contained" 
          onClick={() => setOpen(true)}
          sx={{ mb: 2 }}
        >
          + Agregar alumno
        </Button>
      </div>  

      <DialogAddStudent 
        open={open} 
        onClose={() => setOpen(false)} 
        onSuccess={handleAddSuccess}
      />
      
      {/* Snackbar para mostrar confirmación */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="success" 
          variant="filled"
        >
          Alumno agregado correctamente 
        </Alert>
      </Snackbar>

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
