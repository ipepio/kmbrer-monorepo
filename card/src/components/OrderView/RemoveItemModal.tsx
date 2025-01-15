"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  Typography,
} from "@mui/material";
import { CartItem } from "@/types/types";
import { RemoveItemModalProps } from "@/types/props";

export function RemoveItemModal({ isOpen, onClose, items, onConfirm }: RemoveItemModalProps) {
  const [selectedItem, setSelectedItem] = useState<CartItem | null>(null);

  useEffect(() => {
    if (items.length > 0) {
      setSelectedItem(items[0]);
    }
  }, [items]);

  const handleConfirm = () => {
    if (selectedItem) {
      onConfirm(selectedItem.uniqueId);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Selecciona el ítem a eliminar</DialogTitle>
      <DialogContent>
        <RadioGroup
          value={selectedItem?.uniqueId || ""}
          onChange={(e) => {
            const selected = items.find((item) => item.uniqueId === e.target.value) || null;
            setSelectedItem(selected);
          }}
        >
          {items.map((item) => (
            <FormControlLabel
              key={item.uniqueId}
              value={item.uniqueId}
              control={<Radio />}
              label={
                <Typography>
                  Complementos: {item.complement?.map((c) => c.name).join(", ") || "Ninguno"}<br />
                  Compartido con: {item.sharedWith?.map((d) => d.name).join(", ") || "Nadie"}
                </Typography>
              }
            />
          ))}
        </RadioGroup>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          disabled={!selectedItem}
        >
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
