"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  FormControlLabel,
  Box,
  Typography,
} from "@mui/material";
import { ShareModalProps } from "@/types/props";

export function ShareModal({ isOpen, onClose, guests, onShare }: ShareModalProps) {
  // Cambiamos el estado para manejar IDs de tipo `number`
  const [selectedGuests, setSelectedGuests] = useState<number[]>([]);

  const handleToggleGuest = (guestId: number) => {
    setSelectedGuests((prev) =>
      prev.includes(guestId) ? prev.filter((id) => id !== guestId) : [...prev, guestId]
    );
  };

  const handleShare = () => {
    const selectedGuestObjects = guests.filter((guest) => selectedGuests.includes(guest.id));
    onShare(selectedGuestObjects);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle variant="h6">Compartir con comensales</DialogTitle>

      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2}>
          {guests.map((guest) => (
            <FormControlLabel
              key={guest.id}
              control={
                <Checkbox
                  checked={selectedGuests.includes(guest.id)}
                  onChange={() => handleToggleGuest(guest.id)}
                />
              }
              label={<Typography>{guest.name}</Typography>}
            />
          ))}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleShare}
          disabled={selectedGuests.length === 0}
        >
          Compartir
        </Button>
      </DialogActions>
    </Dialog>
  );
}
