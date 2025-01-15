import React, { useState } from 'react';
import { IconButton, Badge } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationModal from './NotificationModal';
import { useOrdersContext } from '@/context/OrderContext';

const NotificationButton: React.FC = () => {
  const { notifications } = useOrdersContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <IconButton color="primary" onClick={() => setIsModalOpen(true)}>
        <Badge badgeContent={notifications.length} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <NotificationModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default NotificationButton;
