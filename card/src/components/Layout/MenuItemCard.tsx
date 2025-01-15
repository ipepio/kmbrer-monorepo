"use client";

import {
    Card,
    CardContent,
    CardHeader,
    Typography,
    IconButton,
    Box,
    useTheme,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddBoxIcon from '@mui/icons-material/AddBox';
import AddIcon from "@mui/icons-material/Add";
import PieChartIcon from '@mui/icons-material/PieChart';
import { MenuItem, CartItem } from "@/types/types";

interface MenuItemCardProps {
    item: MenuItem;
    cartItems: CartItem[];
    onAddToCart: () => void;
    onRemoveFromCart: () => void;
    onShare: () => void;
    onSelectComplement?: () => void;
    onItemClick: () => void;
}

export function MenuItemCard({
    item,
    cartItems,
    onAddToCart,
    onRemoveFromCart,
    onShare,
    onSelectComplement,
    onItemClick,
}: MenuItemCardProps) {
    const theme = useTheme(); // Acceso al tema
    const itemCount = cartItems.filter((cartItem) => cartItem.menuItemId === item.id).length;

    return (
        <Card
            onClick={onItemClick}
            sx={{
                width: "100%",
                cursor: "pointer",
                "&:hover": {
                    boxShadow: theme.shadows[4], // Sombra al pasar el ratón
                },
            }}
        >
            <CardHeader
                title={<Typography variant="h6">{item.name}</Typography>}
                subheader={<Typography variant="body2">{item.description}</Typography>}
                sx={{ bgcolor: theme.palette.background.paper }}
            />
            <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {item.price.toFixed(2)}€
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                    {/* Botón Compartir Plato */}
                    <IconButton
                        onClick={(e) => {
                            e.stopPropagation();
                            onShare();
                        }}
                        sx={{
                            color: theme.palette.primary.main,
                            border: `1px solid ${theme.palette.primary.main}`, // Imitar el borde del botón original
                            "&:hover": {
                                bgcolor: theme.palette.action.hover,
                                borderColor: theme.palette.primary.dark,
                            },
                        }}
                    >
                        <PieChartIcon />
                    </IconButton>


                    {/* Botón para eliminar del carrito */}
                    {itemCount > 0 && (
                        <>
                            <IconButton
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onRemoveFromCart();
                                }}
                                sx={{
                                    color: theme.palette.error.main,
                                    border: `1px solid ${theme.palette.error.main}`, // Imitar el borde del botón original
                                    "&:hover": {
                                        bgcolor: theme.palette.action.hover,
                                        borderColor: theme.palette.error.dark,
                                    },
                                }}
                            >
                                <RemoveIcon />
                            </IconButton>

                            <Typography variant="body1">{itemCount}</Typography>
                        </>
                    )}

                    {/* Botón para agregar o seleccionar complementos */}
                    {item.hasComplements ? (
                        <IconButton
                            onClick={(e) => {
                                e.stopPropagation();
                                onSelectComplement?.();
                            }}
                            sx={{
                                color: theme.palette.primary.main,
                                border: `1px solid ${theme.palette.primary.main}`, // Imitar borde del botón original
                                "&:hover": {
                                    bgcolor: theme.palette.action.hover,
                                    borderColor: theme.palette.primary.dark,
                                },
                            }}
                        >
                            {itemCount === 0 ? <AddBoxIcon /> : <AddIcon />}
                        </IconButton>

                    ) : (
                        <IconButton
                            onClick={(e) => {
                                e.stopPropagation();
                                onAddToCart();
                            }}
                            sx={{
                                bgcolor: theme.palette.success.main,
                                color: theme.palette.success.contrastText,
                                "&:hover": {
                                    bgcolor: theme.palette.success.dark,
                                },
                            }}
                        >
                            <AddIcon />
                        </IconButton>

                    )}
                </Box>
            </CardContent>
        </Card>
    );
}
