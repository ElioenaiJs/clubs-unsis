import { Sidebar } from './components/sidebar';
import { Routes, Route } from 'react-router-dom';
import { ClubsPage } from './pages';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Routes>
          <Route path="/clubs/main" element={<ClubsPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
