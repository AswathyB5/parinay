import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Stories from './pages/Stories';
import Journals from './pages/Journals';
import AdminDashboard from './admin/AdminDashboard';
import './App.css';

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname === '/admin';

  return (
    <div className="app-container">
      {!isAdminRoute && <Header />}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/journals" element={<Journals />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default App;
