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

## [v0.2] — previsto

- Suporte a fitas de borda (campo atualmente ignorado no parser)

---

*Projeto iniciado na HC Marcenaria como solução para automatizar o fluxo Promob → SketchCut*
