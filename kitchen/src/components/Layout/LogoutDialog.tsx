import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import LogoutIcon from '@mui/icons-material/Logout';

interface LogoutDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LogoutDialog({ open, onClose, onConfirm }: LogoutDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 2,
          p: 2,
          maxWidth: '300px'
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <LogoutIcon sx={{ fontSize: 40 }} />
      </Box>
      <DialogContent>
        <DialogContentText align="center">
          ¿Seguro que deseas cerrar sesión?
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ flexDirection: 'column', gap: 1 }}>
        <Button
          variant="contained"
          onClick={onClose}
          fullWidth
          sx={{ bgcolor: 'grey.300', color: 'text.primary' }}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={onConfirm}
          fullWidth
          color="primary"
        >
          Cerrar sesión
        </Button>
      </DialogActions>
    </Dialog>
  );
}

