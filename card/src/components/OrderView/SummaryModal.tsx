"use client";

import { useTheme } from "@mui/material/styles";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { OrderSummaryModalProps } from "@/types/props";

export function OrderSummaryModal({
  isOpen,
  onClose,
  cartItems,
  onConfirmOrder,
  onRemoveItem,
}: OrderSummaryModalProps) {
  const theme = useTheme();

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
      <DialogTitle variant="h6">Resumen del pedido</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2}>
          {cartItems.map((item, index) => (
            <Box
              key={index}
              display="flex"
              flexDirection="column"
              gap={1}
              borderBottom={`1px solid ${theme.palette.divider}`}
              pb={2}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography variant="body1" fontWeight="bold">
                    {item.name}
                  </Typography>
                  {item.complement && item.complement.length > 0 && (
                    <Typography variant="body2" color="text.secondary">
                      Complementos:{" "}
                      {item.complement.map((c) => c.name).join(", ")}
                    </Typography>
                  )}
                  {item.sharedWith && item.sharedWith.length > 0 && (
                    <Typography variant="body2" color="text.secondary">
                      Compartido con:{" "}
                      {item.sharedWith.map((sw) => sw.name).join(", ")}
                    </Typography>
                  )}
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <IconButton
                    aria-label="Eliminar item"
                    color="error"
                    onClick={() => onRemoveItem(item.uniqueId)}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <Typography>{item.price.toFixed(2)}€</Typography>
                </Box>
              </Box>
            </Box>
          ))}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            fontWeight="bold"
            mt={2}
          >
            <Typography fontWeight="bold">Total</Typography>
            <Typography fontWeight="bold">
              {cartItems
                .reduce((total, item) => total + item.price, 0)
                .toFixed(2)}€
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={onConfirmOrder}>
          Confirmar pedido
        </Button>
      </DialogActions>
    </Dialog>
  );
}
