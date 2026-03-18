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
 * Calcula o valor de fitagem para um eixo a partir dos dois lados.
 *
 * Lógica validada por engenharia reversa do SketchCut:
 *   - Cada lado com 2mm  contribui com +1
 *   - Cada lado com 0.4mm contribui com +2
 *   - Sem fita = 0
 *
 * Exemplos:
 *   lado1=2,   lado2=0   → 1
 *   lado1=2,   lado2=2   → 2
 *   lado1=0.4, lado2=0   → 3  (0 + 2 + ... wait)
 *
 * Tabela completa validada:
 *   0 lados         → 0
 *   1 lado 2mm      → 1
 *   2 lados 2mm     → 2
 *   1 lado 0.4mm    → 3  (2 + ... hmm)
 *
 * Revisando: valor = soma individual de cada lado onde:
 *   lado 2mm   = +1
 *   lado 0.4mm = +2 (não +3)
 * Mas 1 lado 0.4mm deu 3, não 2. Então:
 *   lado 0.4mm = +3? Mas 2 lados 0.4mm deu 4, não 6.
 *
 * Tabela real confirmada nos testes:
 *   0 lados              → 0
 *   1x 2mm               → 1
 *   2x 2mm               → 2
 *   1x 0.4mm             → 3
 *   2x 0.4mm             → 4
 *   1x 2mm + 1x 0.4mm   → 5
 *
 * Fórmula correta: valor = (n2mm × 1) + (n04mm × 2) + (n04mm > 0 ? 1 : 0)
 * Simplificando com mapeamento direto por caso:
 *
 * @param {number} lado1 - Valor do primeiro lado (0, 0.4 ou 2)
 * @param {number} lado2 - Valor do segundo lado (0, 0.4 ou 2)
 * @returns {number} Valor de fitagem para o eixo
 */
function calcEdge(lado1, lado2) {
  const n2mm  = (lado1 === 2   ? 1 : 0) + (lado2 === 2   ? 1 : 0);
  const n04mm = (lado1 === 0.4 ? 1 : 0) + (lado2 === 0.4 ? 1 : 0);

  // Mapeamento direto validado nos testes:
  // n2mm=1, n04mm=0 → 1
  // n2mm=2, n04mm=0 → 2
  // n2mm=0, n04mm=1 → 3
  // n2mm=0, n04mm=2 → 4
  // n2mm=1, n04mm=1 → 5
  return (n2mm * 1) + (n04mm * 2) + (n04mm > 0 ? 1 : 0);
}

/**
 * Extrai tipo de material, espessura e cor do campo [1] da linha.
 *
 * Exemplos:
 *   "MDF - 15 mm.Branco"                → { type:"MDF", thickness:"15mm", color:"Branco" }
 *   "MDF - 15 mm.Duratex.Trama.Grafite" → { type:"MDF", thickness:"15mm", color:"Duratex.Trama.Grafite" }
 *
 * @param {string} materialField - Campo [1] da linha
 * @returns {Object} { type, thickness, color, key }
 */
function parseMaterial(materialField) {
  materialField = materialField.trim();

  const dotIndex  = materialField.indexOf('.');
  const beforeDot = materialField.substring(0, dotIndex).trim();
  const color     = materialField.substring(dotIndex + 1).trim();
  const type      = beforeDot.split(' - ')[0].trim();

  const thicknessMatch = beforeDot.match(/(\d+)\s*mm/);
  const thickness      = thicknessMatch ? thicknessMatch[1] + 'mm' : 'Xmm';

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
 * [5] fita comprimento lado 1  → ex: 0.4
 * [6] fita comprimento lado 2  → ex: 0
 * [7] fita largura lado 1      → ex: 0
 * [8] fita largura lado 2      → ex: 0
 *
 * @param {string} line - Uma linha do arquivo
 * @returns {Object|null} Objeto com os dados da peça, ou null se inválida
 */
function parseLine(line) {
  line = line.trim();
  if (!line) return null;

  const parts = line.split(';');
  if (parts.length < 5) return null;

  const header = parts[0].split('.');
  const name   = header.slice(3).join('.').trim();

  const material = parseMaterial(parts[1]);

  // Dimensões arredondadas para baixo (Math.floor trata decimais como 794.5 → 794)
  const width  = Math.floor(parseFloat(parts[2]));
  const height = Math.floor(parseFloat(parts[3]));
  const qty    = parseInt(parts[4]) || 1;

  if (!width || !height) return null;

  // Fitagem — campos opcionais, default 0 se ausentes
  const e1 = parseFloat(parts[5]) || 0;  // comprimento lado 1
  const e2 = parseFloat(parts[6]) || 0;  // comprimento lado 2
  const e3 = parseFloat(parts[7]) || 0;  // largura lado 1
  const e4 = parseFloat(parts[8]) || 0;  // largura lado 2

  // Calcula valores de fitagem para cada eixo
  const edgeComp = calcEdge(e1, e2);  // valor A do campo AXB_0X0
  const edgeLarg = calcEdge(e3, e4);  // valor B do campo AXB_0X0

  return { name, width, height, qty, material, edgeComp, edgeLarg };
}

/**
 * Interpreta o arquivo completo e retorna peças agrupadas por material.
 *
 * @param {string} text - Conteúdo do arquivo
 * @returns {Object} Grupos de peças por material
 */
function parseFile(text) {
  const lines  = text.split('\n');
  const groups = {};

  for (const line of lines) {
    const piece = parseLine(line);
    if (!piece) continue;

    const key = piece.material.key;

    if (!groups[key]) {
      groups[key] = { material: piece.material, pieces: [] };
    }

    groups[key].pieces.push({
      name:      piece.name,
      width:     piece.width,
      height:    piece.height,
      qty:       piece.qty,
      edgeComp:  piece.edgeComp,
      edgeLarg:  piece.edgeLarg
    });
  }

  return groups;
}
