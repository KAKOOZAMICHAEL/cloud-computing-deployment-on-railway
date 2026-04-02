import { useMemo, useState } from 'react';
import { api } from '../api/client';

function parseTechnologies(text) {
  return String(text || '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
}

function formatTechnologiesForInput(techArray) {
  if (!techArray || !Array.isArray(techArray)) return '';
  return techArray.join(', ');
}

export default function ProjectsManager({ projects, onRefresh }) {
  const sortedProjects = useMemo(() => {
    const list = Array.isArray(projects) ? [...projects] : [];
    list.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
    return list;
  }, [projects]);

  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    repoUrl: '',
    liveUrl: '',
    technologies: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  function resetForm() {
    setEditingId(null);
    setForm({
      name: '',
      description: '',
      repoUrl: '',
      liveUrl: '',
      technologies: '',
    });
    setError('');
  }

  function startEdit(p) {
    setEditingId(p.id);
    setForm({
      name: p.name || '',
      description: p.description || '',
      repoUrl: p.repo_url || '',
      liveUrl: p.live_url || '',
      technologies: formatTechnologiesForInput(p.technologies || []),
    });
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const body = {
        name: form.name.trim(),
        description: form.description.trim(),
        repoUrl: form.repoUrl.trim() || null,
        liveUrl: form.liveUrl.trim() || null,
        technologies: parseTechnologies(form.technologies),
      };

      if (editingId) {
        await api.updateProject(editingId, body);
      } else {
        await api.createProject(body);
      }

      resetForm();
      await onRefresh();
    } catch (e2) {
      setError(e2?.message || String(e2));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this project?')) return;
    setSubmitting(true);
    setError('');
    try {
      await api.deleteProject(id);
      await onRefresh();
      if (editingId === id) resetForm();
    } catch (e2) {
      setError(e2?.message || String(e2));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="projectsLayout">
      <div className="projectsList">
        {sortedProjects.length === 0 ? (
          <p>No projects found. Add one below.</p>
        ) : (
          sortedProjects.map((p) => (
            <div key={p.id} className="projectCard">
              <div className="projectTop">
                <h3 className="projectName">{p.name}</h3>
                <div className="projectActions">
                  <button className="btn btnSecondary" type="button" onClick={() => startEdit(p)}>
                    Edit
                  </button>
                  <button className="btn btnDanger" type="button" onClick={() => handleDelete(p.id)}>
                    Delete
                  </button>
                </div>
              </div>

              <p className="projectDesc">{p.description}</p>

              <div className="projectLinks">
                {p.repo_url ? (
                  <a className="link" href={p.repo_url} target="_blank" rel="noreferrer">
                    Repo
                  </a>
                ) : null}
                {p.live_url ? (
                  <a className="link" href={p.live_url} target="_blank" rel="noreferrer">
                    Live
                  </a>
                ) : null}
              </div>

              {p.technologies && p.technologies.length > 0 ? (
                <div className="techRow">
                  {p.technologies.map((t) => (
                    <span key={`${p.id}-${t}`} className="techBadge">
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          ))
        )}
      </div>

      <div className="projectsForm">
        <h3 className="formTitle">{editingId ? 'Update Project' : 'Add Project'}</h3>
        {error ? <div className="status statusError">{error}</div> : null}

        <form onSubmit={handleSubmit} className="form">
          <label className="field">
            <span className="label">Title</span>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
          </label>

          <label className="field">
            <span className="label">Description</span>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              required
              rows={4}
            />
          </label>

          <label className="field">
            <span className="label">GitHub URL</span>
            <input
              value={form.repoUrl}
              onChange={(e) => setForm((f) => ({ ...f, repoUrl: e.target.value }))}
              placeholder="https://github.com/..."
            />
          </label>

          <label className="field">
            <span className="label">Live URL</span>
            <input
              value={form.liveUrl}
              onChange={(e) => setForm((f) => ({ ...f, liveUrl: e.target.value }))}
              placeholder="https://..."
            />
          </label>

          <label className="field">
            <span className="label">Tech Stack (comma separated)</span>
            <input
              value={form.technologies}
              onChange={(e) => setForm((f) => ({ ...f, technologies: e.target.value }))}
              placeholder="React, Node.js, PostgreSQL"
            />
          </label>

          <div className="formButtons">
            <button className="btn btnPrimary" type="submit" disabled={submitting}>
              {submitting ? 'Working...' : editingId ? 'Update' : 'Add'}
            </button>
            {editingId ? (
              <button className="btn btnSecondary" type="button" disabled={submitting} onClick={resetForm}>
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  );
}

