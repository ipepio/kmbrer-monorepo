import React, { useContext } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Box,
  Typography,
  Switch,
  FormControlLabel,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { ThemeContext } from "@/context/ThemeContext";
import useAxios from "@/hooks/useAxios"; // Asegúrate de que tu hook esté disponible

type Props = {
  isOpen: boolean;
  onClose: () => void;
  userData: { seatName: string; orderId: string };
};

export const SettingsModal = ({ isOpen, onClose, userData }: Props) => {
  const { toggleTheme, isDarkMode } = useContext(ThemeContext);
  const [isEditingName, setIsEditingName] = React.useState(false);
  const [editedName, setEditedName] = React.useState(userData.seatName || "Guest");
  const axiosInstance = useAxios(); // Instancia de Axios

  const handleNameEdit = () => {
    setIsEditingName(true);
  };

  const handleNameSave = async () => {
    try {
      // Guardar el nuevo nombre en localStorage
      const updatedUserData = { ...userData, seatName: editedName };
      localStorage.setItem("userData", JSON.stringify(updatedUserData));

      // Realizar la petición al endpoint con el nuevo nombre
      const response = await axiosInstance.post("/api/seat/confirm", {
        dinerName: editedName, // Pasamos el nuevo nombre
        orderId: userData.orderId, // Incluimos el Order ID
      });

      if (response.status === 200) {
        console.log("Nombre actualizado en el servidor:", response.data);
        // Desactivar la edición
        setIsEditingName(false);
      } else {
        console.error("Error actualizando el nombre en el servidor");
        alert("No se pudo actualizar el nombre. Inténtalo de nuevo.");
      }
    } catch (error) {
      console.error("Error durante la actualización del nombre:", error);
      alert("Ocurrió un error al actualizar el nombre. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
        <DialogTitle sx={{ padding: 0 }}>Settings</DialogTitle>
        <IconButton onClick={onClose}>
          <EditIcon />
        </IconButton>
      </Box>
      <DialogContent dividers>
        <Box mb={3}>
          <Typography variant="body2" color="primary">
            <a
              href="/terms-and-conditions"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Terms and Conditions
            </a>
          </Typography>
        </Box>

        {/* Nombre del usuario */}
        <Box display="flex" alignItems="center" mb={3}>
          <Typography variant="body1" fontWeight="bold" mr={2}>
            Name:
          </Typography>
          {isEditingName ? (
            <TextField
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              variant="outlined"
              size="small"
              sx={{ mr: 2 }}
            />
          ) : (
            <Typography variant="body1">{editedName}</Typography>
          )}
          <IconButton onClick={isEditingName ? handleNameSave : handleNameEdit}>
            <EditIcon />
          </IconButton>
        </Box>

        {/* Order ID */}
        <Box mb={3}>
          <Typography variant="body1" fontWeight="bold">
            Order ID:
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {userData.orderId}
          </Typography>
        </Box>

        {/* Cambiar tema */}
        <Box>
          <FormControlLabel
            control={
              <Switch
                checked={isDarkMode}
                onChange={toggleTheme}
                color="primary"
              />
            }
            label="Dark Mode"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
