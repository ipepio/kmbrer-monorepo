// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import useAxios from "@/hooks/useAxios";
// import { IDetectedBarcode, Scanner } from "@yudiel/react-qr-scanner";
// import Button from "@mui/material/Button";
// import TextField from "@mui/material/TextField";
// import ReceiptIcon from "@mui/icons-material/Receipt";
// import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
// import CancelIcon from "@mui/icons-material/Cancel";

// const ScanPage: React.FC = () => {
//   const [tableCode, setTableCode] = useState("");
//   const [isScanning, setIsScanning] = useState(false);
//   const navigate = useNavigate();
//   const { tableId } = useParams();
//   const axiosInstance = useAxios();

//   useEffect(() => {
//     if (tableId) handleTableFetch(tableId);
//   }, [tableId]);

//   const handleTableFetch = async (code: string) => {
//     try {
//       const response = await axiosInstance.get(`/api/tables/open/${code}`);
//       const { status, confirmation_required, seat, order } = response.data;
//       let token: string | null = null;
//       const userData = localStorage.getItem("userData");
//       if (userData) {
//         const parsedUserData = JSON.parse(userData);
//         token = parsedUserData.token || null;
//       }
//       if (!token) {
//         const pendingSession = localStorage.getItem("pendingSession");
//         if (pendingSession) {
//           const parsedSession = JSON.parse(pendingSession);
//           token = parsedSession.token || null;
//         }
//       }
//       if (status === "success") {
//         if (!localStorage.getItem("userData")) {
//           const newUserData = {
//             seatId: seat.id,
//             seatName: seat.name,
//             token,
//             orderId: order.id,
//             status,
//           };
//           localStorage.setItem("userData", JSON.stringify(newUserData));
//         }
//         navigate("/");
//       } else if (confirmation_required) {
//         localStorage.setItem("pendingSession", JSON.stringify(response.data));
//         navigate("/confirm");
//       } else {
//         alert("Error al procesar la mesa. Inténtalo de nuevo.");
//       }
//     } catch (error) {
//       setIsScanning(false); // Close the scanner on error
//       console.error("Error al obtener datos de la mesa:", error);
//       alert("Código inválido o mesa no encontrada.");
//       localStorage.clear();
//       navigate("/scan");
//     }
//   };

//   const handleScan = async () => {
//     if (tableCode.trim()) {
//       await handleTableFetch(tableCode);
//     } else {
//       alert("Por favor, introduce un código válido.");
//     }
//   };

//   const handleQrScan = (data: IDetectedBarcode[] | null) => {
//     if (data) {
//       try {
//         const url = new URL(data[0].rawValue);
//         const tableCodeParam = url.searchParams.get("tableCode");
//         if (tableCodeParam) {
//           handleTableFetch(tableCodeParam);
//           setIsScanning(false); // Stop scanning after a successful scan
//         } else {
//           setIsScanning(false); // Close the scanner on error
//           alert("Código QR inválido.");
//         }
//       } catch (error) {
//         setIsScanning(false); // Close the scanner on error
//         console.error("Error al procesar el código QR:", error);
//         alert("Error al procesar el código QR.");
//       }
//     }
//   };

//   return (
//     <div>
//       <h1>Escanea el código</h1>
//       <TextField
//         label="Código de la mesa"
//         variant="outlined"
//         fullWidth
//         value={tableCode}
//         onChange={(e) => setTableCode(e.target.value)}
//         sx={{
//           marginBottom: "20px",
//           "& .MuiOutlinedInput-root": {
//             borderRadius: "12px",
//             backgroundColor: "#fff", // Fondo blanco del input
//           },
//           "& .MuiOutlinedInput-input": {
//             padding: "10px", // Mejor ajuste visual
//             color: "#000", // Texto negro, incluso en modo oscuro
//           },
//         }}
//       />
//       <Button
//         variant="contained"
//         onClick={handleScan}
//         startIcon={<ReceiptIcon />}
//         sx={{
//           bgcolor: (theme) => theme.palette.primary.main,
//           borderRadius: "12px", // Borde redondeado
//           width: "100%",
//           height: "50px",
//           textAlign: "center",
//           marginBottom: "10px",
//         }}
//       >
//         Confirmar
//       </Button>
//       <Button
//         variant="contained"
//         onClick={() => setIsScanning(true)}
//         startIcon={<QrCodeScannerIcon />}
//         sx={{
//           bgcolor: (theme) => theme.palette.secondary.main,
//           borderRadius: "18px", // Borde redondeado
//           width: "100%",
//           height: "50px",
//           textAlign: "center",
//         }}
//       >
//         Escanear QR
//       </Button>

//       {isScanning && (
//         <div style={{ marginTop: "20px" }}>
//           <Scanner
//             onScan={(result) => {
//               handleQrScan(result);
//             }}
//             onError={(error) => {
//               setIsScanning(false); // Close the scanner on error
//               console.error("Error del escáner:", error);
//             }}
//             constraints={{ facingMode: "environment" }}
//           />
//           <Button
//             variant="contained"
//             onClick={() => setIsScanning(false)}
//             startIcon={<CancelIcon />}
//             sx={{
//               bgcolor: (theme) => theme.palette.error.main,
//               borderRadius: "12px", // Borde redondeado
//               width: "100%",
//               height: "50px",
//               textAlign: "center",
//               marginTop: "10px",
//             }}
//           >
//             Cerrar escáner
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ScanPage;
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAxios from "@/hooks/useAxios";
import { IDetectedBarcode, Scanner } from "@yudiel/react-qr-scanner";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import ReceiptIcon from "@mui/icons-material/Receipt";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import CancelIcon from "@mui/icons-material/Cancel";

const ScanPage: React.FC = () => {
  const [tableCode, setTableCode] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const axiosInstance = useAxios();
  const hasFetched = useRef(false); // Flag para evitar múltiples peticiones

  useEffect(() => {
    // Detectar tableCode en la URL y asegurarse de que solo se haga una vez la petición
    const params = new URLSearchParams(location.search);
    const urlTableCode = params.get("tableCode");

    if (urlTableCode && !hasFetched.current) {
      hasFetched.current = true; // Marcar como procesado
      handleTableFetch(urlTableCode);
    }
  }, [location.search]);

  const handleTableFetch = async (code: string) => {
    try {
      const response = await axiosInstance.get(`/api/tables/open/${code}`);
      const { status, confirmation_required, seat, order } = response.data;
      let token: string | null = null;
      const userData = localStorage.getItem("userData");
      if (userData) {
        const parsedUserData = JSON.parse(userData);
        token = parsedUserData.token || null;
      }
      if (!token) {
        const pendingSession = localStorage.getItem("pendingSession");
        if (pendingSession) {
          const parsedSession = JSON.parse(pendingSession);
          token = parsedSession.token || null;
        }
      }
      if (status === "success") {
        if (!localStorage.getItem("userData")) {
          const newUserData = {
            seatId: seat.id,
            seatName: seat.name,
            token,
            orderId: order.id,
            status,
          };
          localStorage.setItem("userData", JSON.stringify(newUserData));
        }
        navigate("/");
      } else if (confirmation_required) {
        localStorage.setItem("pendingSession", JSON.stringify(response.data));
        navigate("/confirm");
      } else {
        alert("Error al procesar la mesa. Inténtalo de nuevo.");
      }
    } catch (error) {
      setIsScanning(false); // Close the scanner on error
      console.error("Error al obtener datos de la mesa:", error);
      alert("Código inválido o mesa no encontrada.");
      localStorage.clear();
      navigate("/scan");
    }
  };

  const handleScan = async () => {
    if (tableCode.trim()) {
      await handleTableFetch(tableCode);
    } else {
      alert("Por favor, introduce un código válido.");
    }
  };

  const handleQrScan = (data: IDetectedBarcode[] | null) => {
    if (data) {
      try {
        const url = new URL(data[0].rawValue);
        const tableCodeParam = url.searchParams.get("tableCode");
        if (tableCodeParam) {
          handleTableFetch(tableCodeParam);
          setIsScanning(false); // Stop scanning after a successful scan
        } else {
          setIsScanning(false); // Close the scanner on error
          alert("Código QR inválido.");
        }
      } catch (error) {
        setIsScanning(false); // Close the scanner on error
        console.error("Error al procesar el código QR:", error);
        alert("Error al procesar el código QR.");
      }
    }
  };

  return (
    <div>
      <h1>Escanea el código</h1>
      <TextField
        label="Código de la mesa"
        variant="outlined"
        fullWidth
        value={tableCode}
        onChange={(e) => setTableCode(e.target.value)}
        sx={{
          marginBottom: "20px",
          "& .MuiOutlinedInput-root": {
            borderRadius: "18px",
            backgroundColor: "#fff", // Fondo blanco del input
          },
          "& .MuiOutlinedInput-input": {
            padding: "10px", // Mejor ajuste visual
            color: "#000", // Texto negro
          },
          "& .MuiInputLabel-root": {
            color: "#000", // Etiqueta negra
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#ccc", // Borde claro
          },
        }}
      />
      <Button
        variant="contained"
        onClick={handleScan}
        startIcon={<ReceiptIcon />}
        sx={{
          bgcolor: (theme) => theme.palette.primary.main,
          borderRadius: "18px",
          width: "100%",
          height: "50px",
          textAlign: "center",
          marginBottom: "10px",
        }}
      >
        Confirmar
      </Button>
      <Button
        variant="contained"
        onClick={() => setIsScanning(true)}
        startIcon={<QrCodeScannerIcon />}
        sx={{
          bgcolor: (theme) => theme.palette.secondary.main,
          borderRadius: "18px",
          width: "100%",
          height: "50px",
          textAlign: "center",
        }}
      >
        Escanear QR
      </Button>

      {isScanning && (
        <div style={{ marginTop: "20px" }}>
          <Scanner
            onScan={(result) => {
              handleQrScan(result);
            }}
            onError={(error) => {
              setIsScanning(false); // Close the scanner on error
              console.error("Error del escáner:", error);
            }}
            constraints={{ facingMode: "environment" }}
          />
          <Button
            variant="contained"
            onClick={() => setIsScanning(false)}
            startIcon={<CancelIcon />}
            sx={{
              bgcolor: (theme) => theme.palette.error.main,
              borderRadius: "18px",
              width: "100%",
              height: "50px",
              textAlign: "center",
              marginTop: "10px",
            }}
          >
            Cerrar escáner
          </Button>
        </div>
      )}
    </div>
  );
};

export default ScanPage;
