/**
 * parser.js — Conversor SCT
 * HC Marcenaria
 *
 * Responsável por ler e interpretar a lista de peças
 * exportada pelo Promob (formato compatível com CutListPlus).
 *
 * Lógica de conversão desenvolvida com assistência de IA (Claude — Anthropic).
 */

/**
 * Interpreta uma linha do arquivo de lista de peças.
 *
 * Formato esperado (separado por ponto e vírgula):
 * [CÓDIGO.ESP.COR.GRUPO.NOME];[MATERIAL];[LARGURA];[ALTURA];[QTD];[KERF];0;0;0
 *
 * Exemplo:
 * 1.2006.15.Branco.MDF - Base 15;MDF - 15 mm.Branco;1600;380;1;0.4;0;0;0
 *
 * @param {string} line - Uma linha do arquivo
 * @returns {Object|null} Objeto com os dados da peça, ou null se a linha for inválida
 */
function parseLine(line) {
  line = line.trim();
  if (!line) return null;

  const parts = line.split(';');
  if (parts.length < 7) return null;

  // Cabeçalho: 1.CODIGO.ESPESSURA.COR.NOME
  const header = parts[0].split('.');
  const thickness = parseInt(header[2]) || 0;
  const name = header.slice(3).join('.').trim();

  const width  = parseInt(parts[5]);
  const height = parseInt(parts[6]);
  const qty    = parseInt(parts[7]) || 1;

  if (!width || !height || !thickness) return null;

  return { thickness, name, width, height, qty };
}

/**
 * Interpreta o conteúdo completo do arquivo de lista de peças.
 *
 * @param {string} text - Conteúdo do arquivo como string
 * @returns {Array} Array de objetos de peça
 */
function parseFile(text) {
  const lines = text.split('\n');
  const pieces = [];

  for (const line of lines) {
    const piece = parseLine(line);
    if (piece) pieces.push(piece);
  }

  return pieces;
}
