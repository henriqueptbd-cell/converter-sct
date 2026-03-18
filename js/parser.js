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
 * Extrai tipo de material, espessura e cor do campo [1] da linha.
 *
 * Exemplos de entrada:
 *   "MDF - 15 mm.Branco"                    → { type: "MDF", thickness: "15mm", color: "Branco" }
 *   "MDF - 15 mm.Duratex.Trama.Grafite"     → { type: "MDF", thickness: "15mm", color: "Duratex.Trama.Grafite" }
 *   "MDF - 6 mm.Branco"                     → { type: "MDF", thickness: "6mm",  color: "Branco" }
 *
 * Formato do campo: "TIPO - ESPESSURA mm.COR"
 *
 * @param {string} materialField - Campo [1] da linha
 * @returns {Object} { type, thickness, color, key }
 */
function parseMaterial(materialField) {
  materialField = materialField.trim();

  // Separa "MDF - 15 mm.Branco" em duas partes pelo ponto
  // Parte 0: "MDF - 15 mm"  →  tipo e espessura
  // Parte 1+: "Branco" ou "Duratex.Trama.Grafite"  →  cor (pode ter pontos)
  const dotIndex = materialField.indexOf('.');
  const beforeDot = materialField.substring(0, dotIndex).trim();   // "MDF - 15 mm"
  const color     = materialField.substring(dotIndex + 1).trim();  // "Branco" ou "Duratex.Trama.Grafite"

  // Extrai tipo: primeira palavra antes do " - "
  const type = beforeDot.split(' - ')[0].trim();  // "MDF"

  // Extrai espessura: número antes de "mm"
  const thicknessMatch = beforeDot.match(/(\d+)\s*mm/);
  const thickness = thicknessMatch ? thicknessMatch[1] + 'mm' : 'Xmm';

  // Chave única para agrupamento: ex "MDF_Branco_15mm"
  const key = `${type}_${color}_${thickness}`;

  return { type, thickness, color, key };
}

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
 * @param {string} line - Uma linha do arquivo
 * @returns {Object|null} Objeto com os dados da peça, ou null se a linha for inválida
 */
function parseLine(line) {
  line = line.trim();
  if (!line) return null;

  const parts = line.split(';');

  // Linha precisa ter pelo menos 5 campos
  if (parts.length < 5) return null;

  // Nome da peça extraído do campo [0]
  const header = parts[0].split('.');
  const name = header.slice(3).join('.').trim();

  // Material extraído do campo [1]
  const material = parseMaterial(parts[1]);

  // Dimensões — Math.floor para arredondar decimais para baixo (ex: 794.5 → 794)
  const width  = Math.floor(parseFloat(parts[2]));
  const height = Math.floor(parseFloat(parts[3]));
  const qty    = parseInt(parts[4]) || 1;

  if (!width || !height) return null;

  return { name, width, height, qty, material };
}

/**
 * Interpreta o arquivo completo e retorna as peças agrupadas por material.
 *
 * Retorna um Map onde cada chave é o identificador do material
 * e o valor é um objeto com info do material e array de peças.
 *
 * Exemplo de retorno:
 * {
 *   "MDF_Branco_15mm":  { material: { type, thickness, color, key }, pieces: [...] },
 *   "MDF_Branco_18mm":  { material: {...}, pieces: [...] },
 * }
 *
 * @param {string} text - Conteúdo do arquivo como string
 * @returns {Object} Grupos de peças por material
 */
function parseFile(text) {
  const lines  = text.split('\n');
  const groups = {};

  for (const line of lines) {
    const piece = parseLine(line);
    if (!piece) continue;

    const key = piece.material.key;

    // Cria o grupo se ainda não existe
    if (!groups[key]) {
      groups[key] = {
        material: piece.material,
        pieces: []
      };
    }

    // Adiciona a peça ao grupo correspondente
    groups[key].pieces.push({
      name:   piece.name,
      width:  piece.width,
      height: piece.height,
      qty:    piece.qty
    });
  }

  return groups;
}
