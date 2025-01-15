import { Chip } from "@mui/material";

interface StatusBadgeProps {
  status: string;
}
export function StatusBadge({ status }: StatusBadgeProps) {
  const statusTranslations: Record<string, string> = {
    ready: "Listo",
    "in-process": "En proceso",
    completed: "Completado",
    cancelled: "Cancelado",
    pending: "Pendiente",
  };
  const getStyles = () => {
    switch (status) {
      case "ready":
        return { backgroundColor: "rgba(34,197,94,0.2)", color: "#22C55E" }; // verde
      case "in-process":
        return { backgroundColor: "rgba(234,179,8,0.2)", color: "#EAB308" }; // amarillo
      case "completed":
        return { backgroundColor: "rgba(59,130,246,0.2)", color: "#3B82F6" }; // azul
      case "cancelled":
        return { backgroundColor: "rgba(239,68,68,0.2)", color: "#EF4444" }; // rojo
      default:
        return {};
    }
  };
  return (
    <Chip
      label={statusTranslations[status] || status.replace("-", " ").toUpperCase()}
      sx={{
        ...getStyles(),
        textTransform: "capitalize",
        fontWeight: "bold",
      }}
    />
  );
}