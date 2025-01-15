import React, { useState } from 'react';
import { Box, Typography, Modal, TextField, Button, useTheme } from '@mui/material';
import { ConfirmModalProps } from "@/types/props"


export const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onConfirm }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState(false);
  const theme = useTheme();

  const handleConfirm = () => {
    if (!name.trim()) {
      setError(true);
      return;
    }
    setError(false);
    onConfirm(name.trim());
  };

  return (
    <Modal open={isOpen} onClose={() => {}}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: theme.palette.background.paper,
          borderRadius: theme.shape.borderRadius,
          boxShadow: theme.shadows[5],
          p: 4,
          width: 400,
        }}
      >
        <Typography variant="h6" gutterBottom>
          ¡Un momento! Ayúdanos a organizar mejor tu experiencia
        </Typography>
        <Typography variant="body2" sx={{ mb: 3 }}>
          Por favor, indícanos tu nombre. Esto nos ayudará a gestionar de forma más eficiente a los comensales y brindar un servicio personalizado.
        </Typography>
        <TextField
          label="Tu nombre"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={error}
          helperText={error ? 'El nombre es obligatorio' : ''}
        />
        <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
          <Button
            variant="contained"
            onClick={handleConfirm}
            sx={{
              bgcolor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              '&:hover': { bgcolor: theme.palette.primary.dark },
            }}
          >
            Confirmar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
