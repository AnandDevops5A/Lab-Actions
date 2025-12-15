async function loadTournaments() {
  try {
    const resp = await fetch('/api/tournaments');
    if (!resp.ok) {
      console.error('Failed to fetch tournaments', resp.status);
      return;
    }
    const list = await resp.json();
    const container = document.getElementById('tournaments');
    if (!container) return;
    container.innerHTML = '';
    list.forEach(t => {
      const el = document.createElement('div');
      el.className = 'tournament';
      el.innerHTML = `<h3>${escapeHtml(t.name)}</h3>` +
                     `<p>${escapeHtml(t.description)}</p>` +
                     `<small>Date: ${escapeHtml(t.date)} — Participants: ${t.participants}</small>`;
      container.appendChild(el);
    });
  } catch (e) {
    console.error('Error loading tournaments', e);
  }
}

function escapeHtml(s){ return s ? s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;') : ''; }

document.addEventListener('DOMContentLoaded', loadTournaments);
