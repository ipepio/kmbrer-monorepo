import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Button,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useGuests } from "@/hooks/useGuests";
import { calculateItemPrice } from "@/utils/calculatePrice";
import { OrderList } from "./OrderList";
import { TotalAmount } from "./TotalAmount";
import { BillViewProps } from "@/types/props";

export function BillView({ orders, onClose, onCancelItem, toggleModal, numOfGuests }: BillViewProps) {
  const theme = useTheme();
  const { guestsWithOrders } = useGuests();
  const totalPrice = orders
    .reduce((total, item) => total + calculateItemPrice(item), 0)
    .toFixed(2);

  return (
    <Card
      sx={{
        width: 400,
        maxHeight: "90vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardHeader
        title="Tu cuenta"
        action={
          <Button size="small" onClick={onClose}>
            <CloseIcon />
          </Button>
        }
        sx={{ bgcolor: theme.palette.primary.main }}
      />
      <Divider />
      <CardContent>
        <OrderList orders={orders} onCancelItem={onCancelItem} />
      </CardContent>
      <Divider />
      <TotalAmount
        totalPrice={totalPrice}
        numOfGuests={numOfGuests}
        guests={guestsWithOrders}
        toggleModal={toggleModal}
      />
    </Card>
  );
}
