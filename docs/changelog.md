# Changelog — Conversor SCT

Histórico de versões, decisões técnicas e aprendizados do projeto.

---

## [v0.0] — 2025

### Adicionado
- Interface web completa em HTML/CSS/JS
- Upload de arquivo `.txt` / `.csv`
- Parser da lista de peças exportada pelo Promob
- Separação automática por espessura (15mm / 18mm)
- Preview em tabela com resumo de quantidades
- Geração do arquivo `.sct` compatível com SketchCut
- Download separado por material

### Decisões técnicas
- **Tecnologia:** HTML + CSS + JavaScript puro (sem frameworks) — para rodar direto no navegador sem instalação
- **Posições dummy:** todas as peças geradas com posição `111_-1X10X10` — o SketchCut recalcula ao otimizar
- **NSnips zerado:** `<NSnips>0` sem dados é aceito pelo SketchCut
- **Estrutura de pastas:** separação em `css/`, `js/`, `docs/` desde o início para facilitar manutenção

### Como o formato .sct foi descoberto
O formato foi descoberto por engenharia reversa — análise comparativa de 4 arquivos gerados pelo próprio SketchCut:
- `teste1.sct` — 1 peça
- `teste2.sct` — 5 peças
- `teste3.sct` — 15 peças (mais de uma chapa)
- `teste4.sct` — arquivo vazio (sem peças)

A comparação revelou o detalhe crítico: **exatamente 5 linhas em branco** entre `1X4X10_True` e o `2` no cabeçalho. Versões anteriores do gerador falhavam por usar 3 linhas.

A conversão foi validada com sucesso: arquivo gerado pelo conversor abriu no SketchCut, e após recalcular o plano o software reorganizou todas as peças corretamente.

---

## [v0.1] — previsto

- Suporte a espessuras adicionais (25mm, 6mm...)
- Melhoria no parser para lidar com variações no formato de exportação

---

## Changelog — Conversor SCT

Histórico de versões, decisões técnicas e aprendizados do projeto.

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
- `index.html` — novo card "Arquivos Gerados" que aparece após leitura do arquivo
- `style.css` — estilos dos cards de download individual

### Decisões técnicas
- Chave de agrupamento: `TIPO_COR_ESPESSURA` — ex: `MDF_Branco_15mm`
- O campo [1] da linha (ex: `MDF - 15 mm.Branco`) contém todas as informações necessárias
- O ponto é o separador entre espessura e cor: `"MDF - 15 mm"` + `"."` + `"Branco"`
- Cor pode conter pontos internos (ex: `Duratex.Trama.Grafite`) — por isso usa `indexOf('.')` no primeiro ponto apenas

### Validado com
- `nilma_guarda_roupa.txt` — 3 materiais (18mm, 6mm, 15mm), 97 peças, 3 arquivos .sct gerados

---

## [v0.1] — 2025

### Adicionado
- Arquivo único `.sct` com todas as peças sem separação por material
- Nome do arquivo gerado usa o nome do arquivo original

### Corrigido
- `parser.js` — índices das colunas corrigidos: largura `[2]`, altura `[3]`, quantidade `[4]`
- `parser.js` — trocado `parseInt` por `Math.floor(parseFloat(...))` para lidar com decimais (ex: `794.5` → `794`)

---

## [v0.0] — 2025

### Adicionado
- Interface web completa em HTML/CSS/JS
- Upload de arquivo `.txt` / `.csv`
- Parser da lista de peças exportada pelo Promob
- Separação por espessura (15mm / 18mm) — abordagem descartada na v0.1
- Preview em tabela com resumo de quantidades
- Geração do arquivo `.sct` compatível com SketchCut
- Download separado por material

### Decisões técnicas
- **Tecnologia:** HTML + CSS + JavaScript puro — roda direto no navegador sem instalação
- **Posições dummy:** todas as peças geradas com posição `111_-1X10X10` — o SketchCut recalcula ao otimizar
- **NSnips zerado:** `<NSnips>0` sem dados é aceito pelo SketchCut
- **Estrutura de pastas:** separação em `css/`, `js/`, `docs/` desde o início

### Como o formato .sct foi descoberto
Engenharia reversa com 4 arquivos gerados pelo próprio SketchCut (1 peça, 5 peças, 15 peças, vazio).
Detalhe crítico: **exatamente 5 linhas em branco** entre `1X4X10_True` e o `2` no cabeçalho.

---

## Roadmap

| Versão | Funcionalidade | Status |
|--------|---------------|--------|
| v0.0 | Conversão básica, separação 15mm/18mm | ✅ |
| v0.1 | Arquivo único, parser corrigido | ✅ |
| v0.2 | Separação por material, lista de downloads | ✅ |
| v0.3 | Suporte a fitas de borda | 🔜 |
| v0.4 | Histórico de conversões | 🔜 |
| v1.0 | Versão estável — GitHub Pages | 🔜 |

---

*Projeto iniciado na HC Marcenaria como solução para automatizar o fluxo Promob → SketchCut*