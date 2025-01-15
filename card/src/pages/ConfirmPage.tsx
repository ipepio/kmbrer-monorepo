import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConfirmModal } from '@/components/Confirm/ConfirmModal';
import useAxios from '@/hooks/useAxios';
import { useUserContext } from '@/context/UserContext';
const ConfirmPage: React.FC = () => {
  const axiosInstance = useAxios();
  const navigate = useNavigate();
  // const pendingSession = JSON.parse(localStorage.getItem('pendingSession') || '{}');
  const [isModalOpen
    // , setModalOpen
  ] = useState(true);
  const { setUser } = useUserContext(); // Importa setUser del contexto


  useEffect(() => {
    const pendingSession = localStorage.getItem("pendingSession");
    if (!pendingSession) {
      navigate("/scan");
    }
  }, [navigate]);

  const handleConfirm = async (name: string) => {
    try {
      const pendingSession = JSON.parse(localStorage.getItem("pendingSession") || "{}");
      const response = await axiosInstance.post("/api/seat/confirm", {
        ...pendingSession,
        dinerName: name,
      });
      if (response.data.status === "success") {
        const userData = {
          seatId: response.data.seat.id,
          seatName: response.data.seat.name,
          token: pendingSession.token || null,
          orderId: response.data.orderId,
          status: response.data.status,
        };
        localStorage.setItem("userData", JSON.stringify(userData));
        const userContext = {
          id: response.data.seat.id,
          seatName: response.data.seat.name,
          token: pendingSession.token || null,
        };
        
        setUser(userContext);
        localStorage.removeItem("pendingSession");
        navigate("/");
      }
    } catch (error) {
      console.error("Error al confirmar la sesión:", error);
      alert("Error al confirmar la sesión. Por favor, inténtalo de nuevo.");
    }
  };


  return (
    <div>
      {/* <h1>Confirma tu sesión</h1> */}
      {/* <p>Datos de la sesión pendiente: {JSON.stringify(pendingSession)}</p> */}
      <ConfirmModal isOpen={isModalOpen} onConfirm={handleConfirm} />
    </div>
  );
};

export default ConfirmPage;
