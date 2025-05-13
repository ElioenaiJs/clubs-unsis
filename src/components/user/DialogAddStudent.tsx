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
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Agregar nuevo alumno</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          sx={{ "& > :not(style)": { m: 1, width: "25ch" } }}
          noValidate
          autoComplete="off"
        >
          <TextField id="standard-basic" label="Matrícula" variant="standard" />
          <TextField id="standard-basic" label="Nombre" variant="standard" />
          <TextField id="standard-basic" label="Correo" variant="standard" />
          <InputLabel id="demo-simple-select-label">Club</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={age}
            label="Age"
            onChange={handleChange}
          >
            <MenuItem value={'club_ajedrez'}>Ajedrez</MenuItem>
            <MenuItem value={'club_danza'}>Danza</MenuItem>
            <MenuItem value={'club_taekwondo'}>Taekwondo</MenuItem>
          </Select>
        </Box>{" "}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={onClose} variant="contained">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
