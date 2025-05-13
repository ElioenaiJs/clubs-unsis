import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useNavigate } from "react-router-dom";

interface Student {
  name: string;
  id: string;
  email: string;
}

interface ClubData {
  nombre: string;
  students: Student[];
}

export function ClubsPage() {
  const [clubsData, setClubsData] = useState<ClubData[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!hasFetched) {
      const fetchClubsAndStudents = async () => {
        try {
          const clubNames: string[] = [
            "club_ajedrez",
            "club_danza",
            "club_taekwondo",
          ];

          const data = await Promise.all(
            clubNames.map(async (clubName) => {
              const snapshot = await getDocs(collection(db, clubName));
              const students: Student[] = snapshot.docs.map((doc) => ({
                name: doc.data().nombre_alumno,
                id: doc.data().numero_alumno,
                email: doc.data().correo,
              }));

              return {
                nombre: clubName.replace("club_", ""),
                students,
              };
            })
          );

          setClubsData(data);
          setHasFetched(true);
        } catch (err) {
          console.error("Error fetching data:", err);
          setError("Failed to load club data");
          setHasFetched(true);
        }
      };

      fetchClubsAndStudents();
    }
  }, [hasFetched]);

  if (!hasFetched) return <div className="p-4">Loading clubs data...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!clubsData) return <div className="p-4">No clubs data available</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Clubs</h1>

      <div className="grid gap-6 md:grid-cols-3 cursor-pointer ">
        {clubsData.map((club) => (
          <div key={club.nombre} className="border border-gray-100 p-4 shadow transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg" onClick={() => navigate(`/clubs-unsis/club/${club.nombre}`)}>
            <h2 className="text-xl font-semibold mb-3">{club.nombre}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}
