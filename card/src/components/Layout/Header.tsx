import React from 'react';
import { AppBar, Toolbar, Box, Typography, Avatar } from '@mui/material';

interface HeaderProps {
    restaurantData: {
        name: string;
        imageUrl: string;
        tableNumber: string;
    } | null;
    user: { id: string; seatName: string; token: string } | null
}

export const Header: React.FC<HeaderProps> = ({ restaurantData, user }) => {
    return (
            <AppBar position="static" sx={{
                backgroundColor: "inherit",
                boxShadow: "none", p: 1, borderRadius: "16px",
                            bgcolor: 'background.paper' ,
                            color: 'primary.contrastText',
                            marginBottom: "1vh"
            }}>
                <Toolbar sx={{ display: "flex", alignItems: "center", gap: 2}}>
                    {restaurantData?.imageUrl && (
                        <Avatar
                            src={restaurantData.imageUrl}
                            alt={restaurantData?.name || "Restaurant"}
                            sx={{ width: 48, height: 48, borderRadius: "16px"}}
                        />
                    )}
                    <Box sx={{ display: "flex", flexDirection: "column"}}>
                        <Typography variant="h6" sx={{ color: "text.primary", fontWeight: "bold" }}>
                            {restaurantData?.name || "Cargando..."}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                            {user?.seatName ? `Comensal: ${user.seatName}` : "Cargando comensal..."}
                            {restaurantData?.tableNumber ? ` | Mesa: ${restaurantData.tableNumber}` : ""}
                        </Typography>
                    </Box>
                </Toolbar>
            </AppBar>
        // </Box>
    );
};
