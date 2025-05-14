import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Alert, Box, Button, CircularProgress, Paper, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { DialogAddStudent } from "../components/user";
import { fetchStudentsFromClub, Student } from "../services/studentsFormClub";

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
    if (!clubId) return;

    try {
      setLoading(true);
      setError(null);
      const studentsData = await fetchStudentsFromClub(clubId);
      setStudents(studentsData);
      setFilteredStudents(studentsData);
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
      const filtered = students.filter(
        (student) =>
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
    setSnackbarOpen(true);
  };

  const handleCloseDialog = () => setOpen(false);

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
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          variant="filled"
        >
          Alumno agregado correctamente
        </Alert>
      </Snackbar>

      <Box sx={{ overflowX: "auto" }}>
        <TableContainer component={Paper}>
          <Table
            sx={{ minWidth: 650 }}
            aria-label="students table with actions"
          >
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
                <TableCell />
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell component="th" scope="row">
                      {student.name}
                    </TableCell>
                    <TableCell>{student.id}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{/* Espacio para acción futura */}</TableCell>
                    <TableCell>{/* Espacio para acción futura */}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography variant="body2" color="text.secondary">
                      No hay registrados en este club
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </div>
  );
}
