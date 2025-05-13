import { Sidebar } from "./components/sidebar";
import { Routes, Route, Navigate } from "react-router-dom";
import { ClubsPage, MembersPage } from "./pages";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Routes>
        <Route path="/" element={<Navigate to="/clubs-unsis/clubs" replace />} />
        <Route path="/clubs-unsis/clubs" element={<ClubsPage />} />
        <Route path="/clubs-unsis/club/:name" element={<MembersPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
