// DialogAddStudent.tsx
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

interface DialogAddStudentProps {
  open: boolean;
  onClose: () => void;
}

export function DialogAddStudent({ open, onClose }: DialogAddStudentProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Agregar nuevo alumno</DialogTitle>
      <DialogContent>
        {/* Contenido del formulario */}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={onClose} variant="contained">Guardar</Button>
      </DialogActions>
    </Dialog>
  );
}