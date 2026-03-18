# Changelog — Conversor SCT

Histórico de versões, decisões técnicas e aprendizados do projeto.

---
## [v0.4] — 2025

### Adicionado
- Nomes das peças no arquivo .sct gerado
- Espaços no nome substituídos por traço (ex: "base inferior" → "base-inferior")

### Alterado
- `generator.js` — nova função `sanitizeName()` que trata espaços no nome
- `generator.js` — linha de código da peça agora é `10nome` em vez de `10` fixo

### Formato validado
O nome é concatenado diretamente na linha do código da peça:
- `10`          → sem nome
- `10base`      → nome "base"
- `10base-inf`  → nome com espaço sanitizado
Acentos e caracteres especiais (ç, ã, é) aceitos pelo SketchCut.

---


## [v0.3] — 2025

### Adicionado
- Suporte a fitagem de bordas no arquivo .sct gerado
- Campo `AXB_0X0` agora reflete as fitas configuradas no Promob

### Alterado
- `parser.js` — nova função `calcEdge()` que converte os campos de borda `[5][6][7][8]` para o valor do SketchCut
- `parser.js` — `parseLine()` agora extrai `edgeComp` e `edgeLarg` de cada peça
- `generator.js` — campo de fitagem `AXB_0X0` gerado dinamicamente em vez de fixo `0X0_0X0`

### Lógica de fitagem validada
Descoberta por engenharia reversa com 6 arquivos de teste gerados pelo SketchCut.

O campo `AXB_0X0` onde:
- `A` = valor do eixo Comprimento
- `B` = valor do eixo Largura
- `_0X0` = sulcos (não utilizado)

Fórmula por eixo: `valor = (n_lados_2mm × 1) + (n_lados_04mm × 2) + (n_lados_04mm > 0 ? 1 : 0)`

| Configuração do eixo | Valor |
|---|---|
| sem fita | 0 |
| 1 lado 2mm | 1 |
| 2 lados 2mm | 2 |
| 1 lado 0.4mm | 3 |
| 2 lados 0.4mm | 4 |
| 1 lado 2mm + 1 lado 0.4mm | 5 |

Campos do Promob:
- `[5]` e `[6]` → Comprimento → calcula `A`
- `[7]` e `[8]` → Largura → calcula `B`

---

## [v0.2] — 2025

### Adicionado
- Separação automática de peças por material (tipo + cor + espessura)
- Lista de arquivos gerados — um card por material com botão de download individual
- Nome do arquivo .sct inclui material: ex `nilma_guarda_roupa_MDF_Branco_15mm.sct`
- Linha separadora por material na tabela de preview

### Alterado
- `parser.js` — nova função `parseMaterial()` que extrai tipo, cor e espessura do campo [1]
- `parser.js` — `parseFile()` agora retorna grupos por material em vez de array flat
- `ui.js` — substituído botão único por lista dinâmica de downloads por material
- `index.html` — novo card "Arquivos Gerados"
- `style.css` — estilos dos cards de download individual

### Validado com
- `nilma_guarda_roupa.txt` — 3 materiais, 97 peças, 3 arquivos .sct gerados

---

## [v0.1] — 2025

### Corrigido
- `parser.js` — índices das colunas corrigidos: largura `[2]`, altura `[3]`, quantidade `[4]`
- `parser.js` — `Math.floor(parseFloat(...))` para decimais (ex: `794.5` → `794`)

---

## [v0.0] — 2025

### Adicionado
- Interface web completa HTML/CSS/JS
- Upload, preview, geração e download do .sct
- Estrutura de pastas `css/`, `js/`, `docs/`

### Como o formato .sct foi descoberto
Engenharia reversa com 4 arquivos do SketchCut.
Detalhe crítico: **5 linhas em branco** entre `1X4X10_True` e o `2`.

---

## Roadmap

| Versão | Funcionalidade | Status |
|--------|---------------|--------|
| v0.0 | Conversão básica | ✅ |
| v0.1 | Parser corrigido | ✅ |
| v0.2 | Separação por material | ✅ |
| v0.3 | Fitagem de bordas | ✅ |
| v0.4 | Nomes das peças no .sct | ✅ |
| v0.4 | Histórico de conversões | 🔜 |
| v1.0 | Versão estável — GitHub Pages | 🔜 |

---

*Projeto iniciado na HC Marcenaria como solução para automatizar o fluxo Promob → SketchCut*