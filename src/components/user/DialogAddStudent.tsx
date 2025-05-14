// DialogAddStudent.tsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import { useState } from "react";
import { db } from "../../lib/firebase";
import { addDoc, collection } from "firebase/firestore";

interface DialogAddStudentProps {
  open: boolean;
  onClose: () => void;
  currentClub?: string; // Nuevo prop para el club actual
  onSuccess?: () => void; // Callback después de agregar exitosamente
}

export function DialogAddStudent({
  open,
  onClose,
  currentClub,
  onSuccess,
}: DialogAddStudentProps) {
  const [matricula, setMatricula] = useState("");
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [club, setClub] = useState(currentClub || "");

  const handleClose = () => {
    // Resetear todos los campos al cerrar
    setClub(currentClub || "");
    setMatricula("");
    setNombre("");
    setCorreo("");
    onClose();
  };

  const handleSubmit = async () => {
    try {
      // Validación de campos requeridos
      if (!club || !matricula || !nombre || !correo) {
        alert("Por favor, completa todos los campos");
        return;
      }

      // Validación de formato de correo (opcional)
      if (!correo.includes("@")) {
        alert("Por favor ingresa un correo electrónico válido");
        return;
      }

      const alumnoData = {
        numero_alumno: matricula,
        nombre_alumno: nombre,
        correo: correo,
      };

      // Agregar el documento a la colección del club
      await addDoc(collection(db, club), alumnoData);

      // Ejecutar callback de éxito si existe
      onSuccess?.();

      handleClose();
    } catch (error) {
      console.error("Error al agregar alumno:", error);
      alert(
        `Ocurrió un error al agregar el alumno: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      slotProps={{ paper: { sx: { width: "600px", maxWidth: "none" } } }}
    >
      <DialogTitle>Agregar nuevo alumno</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "100%",
            mt: 2,
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            id="matricula"
            label="Matrícula"
            variant="standard"
            fullWidth
            value={matricula}
            onChange={(e) => setMatricula(e.target.value)}
            required
          />
          <TextField
            id="nombre"
            label="Nombre"
            variant="standard"
            fullWidth
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
          <TextField
            id="correo"
            label="Correo"
            variant="standard"
            fullWidth
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
            type="email"
          />

          <FormControl fullWidth variant="standard">
            <InputLabel id="club-select-label">Club</InputLabel>
            <Select
              labelId="club-select-label"
              id="club-select"
              value={club}
              label="Club"
              onChange={(e) => setClub(e.target.value)}
              disabled={!!currentClub} // Deshabilitar si hay un club fijo
            >
              <MenuItem value={"club_ajedrez"}>Ajedrez</MenuItem>
              <MenuItem value={"club_danza"}>Danza</MenuItem>
              <MenuItem value={"club_taekwondo"}>Taekwondo</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
