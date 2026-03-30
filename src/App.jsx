import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Stories from './pages/Stories';
import Journals from './pages/Journals';
import JournalDetail from './pages/JournalDetail';
import AdminDashboard from './admin/AdminDashboard';
import FloatingQuote from './components/FloatingQuote';
import Weddingstories from './pages/Weddingstories';
import ProjectDetail from './pages/ProjectDetail';
import './App.css';

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname === '/admin';
  const isProjectDetailPage = 
    location.pathname.startsWith('/projects/');

  return (
    <div className="app-container">
      <ScrollToTop />
      {!isAdminRoute && !isProjectDetailPage && <Header />}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/stories" element={<Weddingstories />} />
          <Route path="/destination-weddings" element={<Stories sectionKey="storiesDestination" />} />
          <Route path="/themed-weddings" element={<Stories sectionKey="storiesThemed" />} />
          <Route path="/traditional-weddings" element={<Stories sectionKey="storiesTraditional" />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/journals" element={<Journals />} />
          <Route path="/journals/:id" element={<JournalDetail />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <FloatingQuote />}
    </div>
  );
}

export default App;
