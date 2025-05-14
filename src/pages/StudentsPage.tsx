import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import Button from "@mui/material/Button";
import { DialogAddStudent } from "../components/user";
import {
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  TextField,
  TableContainer,
  Typography,
  Table,
  Paper,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
} from "@mui/material";

interface Student {
  club: string;
  name: string;
  id: string;
  email: string;
}

export function StudentsPage() {
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const clubCollections = ["club_ajedrez", "club_danza", "club_taekwondo"];

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
        setFilteredStudents(students); // Inicialmente mostramos todos los estudiantes
      } catch (err) {
        console.error("Error fetching all students:", err);
        setError("Error al cargar todos los miembros");
      } finally {
        setLoading(false);
      }
    };

    fetchAllStudents();
  }, [refreshTrigger]);

  // Filtrar los estudiantes según el término de búsqueda
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    if (term === "") {
      setFilteredStudents(allStudents); // Si no hay búsqueda, mostrar todos los estudiantes
    } else {
      const filtered = allStudents.filter(
        (student) =>
          student.name.toLowerCase().includes(term) ||
          student.id.toLowerCase().includes(term) ||
          student.email.toLowerCase().includes(term) ||
          student.club.toLowerCase().includes(term)
      );
      setFilteredStudents(filtered);
    }
  };

  const handleAddSuccess = () => {
    setRefreshTrigger((prev) => prev + 1); // Forzar recarga de datos
    setSnackbarOpen(true); // Mostrar notificación
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
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

      {/* Campo de búsqueda */}
      <div className="mb-4">
        <TextField
          label="Buscar alumno"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={handleSearch}
        />
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
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
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
      <Box sx={{ mt: 4 }}>
        {filteredStudents.length > 0 ? (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="student table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Nombre</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Matrícula</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Correo</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Club</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={`${student.id}-${student.club}`}>
                    <TableCell component="th" scope="row">
                      {student.name}
                    </TableCell>
                    <TableCell>{student.id}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={student.club}
                        color="primary"
                        size="small"
                        sx={{ bgcolor: "blue.100", color: "blue.800" }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No se encontraron resultados
          </Typography>
        )}
      </Box>
    </div>
  );
}
