import { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemText,
    Collapse,
    IconButton,
    Typography,
    Button,
    Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { GuestsWithOrders } from "@/types/types";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    guests: GuestsWithOrders[];
};

export const GuestSummaryModal = ({ isOpen, onClose, guests }: Props) => {
    const [expandedGuest, setExpandedGuest] = useState<number | null>(null);

    const handleToggle = (guestId: number) => {
        setExpandedGuest((prev) => (prev === guestId ? null : guestId)); // Alternar entre expandir y colapsar
    };

    return (
        <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
            <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
                <DialogTitle sx={{ padding: 0 }}>Comnensales</DialogTitle>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </Box>
            <DialogContent dividers>
                <List>
                    {guests.map((guest) => (
                        <Box
                            key={guest.guest.id}
                            sx={{
                                mb: 2,
                                transition: "all 0.3s ease",
                            }}
                        >
                            <ListItem
                                component="div"
                                onClick={() => handleToggle(guest.guest.id)}
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    cursor: "pointer", // Añadir un cursor tipo "pointer" para que parezca interactivo
                                }}
                            >
                                <Typography variant="body1" fontWeight="bold">
                                    {guest.guest.name}
                                </Typography>
                                {expandedGuest === guest.guest.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            </ListItem>

                            <Collapse in={expandedGuest === guest.guest.id} timeout="auto" unmountOnExit>
                                <List disablePadding>
                                    {guest.orderItems.map((item) => (
                                        <ListItem
                                            key={item.id}
                                            sx={{
                                                pl: 4,
                                                bgcolor: "background.paper",
                                            }}
                                        >
                                            <ListItemText primary={item.name} />
                                        </ListItem>
                                    ))}
                                </List>
                            </Collapse>
                        </Box>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary" variant="contained">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};
