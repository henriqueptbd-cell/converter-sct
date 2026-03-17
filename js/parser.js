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
 * [0] código interno   → ex: 1.2006.15.Branco.MDF - Base 15
 * [1] material         → ex: MDF - 15 mm.Branco
 * [2] LARGURA          → ex: 1600
 * [3] ALTURA           → ex: 380
 * [4] QUANTIDADE       → ex: 1
 * [5] borda 1          → ex: 0.4  (ignorado por enquanto)
 * [6] borda 2          → ex: 0    (ignorado por enquanto)
 * [7] borda 3          → ex: 0    (ignorado por enquanto)
 * [8] borda 4          → ex: 0    (ignorado por enquanto)
 *
 * Exemplo de linha completa:
 * 1.2006.15.Branco.MDF - Base 15;MDF - 15 mm.Branco;1600;380;1;0.4;0;0;0
 *
 * @param {string} line - Uma linha do arquivo
 * @returns {Object|null} Objeto com os dados da peça, ou null se a linha for inválida
 */
function parseLine(line) {
  line = line.trim();
  if (!line) return null;

  const parts = line.split(';');

  // Linha precisa ter pelo menos 5 campos (código, material, largura, altura, qtd)
  if (parts.length < 5) return null;

  // Extrai o nome da peça a partir do campo [0]
  // Formato: 1.CODIGO.ESPESSURA.COR.NOME  (o nome pode conter pontos)
  const header = parts[0].split('.');
  const name = header.slice(3).join('.').trim();

  // Largura e altura podem vir com decimal (ex: 794.5)
  // Usamos Math.floor para arredondar para baixo — mais seguro na marcenaria
  const width  = Math.floor(parseFloat(parts[2]));
  const height = Math.floor(parseFloat(parts[3]));
  const qty    = parseInt(parts[4]) || 1;

  // Linha inválida se dimensões zeradas ou ausentes
  if (!width || !height) return null;

  return { name, width, height, qty };
}

/**
 * Interpreta o conteúdo completo do arquivo de lista de peças.
 * Ignora linhas em branco e linhas com formato inválido.
 *
 * @param {string} text - Conteúdo do arquivo como string
 * @returns {Array} Array de objetos de peça { name, width, height, qty }
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
