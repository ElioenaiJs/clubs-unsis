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
    SelectChangeEvent,
    MenuItem,
    FormControl,
} from "@mui/material";
import React, { useState } from "react";
import { db } from "../../lib/firebase";
import { addDoc, collection } from "firebase/firestore";

interface DialogAddStudentProps {
    open: boolean;
    onClose: () => void;
}

export function DialogAddStudent({ open, onClose }: DialogAddStudentProps) {
    const [club, setClub] = useState("");
    const [matricula, setMatricula] = useState("");
    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");

    const handleClubChange = (event: SelectChangeEvent) => {
        setClub(event.target.value as string);
    };

    const handleClose = () => {
        setClub("");
        setMatricula("");
        setNombre("");
        setCorreo("");
        onClose();
    };

    const handleSubmit = async () => {
        try {
            if (!club || !matricula || !nombre || !correo) {
                alert("Por favor, completa todos los campos");
                return;
            }

            const alumnoData = {
                numero_alumno: matricula,
                nombre_alumno: nombre,
                correo: correo
            };

            // Referencia a la colección seleccionada
            const clubCollection = collection(db, club);

            // Agregar el documento a la colección
            await addDoc(clubCollection, alumnoData);

            // Cerrar el diálogo y limpiar los campos
            handleClose();
        } catch (error) {
            console.error("Error al agregar alumno:", error);
            alert("Ocurrió un error al agregar el alumno");
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} slotProps={{ paper: { sx: { width: "600px", maxWidth: "none" } } }}>
            <DialogTitle>Agregar nuevo alumno</DialogTitle>
            <DialogContent>
                <Box
                    component="form"
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        width: "100%",
                        mt: 2
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
                    />
                    <TextField
                        id="nombre"
                        label="Nombre"
                        variant="standard"
                        fullWidth
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                    />
                    <TextField
                        id="correo"
                        label="Correo"
                        variant="standard"
                        fullWidth
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                    />
                    <FormControl fullWidth variant="standard">
                        <InputLabel id="club-select-label">Club</InputLabel>
                        <Select
                            labelId="club-select-label"
                            id="club-select"
                            value={club}
                            label="Club"
                            onChange={handleClubChange}
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
                <Button onClick={handleSubmit} variant="contained">
                    Guardar
                </Button>
            </DialogActions>
        </Dialog>
    );
}