# Conversor SCT
**Conversor de lista de peças (Promob) para plano de corte (SketchCut)**

![Versão](https://img.shields.io/badge/versão-0.0-c8922a)
![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![Licença](https://img.shields.io/badge/licença-MIT-green)

---

## Sobre

Ferramenta web para converter a lista de peças exportada pelo **Promob** diretamente para o formato `.sct` do **SketchCut** — sem digitação manual, sem erros de transcrição.

Roda 100% no navegador. Sem instalação, sem servidor, sem cadastro.

---

## O Problema

O fluxo de trabalho em uma marcenaria que usa software de projeto é, na teoria, simples:

1. Projetar o móvel no Promob
2. Exportar a lista de peças
3. Gerar o plano de corte no SketchCut
4. Cortar

Na prática, o passo 2 para o 3 era **totalmente manual**. Para cada projeto, era necessário digitar peça por peça no SketchCut — dimensões, quantidade, material. Em projetos grandes, isso facilmente representa horas de trabalho repetitivo e sujeito a erros.

---

## A Solução

O Promob exporta a lista de peças em um formato de arquivo estruturado (o mesmo reconhecido pelo CutListPlus e outros softwares do setor). O SketchCut trabalha com arquivos `.sct` para importar planos de corte.

Este conversor faz a ponte entre os dois: lê o arquivo exportado pelo Promob e gera o `.sct` pronto para abrir no SketchCut. O SketchCut então recalcula e otimiza o plano automaticamente.

---

## Como Usar

1. Abra o `index.html` no navegador
2. No Promob, exporte a lista de peças — [PENDENTE: caminho exato no menu do Promob]
3. Arraste o arquivo exportado para a área de upload
4. Confira a lista de peças na tabela de preview
5. Clique em **Baixar .SCT — 15mm** ou **18mm** conforme o material
6. Abra o `.sct` no SketchCut
7. Mande recalcular o plano — o SketchCut reorganiza tudo automaticamente

---

## Funcionalidades

### v0.0 (atual)
- [x] Upload de arquivo `.txt` / `.csv`
- [x] Parser da lista de peças do Promob
- [x] Separação automática por espessura (15mm / 18mm)
- [x] Preview da lista em tabela antes de exportar
- [x] Geração do `.sct` compatível com SketchCut
- [x] Download separado por material

---

## Roadmap

| Versão | Funcionalidade |
|--------|---------------|
| v0.1 | Suporte a mais espessuras (25mm, 6mm...) |
| v0.2 | Configuração de fitas de borda |
| v0.3 | Múltiplos materiais e cores |
| v0.4 | Histórico de conversões |
| v1.0 | Versão estável — publicação no GitHub Pages |

---

## Estrutura do Projeto

```
conversor-sct/
│
├── index.html          → interface principal
├── README.md           → este arquivo
│
├── css/
│   └── style.css       → estilos da interface
│
├── js/
│   ├── parser.js       → lê e interpreta o arquivo do Promob
│   ├── generator.js    → gera o arquivo .sct
│   └── ui.js           → lógica da interface (upload, tabela, botões)
│
└── docs/
    ├── changelog.md    → histórico de versões e decisões
    └── formato-sct.md  → documentação técnica do formato .sct
```

---

## Tecnologias

- HTML5
- CSS3
- JavaScript (vanilla — sem frameworks)

---

## Notas de Desenvolvimento

A lógica de conversão e a engenharia reversa do formato `.sct` foram desenvolvidas com assistência de IA (Claude — Anthropic).

O processo envolveu análise comparativa de múltiplos arquivos `.sct` gerados pelo próprio SketchCut para identificar a estrutura exata do formato — incluindo detalhes críticos como número de linhas em branco no cabeçalho e comportamento do software ao recalcular posições.

A interface e a identidade visual do projeto são de autoria do desenvolvedor.

---

## Autor

**Henrique** — HC Marcenaria  
Projeto iniciado em 2025 como solução interna, evoluindo para ferramenta open source.

---

*"Parti de um problema real no dia a dia da marcenaria e fui resolvendo um passo de cada vez."*
