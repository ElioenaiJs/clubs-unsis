import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Alert, Box, Button, CircularProgress, Snackbar, TextField } from "@mui/material";
import { DialogAddStudent } from "../components/user";

interface Student {
  name: string;
  id: string;
  email: string;
}

export function MembersPage() {
  const { clubId } = useParams<{ clubId: string }>();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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
      setFilteredStudents(studentsData); // Inicia los estudiantes filtrados con todos los estudiantes
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

  useEffect(() => {
    if (searchTerm) {
      const filtered = students.filter((student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(students);
    }
  }, [searchTerm, students]);

  const handleAddSuccess = () => {
    fetchStudents();
    setSnackbarOpen(true); // Mostrar feedback visual
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress size={80} />
      </Box>
    );
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

      {/* Campo de búsqueda */}
      <div className="mb-4 mt-4">
        <TextField
          fullWidth
          label="Buscar alumno"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <DialogAddStudent
        open={open}
        onClose={handleCloseDialog}
        currentClub={`club_${clubId}`} // Club fijo basado en la ruta
        onSuccess={handleAddSuccess}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          variant="filled">
          Alumno agregado correctamente
        </Alert>
      </Snackbar>

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
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <tr className="bg-white" key={student.id}>
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
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center">
                  No hay registrados en este club
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
