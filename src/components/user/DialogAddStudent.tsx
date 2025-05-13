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
  import React from "react";
  
  interface DialogAddStudentProps {
    open: boolean;
    onClose: () => void;
  }
  
  export function DialogAddStudent({ open, onClose }: DialogAddStudentProps) {
    const [age, setAge] = React.useState("");
  
    const handleChange = (event: SelectChangeEvent) => {
      setAge(event.target.value as string);
    };
  
    const handleClose = () => {
      setAge(""); 
      onClose();
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
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              id="matricula"
              label="Matrícula"
              variant="standard"
              fullWidth
            />
            <TextField
              id="nombre"
              label="Nombre"
              variant="standard"
              fullWidth
            />
            <TextField
              id="correo"
              label="Correo"
              variant="standard"
              fullWidth
            />
            <FormControl fullWidth variant="standard">
              <InputLabel id="club-select-label">Club</InputLabel>
              <Select
                labelId="club-select-label"
                id="club-select"
                value={age}
                label="Club"
                onChange={handleChange}
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
          <Button onClick={handleClose} variant="contained">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    );
  }