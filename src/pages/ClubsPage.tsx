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
    { id: "taekwondo", nombre: "Taekwondo" }
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Clubs Disponibles</h1>

      <div className="grid gap-6 md:grid-cols-3">
        {clubsData.map((club) => (
          <div 
            key={club.id}
            className="border border-gray-200 rounded-lg p-4 shadow hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate(`/clubs-unsis/club/${club.id}`)}
          >
            <h2 className="text-xl font-semibold">{club.nombre}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}