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
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Clubs</h1>
  
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {clubsData.map((club) => (
          <div
            key={club.id}
            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer text-center"
            onClick={() => navigate(`/clubs-unsis/club/${club.id}`)}
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">{club.nombre}</h2>
            <p className="text-gray-500 text-sm">Explora el club de {club.nombre.toLowerCase()}.</p>
          </div>
        ))}
      </div>
    </div>
  );
  
}