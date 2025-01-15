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
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddIcon from "@mui/icons-material/Add";
import PieChartIcon from "@mui/icons-material/PieChart";
import { MenuItemCardViewProps } from "@/types/props";

export function MenuItemCardView({
    item,
    itemCount,
    onItemClick,
    onAddClick,
    onRemoveClick,
    onShareClick,
    guests,
}: MenuItemCardViewProps) {
    const theme = useTheme();

    return (
        <Card
            onClick={onItemClick}
            sx={{
                width: "100%",
                cursor: "pointer",
                "&:hover": {
                    boxShadow: theme.shadows[4],
                },
                borderRadius: "16px"
            }}
        >
            <CardHeader
                title={<Typography variant="h6" component="div">{item.name}</Typography>}
                subheader={<Typography variant="body2">{item.description}</Typography>}
                sx={{ bgcolor: theme.palette.background.paper,
                }
            }
            />

            <CardContent
                sx={{ display: "flex", justifyContent: "space-between", alignItems: "center"}}
            >
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {item.price.toFixed(2)}€
                </Typography>
                <Box display="flex" alignItems="center"  gap={1} >
                    {guests.length > 0 && (
                        <IconButton
                            onClick={(e) => {
                                e.stopPropagation();
                                onShareClick();
                            }}
                            sx={{
                                color: theme.palette.action.active,
                                "&:hover": {
                                    bgcolor: theme.palette.action.hover,
                                    borderColor: theme.palette.primary.dark,
                                },
                            }}
                        >
                            <PieChartIcon />
                        </IconButton>
                    )}
                    {itemCount > 0 && (
                        <>
                            <IconButton
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onRemoveClick();
                                }}
                                sx={{
                                    color: theme.palette.error.main,
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
                    <IconButton
                        onClick={(e) => {
                            e.stopPropagation();
                            onAddClick();
                        }}
                        sx={{
                            color: theme.palette.action.active,
                            "&:hover": {
                                bgcolor: theme.palette.action.hover,
                                borderColor: theme.palette.primary.dark,
                            },
                        }}
                    >
                        {!item.hasComplements ? <AddIcon /> : <AddCircleOutlineIcon />}
                    </IconButton>
                </Box>
            </CardContent>
        </Card>
    );
}
