import { Box, Button, Typography, useTheme } from '@mui/material';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import { SxProps, Theme } from '@mui/material';
import {GuestsWithOrders} from "@/types/types"
import useAxios from "@/hooks/useAxios";
import { redirectToRedsys } from "@/services/paymentService";

interface TotalAmountProps {
  totalPrice: string;
  numOfGuests: number;
  guests: GuestsWithOrders [],
  toggleModal: (type: 'personal' | 'full') => void;
  sx?: SxProps<Theme>;
}
export function TotalAmount({  
  totalPrice,
  numOfGuests,
  guests,
  toggleModal,
  sx,
}: TotalAmountProps) {
  const theme = useTheme();
const axiosInstance = useAxios();
const handlePayment = async () => {
  try{
  const orderId = JSON.parse(localStorage.getItem("userData") || "{}").orderId;  
    const response = await axiosInstance.post(`/api/payment/${orderId}/own-order`, {});
    redirectToRedsys(response.data);
  } catch (error) {
    console.error("Error during payment process:", error);
    alert("An error occurred while processing the payment. Please try again.");
  }
  };
  console.log("numOfGuests ->", numOfGuests)
  console.log("guests ->", guests)
  return (
    <Box
      display="flex"
      flexDirection="column" 
      justifyContent="space-between"
      alignItems="center"
      p={2}
      sx={{
        bgcolor: theme.palette.background.default,
        color: theme.palette.text.primary,
        borderTop: `1px solid ${theme.palette.divider}`,
        ...sx,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          color: theme.palette.text.primary,
          marginBottom: theme.spacing(1),
        }}
      >
        Total: {totalPrice}€
      </Typography>
      <Box display="flex" gap={2} width="100%">
        {guests.length > 0 ? (
          <>
            <Button
              variant="contained"
              sx={{
                bgcolor: theme.palette.success.main,
                color: theme.palette.success.contrastText,
                "&:hover": { bgcolor: theme.palette.success.dark },
                flex: 1,
              }}
              onClick={() => handlePayment()}
              startIcon={<CreditScoreIcon />}
            >
              Pagar mi cuenta
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                "&:hover": {
                  borderColor: theme.palette.primary.dark,
                  bgcolor: theme.palette.action.hover,
                },
                flex: 1,
              }}
              onClick={() => toggleModal("personal")}
              startIcon={<CreditScoreIcon />}
            >
              Más opciones
            </Button>
          </>
        ) : (
          <Button
            variant="contained"
            sx={{
              bgcolor: theme.palette.success.main,
              color: theme.palette.success.contrastText,
              "&:hover": { bgcolor: theme.palette.success.dark },
              flex: 1,
            }}
            onClick={() => handlePayment()}
            startIcon={<CreditScoreIcon />}
          >
            Pagar
          </Button>
        )}
      </Box>
    </Box>
  );
}
