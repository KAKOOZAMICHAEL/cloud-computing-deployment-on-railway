import { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { api } from './api/client';
import Section from './components/Section.jsx';
import AboutSection from './components/AboutSection.jsx';
import SkillsList from './components/SkillsList.jsx';
import ProjectsManager from './components/ProjectsManager.jsx';
import ContactSection from './components/ContactSection.jsx';

function HomePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [portfolio, setPortfolio] = useState(null);

  const canRender = useMemo(() => Boolean(portfolio && !loading), [portfolio, loading]);

  async function refresh() {
    setLoading(true);
    setError('');
    try {
      const data = await api.getPortfolio();
      setPortfolio(data);
    } catch (e) {
      setError(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="page">
      <header className="hero">
        <div className="heroInner">
          <h1>Developer Portfolio</h1>
          <p className="subtitle">Projects are stored in PostgreSQL and managed via a REST API.</p>
          <p className="subtitle" style={{ marginTop: 10 }}>
            <Link className="link" to="/admin">
              Admin: Manage Projects
            </Link>
          </p>
        </div>
      </header>

      {loading && <div className="status">Loading portfolio...</div>}
      {!loading && error && <div className="status statusError">Error: {error}</div>}
      {!loading && canRender && (
        <main className="container">
          <Section title="About Me">
            <AboutSection about={portfolio.about} />
          </Section>

          <Section title="Skills">
            <SkillsList skills={portfolio.skills || []} />
          </Section>

          <Section title="Projects">
            <ProjectsManager projects={portfolio.projects || []} onRefresh={refresh} />
          </Section>

          <Section title="Contact">
            <ContactSection contact={portfolio.contact} />
          </Section>
        </main>
      )}
    </div>
  );
}

function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [projects, setProjects] = useState([]);

  async function refresh() {
    setLoading(true);
    setError('');
    try {
      const list = await api.listProjects();
      setProjects(Array.isArray(list) ? list : []);
    } catch (e) {
      setError(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="page">
      <header className="hero">
        <div className="heroInner">
          <h1>Admin Panel</h1>
          <p className="subtitle">Add, edit, and delete projects.</p>
        </div>
      </header>

      {loading && <div className="status">Loading projects...</div>}
      {!loading && error && <div className="status statusError">Error: {error}</div>}
      {!loading && !error && (
        <main className="container">
          <Section title="Manage Projects">
            <ProjectsManager projects={projects} onRefresh={refresh} />
          </Section>
        </main>
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}

