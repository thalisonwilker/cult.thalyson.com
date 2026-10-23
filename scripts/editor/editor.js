let sessionToken = '';
let activeSlug = null;
let allEssays = [];

async function init() {
  await loadCategories();
  await loadEssays();
  setupEventListeners();

  const urlParams = new URLSearchParams(window.location.search);
  const requestedSlug = urlParams.get('slug');
  if (requestedSlug) {
    selectEssay(requestedSlug);
  }
}

async function loadCategories() {
  try {
    const res = await fetch('/api/categories');
    const categories = await res.json();
    const select = document.getElementById('category');
    select.innerHTML = '';
    categories.forEach((cat) => {
      const opt = document.createElement('option');
      opt.value = cat.value;
      opt.textContent = cat.label;
      select.appendChild(opt);
    });
  } catch (err) {
    console.error('Erro ao carregar categorias:', err);
  }
}

async function loadEssays() {
  try {
    const res = await fetch('/api/essays');
    const data = await res.json();
    sessionToken = data.token;
    allEssays = data.essays || [];
    renderEssayList();
  } catch (err) {
    console.error('Erro ao carregar ensaios:', err);
  }
}

function renderEssayList() {
  const list = document.getElementById('essay-list');
  const query = document.getElementById('search-input').value.toLowerCase().trim();
  list.innerHTML = '';

  const filtered = allEssays.filter(
    (e) => e.title.toLowerCase().includes(query) || e.slug.toLowerCase().includes(query)
  );

  filtered.forEach((e) => {
    const li = document.createElement('li');
    li.className = `essay-item ${e.slug === activeSlug ? 'active' : ''}`;
    li.innerHTML = `
      <div class="essay-item-title">${escapeHtml(e.title)}</div>
      <div class="essay-item-meta">
        <span>${escapeHtml(e.category)}</span>
        <span>•</span>
        <span>${escapeHtml(e.pubDate || 'sem data')}</span>
        ${e.draft ? '<span style="color:#fc5c65">[Rascunho]</span>' : ''}
      </div>
    `;
    li.addEventListener('click', () => selectEssay(e.slug));
    list.appendChild(li);
  });
}

async function selectEssay(slug) {
  try {
    const res = await fetch(`/api/essays/${slug}`);
    if (!res.ok) throw new Error('Não encontrado');
    const data = await res.json();
    const essay = data.essay;

    activeSlug = slug;
    document.getElementById('form-mode').textContent = `Editando: ${essay.slug}`;
    document.getElementById('btn-delete').style.display = 'inline-block';

    document.getElementById('title').value = essay.title || '';
    document.getElementById('slug').value = essay.slug || '';
    document.getElementById('slug').readOnly = true;
    document.getElementById('description').value = essay.description || '';
    document.getElementById('category').value = essay.category || '';
    document.getElementById('territory').value = essay.territory || 'para';
    document.getElementById('pubDate').value = essay.pubDate || '';
    document.getElementById('locality').value = essay.locality || '';
    document.getElementById('author').value = essay.author || 'Thalyson';
    document.getElementById('tags').value = (essay.tags || []).join(', ');
    document.getElementById('coverImage').value = essay.coverImage || '';
    document.getElementById('coverImagePosition').value = essay.coverImagePosition || '';
    document.getElementById('featured').checked = Boolean(essay.featured);
    document.getElementById('draft').checked = Boolean(essay.draft);
    document.getElementById('body').value = essay.body || '';

    renderEssayList();
  } catch (err) {
    alert('Erro ao carregar detalhes do ensaio: ' + err.message);
  }
}

function resetForm() {
  activeSlug = null;
  document.getElementById('form-mode').textContent = 'Criando novo ensaio';
  document.getElementById('btn-delete').style.display = 'none';
  document.getElementById('essay-form').reset();
  document.getElementById('slug').readOnly = false;
  document.getElementById('pubDate').value = new Date().toISOString().slice(0, 10);
  renderEssayList();
}

async function saveCurrentEssay() {
  const title = document.getElementById('title').value.trim();
  const slug = document.getElementById('slug').value.trim();
  const description = document.getElementById('description').value.trim();
  const category = document.getElementById('category').value;
  const territory = document.getElementById('territory').value;
  const pubDate = document.getElementById('pubDate').value;
  const locality = document.getElementById('locality').value.trim();
  const author = document.getElementById('author').value.trim();
  const tagsStr = document.getElementById('tags').value;
  const coverImage = document.getElementById('coverImage').value.trim();
  const coverImagePosition = document.getElementById('coverImagePosition').value.trim();
  const featured = document.getElementById('featured').checked;
  const draft = document.getElementById('draft').checked;
  const body = document.getElementById('body').value.trim();

  if (!title || !slug || !description || !body || !pubDate) {
    alert('Por favor, preencha todos os campos obrigatórios (*).');
    return;
  }

  const tags = tagsStr
    .split(',')
    .map((t) => t.trim().replace(/^#/, ''))
    .filter(Boolean);

  const payload = {
    title,
    slug,
    description,
    category,
    territory,
    locality: locality || undefined,
    author: author || 'Thalyson',
    pubDate,
    tags,
    coverImage: coverImage || undefined,
    coverImagePosition: coverImagePosition || undefined,
    featured,
    draft,
    body,
  };

  try {
    const res = await fetch('/api/essays', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-editor-token': sessionToken,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Erro ao salvar');
    }

    alert('Ensaio salvo com sucesso no disco!');
    await loadEssays();
    selectEssay(slug);
  } catch (err) {
    alert('Falha ao salvar ensaio: ' + err.message);
  }
}

async function deleteCurrentEssay() {
  if (!activeSlug) return;
  if (!confirm(`Tem certeza que deseja excluir o ensaio "${activeSlug}"? Esta ação deleta o arquivo .md do disco.`)) {
    return;
  }

  try {
    const res = await fetch(`/api/essays/${activeSlug}`, {
      method: 'DELETE',
      headers: {
        'x-editor-token': sessionToken,
      },
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Erro ao excluir');
    }

    alert('Ensaio excluído.');
    resetForm();
    await loadEssays();
  } catch (err) {
    alert('Falha ao excluir ensaio: ' + err.message);
  }
}

function setupEventListeners() {
  document.getElementById('btn-new').addEventListener('click', resetForm);
  document.getElementById('btn-save').addEventListener('click', saveCurrentEssay);
  document.getElementById('btn-delete').addEventListener('click', deleteCurrentEssay);
  document.getElementById('search-input').addEventListener('input', renderEssayList);

  // Auto-gerar slug no novo ensaio a partir do título
  document.getElementById('title').addEventListener('input', (e) => {
    if (!activeSlug) {
      const slugVal = e.target.value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      document.getElementById('slug').value = slugVal;
    }
  });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

window.addEventListener('DOMContentLoaded', init);
