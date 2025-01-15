import {
    Box,
    Typography,
    Modal,
    IconButton,
    useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { OrderItemsSummaryModalProps } from "@/types/props";
export function OrderItemsSummaryModal({
    open,
    onClose,
    guests,
    selectedOption,
}: OrderItemsSummaryModalProps) {
    const theme = useTheme();
    const groupedById = Object.values(
        guests
            .flatMap((guest) =>
                guest.selected || selectedOption === "full" ? guest.orderItems : []
            )
            .reduce((acc, item) => {
                const itemId = String(item.id); // Convertimos `id` a string explícitamente
                if (!acc[itemId]) {
                    acc[itemId] = { ...item, price: parseFloat(item.price as string) || 0 };
                } else {
                    acc[itemId].price += parseFloat(item.price as string) || 0;
                }
                return acc;
            }, {} as Record<string, { id: string; name: string; price: number }>)
    );
    const groupedByName = groupedById.reduce((acc, item) => {
        const existingItem = acc.find((i) => i.name === item.name);
        if (existingItem) {
            existingItem.quantity += 1;
            existingItem.price += item.price;
        } else {
            acc.push({ name: item.name, price: item.price, quantity: 1 });
        }
        return acc;
    }, [] as { name: string; price: number; quantity: number }[]);
    return (
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
                    Resumen de Orden
                </Typography>
                {groupedByName.map((item, index) => (
                    <Box key={index} display="flex" justifyContent="space-between" mt={2}>
                        <Typography variant="body2">
                            {item.name} {item.quantity > 1 ? `(x${item.quantity})` : ""}
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                            {item.price.toFixed(2)}€
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Modal>
    );
}
