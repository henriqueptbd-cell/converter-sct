/**
 * ui.js — Conversor SCT
 * HC Marcenaria
 *
 * Gerencia todas as interações da interface:
 * upload de arquivo, preview da tabela, botões de download.
 */

// ─── Estado ───────────────────────────────────────────────────────────────
let allPieces = [];

// ─── Elementos ────────────────────────────────────────────────────────────
const fileInput   = document.getElementById('fileInput');
const uploadZone  = document.getElementById('uploadZone');
const fileName    = document.getElementById('fileName');
const previewWrap = document.getElementById('previewWrap');
const tableBody   = document.getElementById('tableBody');
const summaryEl   = document.getElementById('summary');
const statusEl    = document.getElementById('status');
const btn15       = document.getElementById('btn15');
const btn18       = document.getElementById('btn18');
const btnReset    = document.getElementById('btnReset');

// ─── Helpers ──────────────────────────────────────────────────────────────
function showStatus(msg, type) {
  statusEl.textContent = msg;
  statusEl.className   = 'status ' + type;
}

function getSheetSize() {
  return {
    w: parseInt(document.getElementById('sheetW').value) || 2750,
    h: parseInt(document.getElementById('sheetH').value) || 1850,
  };
}

// ─── Render preview ───────────────────────────────────────────────────────
function renderPreview(pieces) {
  const p15    = pieces.filter(p => p.thickness === 15);
  const p18    = pieces.filter(p => p.thickness === 18);
  const total  = pieces.reduce((s, p) => s + p.qty, 0);
  const total15 = p15.reduce((s, p) => s + p.qty, 0);
  const total18 = p18.reduce((s, p) => s + p.qty, 0);

  // Resumo
  summaryEl.innerHTML = `
    <div class="summary-item">
      <span class="s-label">Total de peças</span>
      <span class="s-value">${total}</span>
    </div>
    <div class="summary-item">
      <span class="s-label">MDF 15mm</span>
      <span class="s-value">${total15}</span>
    </div>
    <div class="summary-item">
      <span class="s-label">MDF 18mm</span>
      <span class="s-value">${total18}</span>
    </div>
  `;

  // Tabela
  tableBody.innerHTML = '';
  pieces.forEach((p, i) => {
    const tagClass = p.thickness === 15 ? 'tag-15' : 'tag-18';
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="color:var(--muted)">${i + 1}</td>
      <td>${p.name}</td>
      <td><span class="tag ${tagClass}">${p.thickness}mm</span></td>
      <td>${p.width}</td>
      <td>${p.height}</td>
      <td style="color:var(--accent2);font-weight:600">${p.qty}</td>
    `;
    tableBody.appendChild(tr);
  });

  previewWrap.classList.add('visible');
  btn15.disabled = p15.length === 0;
  btn18.disabled = p18.length === 0;

  showStatus(`✓ ${pieces.length} grupos lidos — ${total} peças no total`, 'ok');
}

// ─── Processar arquivo ────────────────────────────────────────────────────
function processFile(file) {
  if (!file) return;

  fileName.textContent  = file.name;
  fileName.style.display = 'block';
  uploadZone.classList.add('has-file');

  const reader = new FileReader();
  reader.onload = e => {
    allPieces = parseFile(e.target.result);  // parser.js

    if (allPieces.length === 0) {
      showStatus('✗ Nenhuma peça reconhecida. Verifique o formato do arquivo.', 'err');
      return;
    }

    renderPreview(allPieces);
  };
  reader.readAsText(file, 'UTF-8');
}

// ─── Eventos ──────────────────────────────────────────────────────────────
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

btn15.addEventListener('click', () => {
  const { w, h } = getSheetSize();
  const p15 = allPieces.filter(p => p.thickness === 15);
  const sct = generateSCT(p15, w, h);   // generator.js
  downloadFile(sct, 'plano_15mm.sct');  // generator.js
});

btn18.addEventListener('click', () => {
  const { w, h } = getSheetSize();
  const p18 = allPieces.filter(p => p.thickness === 18);
  const sct = generateSCT(p18, w, h);
  downloadFile(sct, 'plano_18mm.sct');
});

btnReset.addEventListener('click', () => {
  allPieces = [];
  fileInput.value        = '';
  fileName.style.display  = 'none';
  uploadZone.classList.remove('has-file');
  previewWrap.classList.remove('visible');
  tableBody.innerHTML    = '';
  statusEl.className     = 'status';
  btn15.disabled         = true;
  btn18.disabled         = true;
});
