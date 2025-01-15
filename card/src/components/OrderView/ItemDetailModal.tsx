"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { MenuItem, Guest } from "@/types/types";
import { useEffect, useState } from "react";

interface ItemDetailModalProps {
  isOpen: boolean;
  item: MenuItem | null;
  onClose: () => void;
  onAdd: (comments: string) => void;
  onShare: (comments: string) => void;
  onSelectComplement: (comments: string) => void;
  guests: Guest[];
}

export function ItemDetailModal({
  isOpen,
  item,
  onClose,
  onAdd,
  onShare,
  onSelectComplement,
  guests,
}: ItemDetailModalProps) {
  const [comments, setComments] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setComments("");
    }
  }, [isOpen]);

  if (!item) return null;
  
  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{item.name}</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2}>
          <img
            src={item.image || "/placeholder.svg"}
            alt={item.name}
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "8px",
              objectFit: "cover",
            }}
          />
          <Typography>{item.description}</Typography>
          <TextField
            label="Comentarios"
            fullWidth
            multiline
            rows={3}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        {guests.length > 0 && (
          <Button variant="outlined" onClick={() => onShare(comments)}>
            Compartir
          </Button>
        )}
        {item.hasComplements ? (
          <Button variant="contained" onClick={() => onSelectComplement(comments)}>
            Elegir complemento
          </Button>
        ) : (
          <Button variant="contained" onClick={() => onAdd(comments)}>
            Añadir
          </Button>
        )}
        <Button variant="text" onClick={onClose}>
          Volver
        </Button>
      </DialogActions>
    </Dialog>
  );
}
