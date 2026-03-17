/**
 * ui.js — Conversor SCT
 * HC Marcenaria
 *
 * Gerencia todas as interações da interface:
 * upload de arquivo, preview da tabela, botão de download.
 *
 * v0.1 — todas as peças vão para um único .sct, sem separação por material
 */

// ─── Estado global ────────────────────────────────────────────────────────
let allPieces = [];

// ─── Referências aos elementos da página ─────────────────────────────────
const fileInput   = document.getElementById('fileInput');
const uploadZone  = document.getElementById('uploadZone');
const fileName    = document.getElementById('fileName');
const previewWrap = document.getElementById('previewWrap');
const tableBody   = document.getElementById('tableBody');
const summaryEl   = document.getElementById('summary');
const statusEl    = document.getElementById('status');
const btnDownload = document.getElementById('btnDownload');  // único botão de download
const btnReset    = document.getElementById('btnReset');

// ─── Exibe mensagem de status (ok ou erro) ────────────────────────────────
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

// ─── Renderiza a tabela de preview com todas as peças ────────────────────
function renderPreview(pieces) {
  // Calcula total de peças (somando quantidades)
  const total = pieces.reduce((sum, p) => sum + p.qty, 0);

  // Resumo no topo da tabela
  summaryEl.innerHTML = `
    <div class="summary-item">
      <span class="s-label">Grupos</span>
      <span class="s-value">${pieces.length}</span>
    </div>
    <div class="summary-item">
      <span class="s-label">Total de peças</span>
      <span class="s-value">${total}</span>
    </div>
    <div class="summary-item">
      <span class="s-label">Arquivo gerado</span>
      <span class="s-value">1 .sct</span>
    </div>
  `;

  // Preenche a tabela linha por linha
  tableBody.innerHTML = '';
  pieces.forEach((p, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="color:var(--muted)">${i + 1}</td>
      <td>${p.name}</td>
      <td>${p.width}</td>
      <td>${p.height}</td>
      <td style="color:var(--accent2);font-weight:600">${p.qty}</td>
    `;
    tableBody.appendChild(tr);
  });

  // Mostra a seção de preview e ativa o botão de download
  previewWrap.classList.add('visible');
  btnDownload.disabled = false;

  showStatus(`✓ ${pieces.length} grupos lidos — ${total} peças no total`, 'ok');
}

// ─── Processa o arquivo carregado pelo usuário ────────────────────────────
function processFile(file) {
  if (!file) return;

  // Atualiza a zona de upload com o nome do arquivo
  fileName.textContent   = file.name;
  fileName.style.display = 'block';
  uploadZone.classList.add('has-file');

  // Lê o conteúdo do arquivo como texto
  const reader = new FileReader();
  reader.onload = e => {
    // Chama o parser (parser.js) para interpretar o conteúdo
    allPieces = parseFile(e.target.result);

    if (allPieces.length === 0) {
      showStatus('✗ Nenhuma peça reconhecida. Verifique o formato do arquivo.', 'err');
      return;
    }

    renderPreview(allPieces);
  };
  reader.readAsText(file, 'UTF-8');
}

// ─── Eventos de upload ────────────────────────────────────────────────────

// Clique no input de arquivo
fileInput.addEventListener('change', e => processFile(e.target.files[0]));

// Drag and drop — previne comportamento padrão do browser
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

// ─── Botão download — gera único .sct com todas as peças ─────────────────
btnDownload.addEventListener('click', () => {
  const { w, h } = getSheetSize();

  // Chama o gerador (generator.js) com todas as peças
  const sct = generateSCT(allPieces, w, h);

  // Usa o nome do arquivo original como base para o nome do .sct
  const baseName = fileName.textContent.replace(/\.[^.]+$/, '');
  downloadFile(sct, `${baseName}.sct`);
});

// ─── Botão limpar — reseta tudo para o estado inicial ────────────────────
btnReset.addEventListener('click', () => {
  allPieces              = [];
  fileInput.value        = '';
  fileName.style.display = 'none';
  uploadZone.classList.remove('has-file');
  previewWrap.classList.remove('visible');
  tableBody.innerHTML    = '';
  statusEl.className     = 'status';
  btnDownload.disabled   = true;
});
