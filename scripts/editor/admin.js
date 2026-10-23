let sessionToken = '';
let allEssays = [];
let metricsData = null;
let currentFilter = 'all';
let searchQuery = '';

const IDEAS_STORAGE_KEY = 'cult_admin_ideas_v1';

async function init() {
  setupSidebarAndTopbar();
  setupEventListeners();
  loadIdeas();
  await refreshMetrics();
}

/* ==========================================================================
   Controles da Sidebar e Topbar
   ========================================================================== */

function setupSidebarAndTopbar() {
  const layout = document.getElementById('spur-layout');
  const toggleBtn = document.getElementById('btn-sidebar-toggle');
  const overlay = document.getElementById('sidebar-overlay');
  const notifBtn = document.getElementById('btn-notifications-toggle');
  const notifDropdown = document.getElementById('notifications-dropdown');

  if (toggleBtn && layout) {
    toggleBtn.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        layout.classList.toggle('sidebar-mobile-open');
      } else {
        layout.classList.toggle('sidebar-collapsed');
      }
    });
  }

  if (overlay && layout) {
    overlay.addEventListener('click', () => {
      layout.classList.remove('sidebar-mobile-open');
    });
  }

  if (notifBtn && notifDropdown) {
    notifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = notifDropdown.style.display === 'none';
      notifDropdown.style.display = isHidden ? 'block' : 'none';
    });

    document.addEventListener('click', () => {
      notifDropdown.style.display = 'none';
    });
  }

  // Sincronizar busca da topbar
  const topbarSearch = document.getElementById('topbar-search-input');
  if (topbarSearch) {
    topbarSearch.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderTable();
    });
  }
}

/* ==========================================================================
   Carregamento de Dados da API Local
   ========================================================================== */

async function refreshMetrics() {
  try {
    const res = await fetch('/api/admin/metrics');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    sessionToken = data.token;
    metricsData = data;
    allEssays = data.essays || [];

    renderMetricsCards();
    renderBarChart();
    renderNotifications();
    renderTable();
  } catch (err) {
    console.error('Erro ao carregar métricas:', err);
    const tbody = document.getElementById('essays-tbody');
    if (tbody) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--spur-red); padding: 2rem;">Falha de conexão com o servidor local: ${escapeHtml(err.message)}</td></tr>`;
    }
  }
}

/* ==========================================================================
   Renderização dos Cards Spur
   ========================================================================== */

function renderMetricsCards() {
  if (!metricsData) return;

  const elPub = document.getElementById('val-published');
  if (elPub) elPub.textContent = metricsData.publishedCount ?? 0;

  const elFeat = document.getElementById('val-featured');
  const subFeat = document.getElementById('sub-featured');
  const featCount = metricsData.featuredCount ?? 0;
  if (elFeat) elFeat.textContent = `${featCount} / 3`;
  if (subFeat) {
    if (featCount === 3) subFeat.textContent = '3/3 preenchidos';
    else if (featCount === 0) subFeat.textContent = '3 vagas abertas';
    else subFeat.textContent = `${3 - featCount} vaga(s) na Home`;
  }

  const elDrafts = document.getElementById('val-drafts');
  const subDrafts = document.getElementById('sub-drafts');
  const draftCount = metricsData.draftCount ?? 0;
  if (elDrafts) elDrafts.textContent = draftCount;
  if (subDrafts) {
    subDrafts.textContent = draftCount === 0 ? 'Tudo publicado' : `${draftCount} aguardando publicação`;
  }

  const elReading = document.getElementById('val-reading-time');
  if (elReading) elReading.textContent = `${metricsData.avgReadingTimeMinutes ?? 0} min`;
}

/* ==========================================================================
   Gráfico de Barras Estilo Spur
   ========================================================================== */

function renderBarChart() {
  const container = document.getElementById('bar-chart-container');
  if (!container || !metricsData) return;

  const byCat = metricsData.byCategory || {};
  const entries = Object.entries(byCat);

  if (entries.length === 0) {
    container.innerHTML = '<div class="chart-loading">Nenhuma publicação cadastrada por vertente.</div>';
    return;
  }

  const maxVal = Math.max(...entries.map(([, v]) => v), 1);
  const maxHeightPx = 150;

  container.innerHTML = entries
    .map(([cat, count]) => {
      const heightPx = Math.max(16, Math.round((count / maxVal) * maxHeightPx));
      return `
        <div class="chart-bar-group">
          <div class="chart-bar-wrap">
            <div class="chart-bar" style="height: ${heightPx}px;">
              <span class="chart-bar-val">${count}</span>
            </div>
          </div>
          <span class="chart-bar-label">${escapeHtml(cat)}</span>
        </div>
      `;
    })
    .join('');
}

/* ==========================================================================
   Notificações e Alertas Editoriais
   ========================================================================== */

function renderNotifications() {
  if (!metricsData) return;

  const feed = document.getElementById('notifications-feed');
  const dropdownList = document.getElementById('notifications-list');
  const badge = document.getElementById('notification-badge');

  const alerts = [];
  const featCount = metricsData.featuredCount ?? 0;
  const draftCount = metricsData.draftCount ?? 0;

  if (featCount < 3) {
    alerts.push({
      type: 'warning',
      icon: 'fa-solid fa-triangle-exclamation',
      title: 'Vagas de destaque na Home',
      desc: `A Home possui ${featCount} de 3 destaques ativos. Clique na estrela de uma publicação para destacar.`,
    });
  } else {
    alerts.push({
      type: 'success',
      icon: 'fa-solid fa-circle-check',
      title: 'Vitrine da Home preenchida',
      desc: '3 ensaios estão configurados em destaque simultâneo na Home.',
    });
  }

  if (draftCount > 0) {
    alerts.push({
      type: 'info',
      icon: 'fa-solid fa-file-pen',
      title: 'Rascunhos pendentes',
      desc: `Existem ${draftCount} rascunho(s) em edição local no acervo.`,
    });
  }

  alerts.push({
    type: 'info',
    icon: 'fa-solid fa-circle-info',
    title: 'Ambiente Local Protegido',
    desc: 'O painel e os arquivos de edição rodam com segurança na porta 3001.',
  });

  if (badge) {
    badge.textContent = alerts.length;
  }

  const html = alerts
    .map(
      (a) => `
      <div class="alert-item alert-item--${a.type}">
        <i class="${a.icon}"></i>
        <div class="alert-text-wrap">
          <div class="alert-title">${escapeHtml(a.title)}</div>
          <div class="alert-desc">${escapeHtml(a.desc)}</div>
        </div>
      </div>
    `
    )
    .join('');

  if (feed) feed.innerHTML = html;

  if (dropdownList) {
    dropdownList.innerHTML = alerts
      .map(
        (a) => `
        <li class="dropdown-item">
          <i class="${a.icon}" style="color: var(--spur-${a.type === 'success' ? 'green' : a.type === 'warning' ? 'orange' : 'blue'});"></i>
          <div>
            <div style="font-weight: 600; font-size: 0.82rem;">${escapeHtml(a.title)}</div>
            <div style="font-size: 0.75rem; color: #718096;">${escapeHtml(a.desc)}</div>
          </div>
        </li>
      `
      )
      .join('');
  }
}

/* ==========================================================================
   Renderização da Tabela de Ensaios
   ========================================================================== */

function renderTable() {
  const tbody = document.getElementById('essays-tbody');
  const countSpan = document.getElementById('table-total-count');
  if (!tbody) return;

  const query = searchQuery.toLowerCase().trim();

  const filtered = allEssays.filter((item) => {
    if (currentFilter === 'published' && item.draft) return false;
    if (currentFilter === 'drafts' && !item.draft) return false;
    if (currentFilter === 'featured' && !item.featured) return false;

    if (query) {
      const matchTitle = (item.title || '').toLowerCase().includes(query);
      const matchSlug = (item.slug || '').toLowerCase().includes(query);
      const matchCat = (item.category || '').toLowerCase().includes(query);
      if (!matchTitle && !matchSlug && !matchCat) return false;
    }

    return true;
  });

  if (countSpan) {
    countSpan.textContent = `${filtered.length} de ${allEssays.length} itens`;
  }

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="table-empty-row">
          Nenhuma publicação encontrada para o filtro informado.
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
            title="${isFeatured ? 'Remover destaque da Home' : 'Destacar na Home'}"
          >
            <i class="fa-${isFeatured ? 'solid' : 'regular'} fa-star"></i>
          </button>
        </td>
        <td>
          <div class="title-cell">
            <span class="essay-main-title">${escapeHtml(e.title)}</span>
            <span class="essay-slug-sub">/${escapeHtml(e.category)}/${escapeHtml(e.slug)}</span>
          </div>
        </td>
        <td>
          <span class="badge-cat">${escapeHtml(e.category || '-')}</span>
        </td>
        <td>
          <span class="territory-label">${escapeHtml(territoryLabels[e.territory] || e.territory || '-')}</span>
        </td>
        <td>
          <span style="font-size: 0.82rem; color: #718096;">${escapeHtml(e.pubDate || '-')}</span>
        </td>
        <td>
          <span style="font-size: 0.82rem; font-weight: 600;">${e.readingTimeMinutes || 5} min</span>
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
              <span class="btn-action btn-action--disabled" title="Rascunho não publicado">
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

    await refreshMetrics();
  } catch (err) {
    alert(`Erro ao alternar destaque: ${err.message}`);
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
      <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #a0aec0;">
        <i class="fa-regular fa-lightbulb" style="font-size: 2rem; margin-bottom: 0.5rem; display: block;"></i>
        Nenhuma pauta rascunhada ainda. Use este espaço como staging local para rascunhar ideias antes de redigir.
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
            ${isPost ? '📝 Ensaio' : '🛠️ Melhoria'}
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
  const filterTabs = document.querySelectorAll('#status-filter-tabs .filter-tab');
  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      filterTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      currentFilter = tab.getAttribute('data-filter');
      renderTable();
    });
  });

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
      const title = document.getElementById('idea-title').value.trim();
      const type = document.getElementById('idea-type').value;
      const notes = document.getElementById('idea-notes').value.trim();

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
