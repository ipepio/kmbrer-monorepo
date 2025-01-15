import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Modal,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  useTheme,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { PaymentOptionsModalProps } from "@/types/props";
import { OrderItemsSummaryModal } from "./OrderItemsSummaryModal";
import CreditCardIcon from '@mui/icons-material/CreditCard';
import SummarizeIcon from '@mui/icons-material/Summarize';
import useAxios from "@/hooks/useAxios";
import { redirectToRedsys } from "@/services/paymentService";

export function PaymentOptionsModal({
  open,
  onClose,
  selectedOption,
  setSelectedOption,
  setSelectedGuests,
  guests = [],
}: PaymentOptionsModalProps) {
  const theme = useTheme();
  const axiosInstance = useAxios();

  const [showSummary, setShowSummary] = useState(false);
  const sortedGuests = useMemo(() => {
    return [
      ...guests.filter((guest) => guest.guest.isUser),
      ...guests.filter((guest) => !guest.guest.isUser),
    ];
  }, [guests]);

  const handlePayment = async () => {
    try {
      const orderId = JSON.parse(localStorage.getItem("userData") || "{}").orderId;
  
      // Verificar si se selecciona la opción "full"
      const selectedGuests =
        selectedOption === "full"
          ? guests.map((guest) => ({
              id: guest.guest.id,
              name: guest.guest.name,
              items: guest.orderItems.map((item) => ({
                id: item.id,
                name: item.name,
                price: item.price,
              })),
            }))
          : guests
              .filter((guest) => guest.selected) // Filtrar solo los seleccionados
              .map((guest) => ({
                id: guest.guest.id,
                name: guest.guest.name,
                items: guest.orderItems.map((item) => ({
                  id: item.id,
                  name: item.name,
                  price: item.price,
                })),
              }));
  
      // Realizar la solicitud
      const response = await axiosInstance.post(`/api/payment/${orderId}/card`, {
        items: selectedGuests,
      });
  
      // Redirigir a Redsys
      redirectToRedsys(response.data);
    } catch (error) {
      console.error("Error during payment process:", error);
      alert("An error occurred while processing the payment. Please try again.");
    }
  };
  

  const totalPrice = useMemo(() => {
    return guests.reduce((total, guest) => {
      const guestTotal = guest.orderItems?.reduce((sum, item) => {
        const price = typeof item.price === "number" ? item.price : parseFloat(item.price) || 0;
        return sum + price;
      }, 0) || 0;

      return total + guestTotal;
    }, 0);
  }, [guests]);
  const calculatedPrice = useMemo(() => {
    const numOfGuests = guests.length;

    if (selectedOption === "full") {
      return totalPrice;
    }

    if (selectedOption === "split") {
      const selectedCount = guests.filter((guest) => guest.selected).length || 1;
      return (totalPrice / numOfGuests) * selectedCount;
    }

    if (selectedOption === "specific") {
      return guests
        .filter((guest) => guest.selected)
        .reduce((total, guest) => {
          const guestTotal = guest.orderItems?.reduce((sum, item) => {
            const price = typeof item.price === "number" ? item.price : parseFloat(item.price) || 0;
            return sum + price;
          }, 0) || 0;

          return total + guestTotal;
        }, 0);
    }

    return 0;
  }, [guests, selectedOption, totalPrice]);

  useEffect(() => {
    const userGuest = sortedGuests.find((guest) => guest.guest.isUser);
    if (userGuest && !userGuest.selected) {
      userGuest.selected = true;
      setSelectedGuests((prev) => [...prev, userGuest.guest.id]);
    }
  }, [sortedGuests, setSelectedGuests]);

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: theme.palette.background.paper,
            borderRadius: theme.shape.borderRadius,
            boxShadow: theme.shadows[5],
            p: 4,
            color: theme.palette.text.primary,
          }}
        >
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>

          <Typography variant="h6" gutterBottom>
            Opciones de pago
          </Typography>
          <RadioGroup
            value={selectedOption}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSelectedOption(e.target.value as "full" | "split" | "specific")
            }
          >
            <FormControlLabel
              value="full"
              control={<Radio color="secondary" />}
              label="Pagar toda la cuenta"
            />
            <FormControlLabel
              value="split"
              control={<Radio color="secondary" />}
              label="Pagar de forma equitativa"
            />
            <FormControlLabel
              value="specific"
              control={<Radio color="secondary" />}
              label="Pagar por comensales específicos"
            />
          </RadioGroup>

          {(selectedOption === "split" || selectedOption === "specific") && (
            <Box mt={2}>
              <Typography variant="body2" gutterBottom>
                Selecciona los comensales:
              </Typography>
              {sortedGuests.map((guest) => (
                <FormControlLabel
                  key={guest.guest.id}
                  control={
                    <Checkbox
                      checked={guest.selected}
                      disabled={guest.guest.isUser}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        guest.selected = isChecked;
                        setSelectedGuests(
                          guests.filter((guest) => guest.selected).map((g) => g.guest.id)
                        );
                      }}
                    />
                  }
                  label={
                    guest.guest.isUser
                      ? `${guest.guest.name} (Tú)`
                      : guest.guest.name
                  }
                />
              ))}
            </Box>
          )}

          <Box mt={3} display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body1" fontWeight="bold">
              Total: {calculatedPrice.toFixed(2)}€
            </Typography>
          </Box>
          <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
            <Button
              variant="outlined"
              sx={{
                borderColor: theme.palette.info.main,
                color: theme.palette.info.main,
                "&:hover": {
                  borderColor: theme.palette.info.dark,
                  bgcolor: theme.palette.action.hover,
                },
                flex: 1,
              }}
              onClick={() => setShowSummary(true)}
              startIcon={<SummarizeIcon />}
            >
              Ver Resumen
            </Button>
            <Button
              variant="contained"
              sx={{
                bgcolor: theme.palette.success.main,
                color: theme.palette.success.contrastText,
                "&:hover": { bgcolor: theme.palette.success.dark },
                flex: 1,
              }}
              // onClick={() =>
              //   onConfirm(
              //     selectedOption,
              //     selectedOption === "specific"
              //       ? { selectedGuests: guests.filter((guest) => guest.selected) }
              //       : undefined
              //   )
              // }
              onClick={handlePayment} // Llama al manejo de pago
              startIcon={<CreditCardIcon />}
            >
              Pagar
            </Button>
          </Box>
        </Box>
      </Modal>
      <OrderItemsSummaryModal
        open={showSummary}
        onClose={() => setShowSummary(false)}
        guests={guests.map((guest) => ({
          guest: {
            id: guest.guest.id,
            name: guest.guest.name,
            isUser: guest.guest.isUser,
          },
          selected: guest.selected,
          orderItems: guest.orderItems.map((item) => ({
            id: String(item.id),
            name: item.name,
            price: typeof item.price === "number" ? item.price : parseFloat(item.price) || 0,
          })),
        }))}
        selectedOption={selectedOption}
      />

    </>
  );
}
