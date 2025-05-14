import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, InputLabel, Select, MenuItem, FormControl, FormHelperText, Snackbar, Alert, CircularProgress, Input } from "@mui/material";
import { addStudent } from "../../services/addStudentService";

interface DialogAddStudentProps {
  open: boolean;
  onClose: () => void;
  currentClub?: string;
  onSuccess?: () => void;
}

interface FormErrors {
  matricula?: string;
  nombre?: string;
  correo?: string;
  general?: string;
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
  const [insertSuccess, setInsertSuccess] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!matricula) {
      newErrors.matricula = "La matrícula es requerida";
    } else if (!/^\d+$/.test(matricula)) {
      newErrors.matricula = "La matrícula debe contener solo números";
    }

    if (!nombre) {
      newErrors.nombre = "El nombre es requerido";
    }

    if (!correo) {
      newErrors.correo = "El correo es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      newErrors.correo = "Ingresa un correo electrónico válido";
    }

    if (!club) {
      newErrors.general = "Debes seleccionar un club";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClose = () => {
    setClub(currentClub || "");
    setMatricula("");
    setNombre("");
    setCorreo("");
    setErrors({});
    onClose();
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      await addStudent(club, matricula, nombre, correo); 
      if (!onSuccess) {
        setInsertSuccess(true);
      } else {
        onSuccess();
      }
      handleClose();
    } catch (err) {
      console.error("Error al agregar alumno:", err);
      setErrors({
        general: `Ocurrió un error: ${
          err instanceof Error ? err.message : "Inténtalo de nuevo más tarde"
        }`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
            <FormControl
              variant="standard"
              error={!!errors.matricula}
              fullWidth
            >
              <InputLabel htmlFor="matricula-input">Matrícula</InputLabel>
              <Input
                id="matricula-input"
                value={matricula}
                onChange={(e) => setMatricula(e.target.value)}
                aria-describedby="matricula-error-text"
              />
              {errors.matricula && (
                <FormHelperText id="matricula-error-text">
                  {errors.matricula}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl variant="standard" error={!!errors.nombre} fullWidth>
              <InputLabel htmlFor="nombre-input">Nombre</InputLabel>
              <Input
                id="nombre-input"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                aria-describedby="nombre-error-text"
              />
              {errors.nombre && (
                <FormHelperText id="nombre-error-text">
                  {errors.nombre}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl variant="standard" error={!!errors.correo} fullWidth>
              <InputLabel htmlFor="correo-input">Correo</InputLabel>
              <Input
                id="correo-input"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                type="email"
                aria-describedby="correo-error-text"
              />
              {errors.correo && (
                <FormHelperText id="correo-error-text">
                  {errors.correo}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl variant="standard" error={!!errors.general} fullWidth>
              <InputLabel id="club-select-label">Club</InputLabel>
              <Select
                labelId="club-select-label"
                id="club-select"
                value={club}
                label="Club"
                onChange={(e) => setClub(e.target.value)}
                disabled={!!currentClub}
                aria-describedby="club-error-text"
              >
                <MenuItem value={"club_ajedrez"}>Ajedrez</MenuItem>
                <MenuItem value={"club_danza"}>Danza</MenuItem>
                <MenuItem value={"club_taekwondo"}>Taekwondo</MenuItem>
              </Select>
              {errors.general && (
                <FormHelperText id="club-error-text">
                  {errors.general}
                </FormHelperText>
              )}
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={loading}
            endIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? "Guardando..." : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!onSuccess && insertSuccess}
        autoHideDuration={6000}
        onClose={() => setInsertSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setInsertSuccess(false)}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Alumno agregado correctamente
        </Alert>
      </Snackbar>
    </>
  );
}
