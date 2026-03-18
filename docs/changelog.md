# Changelog — Conversor SCT

Histórico de versões, decisões técnicas e aprendizados do projeto.

---

## [v1.0] — 2025 — Versão Estável

### Resumo
Primeira versão estável do Conversor SCT. Todas as funcionalidades principais implementadas e validadas com projetos reais de marcenaria.

### Funcionalidades entregues
- Conversão de lista do Promob (.txt) para .sct do SketchCut
- Separação automática por material (tipo + cor + espessura)
- Fitagem de bordas (0.4mm e 2mm, todos os lados)
- Nomes das peças no .sct
- Interface responsiva — PC e celular
- Download individual por material

### Ajustes finais
- `style.css` — responsivo mobile: padding reduzido, botões maiores, fonte 16px nos inputs (evita zoom no iOS), hint de arrastar escondido no celular
- `style.css` — versão e footer com cor e tamanho legíveis

### Limitações conhecidas
- Nomes das peças no plano gráfico requerem SketchCut PRO (versão mobile gratuita mostra apenas na lista)
- Dimensões decimais arredondadas para baixo (ex: 794.5 → 794)
- Sulcos não preenchidos (fora do escopo atual)

---

## [v0.4] — 2025

### Adicionado
- Nomes das peças no arquivo .sct — campo `10nome` validado por engenharia reversa
- Espaços substituídos por traço (ex: "base inferior" → "base-inferior")
- Acentos e caracteres especiais (ç, ã, é) aceitos pelo SketchCut

### Alterado
- `generator.js` — nova função `sanitizeName()` e campo `10nome` dinâmico

---

## [v0.3] — 2025

### Adicionado
- Fitagem de bordas no .sct — campo `AXB_0X0` gerado dinamicamente

### Lógica validada
Fórmula por eixo: `valor = (n_2mm × 1) + (n_04mm × 2) + (n_04mm > 0 ? 1 : 0)`

| Configuração | Valor |
|---|---|
| sem fita | 0 |
| 1 lado 2mm | 1 |
| 2 lados 2mm | 2 |
| 1 lado 0.4mm | 3 |
| 2 lados 0.4mm | 4 |
| 1 lado 2mm + 1 lado 0.4mm | 5 |

Campos do Promob: `[5][6]` → Comprimento → `A` / `[7][8]` → Largura → `B`

### Alterado
- `parser.js` — função `calcEdge()` e extração de `edgeComp` / `edgeLarg`
- `generator.js` — campo de fitagem dinâmico

---

## [v0.2] — 2025

### Adicionado
- Separação por material (tipo + cor + espessura)
- Lista de downloads — um card por material, botão individual
- Nome do arquivo .sct inclui material: ex `nilma_MDF_Branco_15mm.sct`

### Alterado
- `parser.js` — função `parseMaterial()` e agrupamento por material
- `ui.js` — lista dinâmica de downloads
- `index.html` + `style.css` — card de arquivos gerados

### Validado com
- `nilma_guarda_roupa.txt` — 3 materiais, 97 peças, 3 arquivos .sct

---

## [v0.1] — 2025

### Corrigido
- `parser.js` — índices corretos: largura `[2]`, altura `[3]`, quantidade `[4]`
- `parser.js` — `Math.floor(parseFloat(...))` para decimais

---

## [v0.0] — 2025

### Adicionado
- Interface web HTML/CSS/JS puro
- Upload, preview, geração e download do .sct
- Estrutura de pastas `css/`, `js/`, `docs/`

### Como o formato .sct foi descoberto
Engenharia reversa com 4 arquivos do SketchCut (1, 5, 15 peças e vazio).
Detalhe crítico: **5 linhas em branco** entre `1X4X10_True` e o `2` no cabeçalho.
Validado: posições dummy `111_-1X10X10` são aceitas — SketchCut recalcula ao otimizar.

---

*Projeto iniciado na HC Marcenaria como solução para automatizar o fluxo Promob → SketchCut*