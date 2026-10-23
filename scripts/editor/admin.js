let sessionToken = '';
let allEssays = [];
let metricsData = null;
let currentFilter = 'all';
let searchQuery = '';

const IDEAS_STORAGE_KEY = 'cult_admin_ideas_v1';

async function init() {
  setupEventListeners();
  loadIdeas();
  await refreshMetrics();
}

async function refreshMetrics() {
  try {
    const res = await fetch('/api/admin/metrics');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    sessionToken = data.token;
    metricsData = data.metrics;
    allEssays = data.essays || [];

    renderMetricsCards();
    renderDistribution();
    renderTable();
  } catch (err) {
    console.error('Erro ao carregar métricas:', err);
    const tbody = document.getElementById('essays-tbody');
    if (tbody) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--color-danger); padding: 2rem;">Falha ao carregar dados do servidor: ${escapeHtml(err.message)}</td></tr>`;
    }
  }
}

function renderMetricsCards() {
  if (!metricsData) return;

  const elPub = document.getElementById('val-published');
  if (elPub) elPub.textContent = metricsData.publishedCount ?? 0;

  const elFeat = document.getElementById('val-featured');
  if (elFeat) elFeat.textContent = `${metricsData.featuredCount ?? 0} / 3`;

  const badgeFeat = document.getElementById('badge-featured-status');
  if (badgeFeat) {
    const count = metricsData.featuredCount ?? 0;
    if (count === 3) {
      badgeFeat.textContent = 'Cheio (3/3)';
      badgeFeat.style.background = 'rgba(244, 182, 63, 0.2)';
      badgeFeat.style.color = '#f4b63f';
    } else if (count === 0) {
      badgeFeat.textContent = 'Nenhum';
      badgeFeat.style.background = 'rgba(252, 92, 101, 0.2)';
      badgeFeat.style.color = '#fc5c65';
    } else {
      badgeFeat.textContent = `${3 - count} vaga(s)`;
      badgeFeat.style.background = 'rgba(46, 213, 115, 0.2)';
      badgeFeat.style.color = '#2ed573';
    }
  }

  const elDrafts = document.getElementById('val-drafts');
  if (elDrafts) elDrafts.textContent = metricsData.draftCount ?? 0;

  const elReading = document.getElementById('val-reading-time');
  if (elReading) elReading.textContent = `${metricsData.avgReadingTimeMinutes ?? 0} min`;
}

function renderDistribution() {
  if (!metricsData) return;

  const catContainer = document.getElementById('categories-cluster');
  if (catContainer) {
    const cats = metricsData.byCategory || {};
    const keys = Object.keys(cats);
    if (keys.length === 0) {
      catContainer.innerHTML = '<span class="text-muted">Nenhuma categoria registrada.</span>';
    } else {
      catContainer.innerHTML = keys
        .sort((a, b) => cats[b] - cats[a])
        .map(
          (k) => `
          <div class="pill-item">
            <span class="pill-label">${escapeHtml(k)}</span>
            <span class="pill-count">${cats[k]}</span>
          </div>
        `
        )
        .join('');
    }
  }

  const terContainer = document.getElementById('territories-cluster');
  if (terContainer) {
    const ters = metricsData.byTerritory || {};
    const keys = Object.keys(ters);
    const labels = {
      para: 'Pará & Belém',
      nacional: 'Arte Nacional',
      global: 'Mundo & Clássicos',
    };
    if (keys.length === 0) {
      terContainer.innerHTML = '<span class="text-muted">Nenhum território registrado.</span>';
    } else {
      terContainer.innerHTML = keys
        .sort((a, b) => ters[b] - ters[a])
        .map(
          (k) => `
          <div class="pill-item">
            <span class="pill-label">${escapeHtml(labels[k] || k)}</span>
            <span class="pill-count">${ters[k]}</span>
          </div>
        `
        )
        .join('');
    }
  }
}

function renderTable() {
  const tbody = document.getElementById('essays-tbody');
  const countSpan = document.getElementById('table-total-count');
  if (!tbody) return;

  const query = searchQuery.toLowerCase().trim();

  const filtered = allEssays.filter((item) => {
    // Filtro de aba de status
    if (currentFilter === 'published' && item.draft) return false;
    if (currentFilter === 'drafts' && !item.draft) return false;
    if (currentFilter === 'featured' && !item.featured) return false;

    // Filtro de texto
    if (query) {
      const matchTitle = (item.title || '').toLowerCase().includes(query);
      const matchSlug = (item.slug || '').toLowerCase().includes(query);
      const matchCat = (item.category || '').toLowerCase().includes(query);
      if (!matchTitle && !matchSlug && !matchCat) return false;
    }

    return true;
  });

  if (countSpan) {
    countSpan.textContent = `${filtered.length} de ${allEssays.length} ensaio(s)`;
  }

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; padding: 2.5rem; color: var(--color-text-muted);">
          Nenhum ensaio corresponde aos filtros selecionados.
        </td>
      </tr>
    `;
    return;
  }

  const territoryLabels = {
    para: 'Pará & Belém',
    nacional: 'Nacional',
    global: 'Global',
  };

  tbody.innerHTML = filtered
    .map((e) => {
      const isFeatured = Boolean(e.featured);
      const isDraft = Boolean(e.draft);

      return `
      <tr>
        <td style="text-align: center;">
          <button
            class="star-btn ${isFeatured ? 'active' : ''}"
            data-slug="${escapeHtml(e.slug)}"
            title="${isFeatured ? 'Remover dos destaques da Home' : 'Destacar na Home'}"
          >
            <i class="fa-${isFeatured ? 'solid' : 'regular'} fa-star"></i>
          </button>
        </td>
        <td>
          <div class="title-cell">
            <span class="essay-main-title">${escapeHtml(e.title)}</span>
            <span class="essay-slug-sub">/ensaios/${escapeHtml(e.slug)}</span>
          </div>
        </td>
        <td>
          <span class="badge badge-category">${escapeHtml(e.category || '-')}</span>
        </td>
        <td>
          <span class="territory-tag">${escapeHtml(territoryLabels[e.territory] || e.territory || '-')}</span>
        </td>
        <td>
          <span class="date-text">${escapeHtml(e.pubDate || '-')}</span>
        </td>
        <td>
          <span class="reading-tag">${e.readingTimeMinutes || 5} min</span>
        </td>
        <td>
          ${
            isDraft
              ? '<span class="status-pill status-pill--draft">Rascunho</span>'
              : '<span class="status-pill status-pill--published">Publicado</span>'
          }
        </td>
        <td style="text-align: right;">
          <div class="actions-cell">
            <a href="/?slug=${encodeURIComponent(e.slug)}" class="btn-action btn-action--edit" title="Editar este ensaio no editor local">
              <i class="fa-solid fa-pen-to-square"></i>
              <span>Editar</span>
            </a>
            ${
              !isDraft
                ? `
              <a href="http://127.0.0.1:3000/${encodeURIComponent(e.category)}/${encodeURIComponent(e.slug)}" target="_blank" rel="noopener noreferrer" class="btn-action btn-action--site" title="Abrir no site Next.js (:3000)">
                <i class="fa-solid fa-arrow-up-right-from-square"></i>
                <span>Ver Site</span>
              </a>
            `
                : `
              <span class="btn-action btn-action--disabled" title="Rascunhos não são visíveis no site público">
                <i class="fa-solid fa-eye-slash"></i>
                <span>Rascunho</span>
              </span>
            `
            }
          </div>
        </td>
      </tr>
    `;
    })
    .join('');

  // Adicionar listeners para os botões de toggle estrela
  tbody.querySelectorAll('.star-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const slug = btn.getAttribute('data-slug');
      await handleToggleFeatured(slug);
    });
  });
}

async function handleToggleFeatured(slug) {
  if (!slug) return;
  try {
    const res = await fetch('/api/admin/featured', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-editor-token': sessionToken,
      },
      body: JSON.stringify({ slug }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Erro ao alternar destaque');
    }

    // Atualiza métricas e tabela
    await refreshMetrics();
  } catch (err) {
    alert(`Erro ao alterar destaque: ${err.message}`);
  }
}

/* ==========================================================================
   Gestão de Ideias e Pautas Locais (Staging)
   ========================================================================== */

function getIdeas() {
  try {
    const raw = localStorage.getItem(IDEAS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveIdeas(ideas) {
  localStorage.setItem(IDEAS_STORAGE_KEY, JSON.stringify(ideas));
}

function loadIdeas() {
  const container = document.getElementById('ideas-list');
  if (!container) return;

  const ideas = getIdeas();
  if (ideas.length === 0) {
    container.innerHTML = `
      <div class="empty-ideas">
        <i class="fa-regular fa-lightbulb"></i>
        <p>Nenhuma ideia anotada ainda. Use este espaço como staging local para rascunhar temas antes de criar o ensaio.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = ideas
    .map((idea) => {
      const isPost = idea.type === 'post';
      return `
      <div class="idea-card">
        <div class="idea-header">
          <span class="idea-type-badge ${isPost ? 'badge-post' : 'badge-system'}">
            ${isPost ? '📝 Ensaio' : '🛠️ Ideia Geral'}
          </span>
          <span class="idea-date">${escapeHtml(new Date(idea.createdAt).toLocaleDateString('pt-BR'))}</span>
        </div>
        <h3 class="idea-title">${escapeHtml(idea.title)}</h3>
        ${idea.notes ? `<p class="idea-notes">${escapeHtml(idea.notes)}</p>` : ''}
        <div class="idea-footer">
          ${
            isPost
              ? `
            <button class="btn btn-primary btn-sm btn-convert-idea" data-title="${escapeHtml(idea.title)}" title="Abrir no Editor com este título preenchido">
              <i class="fa-solid fa-wand-magic-sparkles"></i>
              <span>Transformar em Ensaio</span>
            </button>
          `
              : '<span></span>'
          }
          <button class="btn btn-ghost btn-sm btn-delete-idea" data-id="${idea.id}" title="Excluir ideia">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </div>
    `;
    })
    .join('');

  // Ações nos cards de ideias
  container.querySelectorAll('.btn-delete-idea').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = Number(btn.getAttribute('data-id'));
      deleteIdea(id);
    });
  });

  container.querySelectorAll('.btn-convert-idea').forEach((btn) => {
    btn.addEventListener('click', () => {
      const title = btn.getAttribute('data-title');
      window.location.href = `/?new_title=${encodeURIComponent(title)}`;
    });
  });
}

function addIdea(title, type, notes) {
  const ideas = getIdeas();
  const newIdea = {
    id: Date.now(),
    title,
    type,
    notes,
    createdAt: new Date().toISOString(),
  };
  ideas.unshift(newIdea);
  saveIdeas(ideas);
  loadIdeas();
}

function deleteIdea(id) {
  const ideas = getIdeas().filter((i) => i.id !== id);
  saveIdeas(ideas);
  loadIdeas();
}

function setupEventListeners() {
  // Busca em tempo real na tabela
  const searchInput = document.getElementById('filter-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderTable();
    });
  }

  // Abas de filtro de status
  const filterTabs = document.querySelectorAll('#status-filter-tabs .filter-tab');
  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      filterTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      currentFilter = tab.getAttribute('data-filter');
      renderTable();
    });
  });

  // Toggle do formulário de ideia
  const btnToggleIdea = document.getElementById('btn-toggle-new-idea');
  const ideaForm = document.getElementById('idea-form');
  const btnCancelIdea = document.getElementById('btn-cancel-idea');

  if (btnToggleIdea && ideaForm) {
    btnToggleIdea.addEventListener('click', () => {
      const isHidden = ideaForm.style.display === 'none' || ideaForm.style.display === '';
      ideaForm.style.display = isHidden ? 'flex' : 'none';
      if (isHidden) {
        document.getElementById('idea-title')?.focus();
      }
    });
  }

  if (btnCancelIdea && ideaForm) {
    btnCancelIdea.addEventListener('click', () => {
      ideaForm.reset();
      ideaForm.style.display = 'none';
    });
  }

  if (ideaForm) {
    ideaForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const titleInput = document.getElementById('idea-title');
      const typeSelect = document.getElementById('idea-type');
      const notesInput = document.getElementById('idea-notes');

      const title = titleInput.value.trim();
      const type = typeSelect.value;
      const notes = notesInput.value.trim();

      if (!title) return;

      addIdea(title, type, notes);
      ideaForm.reset();
      ideaForm.style.display = 'none';
    });
  }
}

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  const div = document.createElement('div');
  div.textContent = String(str);
  return div.innerHTML;
}

window.addEventListener('DOMContentLoaded', init);
