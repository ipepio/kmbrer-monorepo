"use client";

import { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Checkbox,
  FormControlLabel,
  useTheme,
  Typography,
  Box,
} from "@mui/material";
import { ComplementModalProps } from "@/types/props";

export function ComplementModal({ isOpen, onClose, complements, onSelect }: ComplementModalProps) {
  const [selectedComplements, setSelectedComplements] = useState<string[]>([]);
  const theme = useTheme();

  const handleToggleComplement = (complementId: string) => {
    setSelectedComplements((prev) =>
      prev.includes(complementId)
        ? prev.filter((id) => id !== complementId)
        : [...prev, complementId]
    );
  };

  const handleConfirmSelection = () => {
    const selectedComplementObjects = complements.filter((complement) =>
      selectedComplements.includes(complement.id)
    );
    onSelect(selectedComplementObjects);
    setSelectedComplements([]);
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          bgcolor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          borderRadius: theme.shape.borderRadius,
        },
      }}
    >
      <DialogTitle variant="h6">Elige los complementos</DialogTitle>

      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2}>
          {complements.map((complement) => (
            <FormControlLabel
              key={complement.id}
              control={
                <Checkbox
                  checked={selectedComplements.includes(complement.id)}
                  onChange={() => handleToggleComplement(complement.id)}
                />
              }
              label={<Typography>{complement.name} + {complement.price}€ </Typography>}
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
          onClick={handleConfirmSelection}
          disabled={selectedComplements.length === 0}
        >
          Añadir
        </Button>
      </DialogActions>
    </Dialog>
  );
}
