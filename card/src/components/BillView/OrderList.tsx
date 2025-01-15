import { useState } from "react";
import { Box, Typography, IconButton, useTheme, Dialog, DialogTitle, DialogActions, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { CartItem } from "@/types/types";

interface OrderListProps {
  orders: CartItem[];
  onCancelItem: (itemId: string) => void;
}

export function OrderList({ orders, onCancelItem }: OrderListProps) {
  const theme = useTheme();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const calculateItemPrice = (item: CartItem) => {
    const basePrice = item.price;
    const complementPrice = item.complement
      ? item.complement.reduce((total, complement) => total + (complement.price || 0), 0)
      : 0;
    const totalPrice = basePrice + complementPrice;
    const sharedCount = (item.sharedWith?.length || 0) + 1;
    return (totalPrice / sharedCount).toFixed(2);
  };

  const handleDeleteClick = (itemId: string) => {
    setItemToDelete(itemId);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      onCancelItem(itemToDelete);
    }
    setConfirmOpen(false);
    setItemToDelete(null);
  };

  const handleCancel = () => {
    setConfirmOpen(false);
    setItemToDelete(null);
  };

  return (
    <>
      <Box>
        {orders.map((item) => (
          <Box
            key={item.uniqueId}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            py={1}
            sx={{
              borderBottom: "1px solid #ccc",
              padding: "8px 0",
            }}
          >
            <Box>
              <Typography variant="body1" fontWeight="bold">
                {item.name}
              </Typography>
              {item.complement && item.complement.length > 0 && (
                <Typography variant="body2" color="text.secondary">
                  Complementos: {item.complement.map((c) => c.name).join(", ")}
                </Typography>
              )}
              {item.sharedWith && item.sharedWith.length > 0 && (
                <Typography variant="body2" color="text.secondary">
                  Compartido con: {item.sharedWith.map((sw) => sw.name).join(", ")}
                </Typography>
              )}
              <Typography variant="body2" color="text.secondary">
                {item.status}
              </Typography>
            </Box>

            {/* Precio y botón */}
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant="body2" fontWeight="bold">
                {calculateItemPrice(item)}€
              </Typography>
              {item.status === "pendiente" && (
                <IconButton
                  onClick={() => handleDeleteClick(item.uniqueId)}
                  sx={{
                    color: theme.palette.error.main,
                    "&:hover": {
                      bgcolor: theme.palette.action.hover,
                      borderColor: theme.palette.primary.dark,
                    },
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>
          </Box>
        ))}
      </Box>
      <Dialog open={confirmOpen} onClose={handleCancel}>
        <DialogTitle>¿De verdad quieres cancelar el pedido de este plato?</DialogTitle>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
