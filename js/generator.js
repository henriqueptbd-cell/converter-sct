/**
 * generator.js — Conversor SCT
 * HC Marcenaria
 *
 * Responsável por gerar o arquivo .sct compatível com o SketchCut
 * a partir da lista de peças interpretada pelo parser.
 *
 * Formato validado por engenharia reversa de arquivos reais do SketchCut.
 * Detalhes técnicos documentados em: docs/formato-sct.md
 *
 * Lógica de conversão desenvolvida com assistência de IA (Claude — Anthropic).
 */

/**
 * Gera o conteúdo de um arquivo .sct para o SketchCut.
 *
 * As peças são inseridas com posição dummy (111_-1X10X10).
 * O SketchCut recalcula e reorganiza o plano ao otimizar.
 *
 * @param {Array}  pieces  - Array de objetos de peça { width, height, qty, name }
 * @param {number} sheetW  - Largura da chapa em mm (padrão: 2750)
 * @param {number} sheetH  - Altura da chapa em mm (padrão: 1850)
 * @returns {string} Conteúdo do arquivo .sct
 */
function generateSCT(pieces, sheetW = 2750, sheetH = 1850) {
  const lines = [];

  // ── Cabeçalho ──────────────────────────────────────────────────────────
  lines.push('<V3.0>');
  lines.push('1');
  lines.push(`${sheetW}X${sheetH}_1`);  // _1 = 1 chapa inicial (SketchCut ajusta ao recalcular)
  lines.push('1X4X10_True');

  // CRÍTICO: exatamente 5 linhas em branco — o parser do SketchCut as conta
  lines.push('');
  lines.push('');
  lines.push('');
  lines.push('');
  lines.push('');

  lines.push('2');
  lines.push('');
  lines.push('0.4');   // kerf: espessura da lâmina de serra
  lines.push('');
  lines.push('1');
  lines.push('');
  lines.push('');      // linha extra que o SketchCut adiciona ao salvar

  // ── Peças ───────────────────────────────────────────────────────────────
  lines.push(`<Parts>${pieces.length}`);

  for (const piece of pieces) {
    lines.push(`${piece.width}X${piece.height}X${piece.qty}`);
    lines.push('0X0_0X0');   // sem restrição de fio/rotação
    lines.push('10');        // configuração de borda padrão

    // Posição dummy para cada unidade — SketchCut reorganiza ao otimizar
    for (let i = 0; i < piece.qty; i++) {
      lines.push('111_-1X10X10');
    }
  }

  // ── Sobras ──────────────────────────────────────────────────────────────
  lines.push('<USnips>0');
  lines.push('<NSnips>0');

  // ── Rodapé (obrigatório) ─────────────────────────────────────────────────
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
