import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

interface ClubData {
  id: string;
  nombre: string;
}

export function ClubsPage() {
  const navigate = useNavigate();

  const clubsData: ClubData[] = [
    { id: "ajedrez", nombre: "Ajedrez" },
    { id: "danza", nombre: "Danza" },
    { id: "taekwondo", nombre: "Taekwondo" },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Clubs</h1>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr", // 1 columna en pantallas pequeñas
            sm: "1fr 1fr", // 2 columnas en sm
            md: "1fr 1fr 1fr", // 3 columnas en md
          },
          gap: 3,
        }}
      >
        {clubsData.map((club) => (
          <Card
            key={club.id}
            sx={{
              borderRadius: 1,
              transition: "transform 0.3s, box-shadow 0.3s",
              "&:hover": {
                boxShadow: 6,
                transform: "scale(1.02)",
                cursor: "pointer",
              },
            }}
            onClick={() => navigate(`/clubs-unsis/club/${club.id}`)}
          >
            <CardActionArea>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h6" color="text.primary" gutterBottom>
                  {club.nombre}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Explora el club de {club.nombre.toLowerCase()}.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </div>
  );
}
