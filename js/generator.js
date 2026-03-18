/**
 * generator.js — Conversor SCT
 * HC Marcenaria
 *
 * Responsável por gerar o arquivo .sct compatível com o SketchCut.
 *
 * Formato validado por engenharia reversa de arquivos reais do SketchCut.
 * Detalhes técnicos documentados em: docs/formato-sct.md
 *
 * Lógica de conversão desenvolvida com assistência de IA (Claude — Anthropic).
 */

/**
 * Sanitiza o nome da peça para uso no .sct.
 * Espaços são substituídos por traço — mais seguro e universal.
 *
 * @param {string} name - Nome original da peça
 * @returns {string} Nome sanitizado
 */
function sanitizeName(name) {
  if (!name) return '';
  return name.trim().replace(/\s+/g, '-');
}

/**
 * Gera o conteúdo de um arquivo .sct para o SketchCut.
 *
 * As peças são inseridas com posição dummy (111_-1X10X10).
 * O SketchCut recalcula e reorganiza o plano ao otimizar.
 *
 * Fitagem: campo AXB_0X0 onde:
 *   A = valor do eixo Comprimento (calculado pelo parser)
 *   B = valor do eixo Largura    (calculado pelo parser)
 *   _0X0 = sulcos (não utilizado)
 *
 * Nome: concatenado direto no "10" → ex: "10base", "10lateral"
 * Peça sem nome → "10"
 *
 * @param {Array}  pieces  - Array de objetos { width, height, qty, edgeComp, edgeLarg, name }
 * @param {number} sheetW  - Largura da chapa em mm
 * @param {number} sheetH  - Altura da chapa em mm
 * @returns {string} Conteúdo do arquivo .sct
 */
function generateSCT(pieces, sheetW = 2750, sheetH = 1850) {
  const lines = [];

  // ── Cabeçalho ──────────────────────────────────────────────────────────
  lines.push('<V3.0>');
  lines.push('1');
  lines.push(`${sheetW}X${sheetH}_1`);
  lines.push('1X4X10_True');

  // CRÍTICO: exatamente 5 linhas em branco — o parser do SketchCut as conta
  lines.push('');
  lines.push('');
  lines.push('');
  lines.push('');
  lines.push('');

  lines.push('2');
  lines.push('');
  lines.push('0.4');
  lines.push('');
  lines.push('1');
  lines.push('');
  lines.push('');

  // ── Peças ───────────────────────────────────────────────────────────────
  lines.push(`<Parts>${pieces.length}`);

  for (const piece of pieces) {
    lines.push(`${piece.width}X${piece.height}X${piece.qty}`);

    // Campo de fitagem: AXB_0X0
    const edgeA = piece.edgeComp || 0;
    const edgeB = piece.edgeLarg || 0;
    lines.push(`${edgeA}X${edgeB}_0X0`);

    // Nome: "10" + nome sanitizado (espaços viram traço)
    // Peça sem nome → só "10"
    const name = sanitizeName(piece.name);
    lines.push(`10${name}`);

    // Posição dummy para cada unidade — SketchCut reorganiza ao otimizar
    for (let i = 0; i < piece.qty; i++) {
      lines.push('111_-1X10X10');
    }
  }

  // ── Sobras ──────────────────────────────────────────────────────────────
  lines.push('<USnips>0');
  lines.push('<NSnips>0');

  // ── Rodapé obrigatório ───────────────────────────────────────────────────
  lines.push('8');
  lines.push('15');
  lines.push('4');

  return lines.join('\n');
}

/**
 * Dispara o download de um arquivo de texto no navegador.
 *
 * @param {string} content  - Conteúdo do arquivo
 * @param {string} filename - Nome do arquivo para download
 */
function downloadFile(content, filename) {
  const blob = new Blob([content], { type: 'text/plain;charset=ascii' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}