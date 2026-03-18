/**
 * ui.js — Conversor SCT
 * HC Marcenaria
 *
 * Gerencia todas as interações da interface:
 * upload, preview da tabela, lista de arquivos por material, downloads.
 *
 * v0.2 — separação por material (tipo + cor + espessura), download individual por grupo
 */

// ─── Estado global ────────────────────────────────────────────────────────
let currentGroups = {};   // grupos retornados pelo parser
let baseFileName  = '';   // nome do arquivo original sem extensão

// ─── Referências aos elementos da página ─────────────────────────────────
const fileInput    = document.getElementById('fileInput');
const uploadZone   = document.getElementById('uploadZone');
const fileNameEl   = document.getElementById('fileName');
const previewWrap  = document.getElementById('previewWrap');
const tableBody    = document.getElementById('tableBody');
const summaryEl    = document.getElementById('summary');
const statusEl     = document.getElementById('status');
const downloadList = document.getElementById('downloadList');
const btnReset     = document.getElementById('btnReset');

// ─── Exibe mensagem de status ─────────────────────────────────────────────
function showStatus(msg, type) {
  statusEl.textContent = msg;
  statusEl.className   = 'status ' + type;
}

// ─── Lê o tamanho da chapa configurado pelo usuário ──────────────────────
function getSheetSize() {
  return {
    w: parseInt(document.getElementById('sheetW').value) || 2750,
    h: parseInt(document.getElementById('sheetH').value) || 1850,
  };
}

// ─── Renderiza preview da tabela e lista de downloads ────────────────────
function renderPreview(groups) {
  const keys       = Object.keys(groups);
  const totalPieces = keys.reduce((sum, k) =>
    sum + groups[k].pieces.reduce((s, p) => s + p.qty, 0), 0);
  const totalGroups = keys.length;

  // ── Resumo ──
  summaryEl.innerHTML = `
    <div class="summary-item">
      <span class="s-label">Materiais</span>
      <span class="s-value">${totalGroups}</span>
    </div>
    <div class="summary-item">
      <span class="s-label">Total de peças</span>
      <span class="s-value">${totalPieces}</span>
    </div>
    <div class="summary-item">
      <span class="s-label">Arquivos .sct</span>
      <span class="s-value">${totalGroups}</span>
    </div>
  `;

  // ── Tabela de peças ──
  tableBody.innerHTML = '';
  let rowIndex = 1;
  keys.forEach(key => {
    const group = groups[key];

    // Linha separadora de material
    const sep = document.createElement('tr');
    sep.innerHTML = `
      <td colspan="5" style="
        background: rgba(200,146,42,0.08);
        color: var(--accent2);
        font-family: var(--mono);
        font-size: 11px;
        letter-spacing: 0.1em;
        padding: 6px 12px;
        border-bottom: 1px solid var(--border);
      ">${group.material.type} — ${group.material.color} — ${group.material.thickness}</td>
    `;
    tableBody.appendChild(sep);

    // Peças do grupo
    group.pieces.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="color:var(--muted)">${rowIndex++}</td>
        <td>${p.name}</td>
        <td>${p.width}</td>
        <td>${p.height}</td>
        <td style="color:var(--accent2);font-weight:600">${p.qty}</td>
      `;
      tableBody.appendChild(tr);
    });
  });

  // ── Lista de downloads por material ──
  downloadList.innerHTML = '';
  keys.forEach(key => {
    const group    = groups[key];
    const mat      = group.material;
    const qtdPecas = group.pieces.reduce((s, p) => s + p.qty, 0);
    const sctName  = `${baseFileName}_${mat.type}_${mat.color}_${mat.thickness}.sct`;

    const item = document.createElement('div');
    item.className = 'download-item';
    item.innerHTML = `
      <div class="download-info">
        <span class="download-name">${sctName}</span>
        <span class="download-count">${qtdPecas} peças</span>
      </div>
      <button class="btn-primary btn-small">⬇ Baixar</button>
    `;

    // Botão de download individual para esse material
    item.querySelector('button').addEventListener('click', () => {
      const { w, h } = getSheetSize();
      const sct = generateSCT(group.pieces, w, h);  // generator.js
      downloadFile(sct, sctName);                    // generator.js
    });

    downloadList.appendChild(item);
  });

  previewWrap.classList.add('visible');
  showStatus(`✓ ${totalGroups} materiais identificados — ${totalPieces} peças no total`, 'ok');
}

// ─── Processa o arquivo carregado ─────────────────────────────────────────
function processFile(file) {
  if (!file) return;

  baseFileName           = file.name.replace(/\.[^.]+$/, '');
  fileNameEl.textContent  = file.name;
  fileNameEl.style.display = 'block';
  uploadZone.classList.add('has-file');

  const reader = new FileReader();
  reader.onload = e => {
    currentGroups = parseFile(e.target.result);  // parser.js

    if (Object.keys(currentGroups).length === 0) {
      showStatus('✗ Nenhuma peça reconhecida. Verifique o formato do arquivo.', 'err');
      return;
    }

    renderPreview(currentGroups);
  };
  reader.readAsText(file, 'UTF-8');
}

// ─── Eventos de upload ────────────────────────────────────────────────────
fileInput.addEventListener('change', e => processFile(e.target.files[0]));

uploadZone.addEventListener('dragover', e => {
  e.preventDefault();
  uploadZone.classList.add('drag');
});

uploadZone.addEventListener('dragleave', () => {
  uploadZone.classList.remove('drag');
});

uploadZone.addEventListener('drop', e => {
  e.preventDefault();
  uploadZone.classList.remove('drag');
  processFile(e.dataTransfer.files[0]);
});

// ─── Botão limpar ─────────────────────────────────────────────────────────
btnReset.addEventListener('click', () => {
  currentGroups             = {};
  baseFileName              = '';
  fileInput.value           = '';
  fileNameEl.style.display  = 'none';
  uploadZone.classList.remove('has-file');
  previewWrap.classList.remove('visible');
  tableBody.innerHTML       = '';
  downloadList.innerHTML    = '';
  statusEl.className        = 'status';
});
