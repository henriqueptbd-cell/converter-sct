# Conversor SCT
**Conversor de lista de peças (Promob) para plano de corte (SketchCut)**

![Versão](https://img.shields.io/badge/versão-0.4-c8922a)
![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![Licença](https://img.shields.io/badge/licença-MIT-green)

🔗 **[Acessar o app](https://converter-sct-git-master-henrique-camargos-projects.vercel.app/)**

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

Na prática, o passo 2 para o 3 era **totalmente manual**. Para cada projeto, era necessário digitar peça por peça no SketchCut — dimensões, quantidade, material, fitagem. Em projetos grandes, isso facilmente representa horas de trabalho repetitivo e sujeito a erros.

---

## A Solução

O Promob exporta a lista de peças em um formato de arquivo estruturado (o mesmo reconhecido pelo CutListPlus e outros softwares do setor). O SketchCut trabalha com arquivos `.sct` para importar planos de corte.

Este conversor faz a ponte entre os dois: lê o arquivo exportado pelo Promob e gera os `.sct` prontos para abrir no SketchCut — separados por material, com fitagem configurada. O SketchCut então recalcula e otimiza o plano automaticamente.

---

## Como Usar

1. Abra o `index.html` no navegador
2. No Promob, exporte a lista de peças — [PENDENTE: caminho exato no menu do Promob]
3. Arraste o arquivo exportado para a área de upload
4. Confira a lista de peças na tabela de preview — separada por material
5. Na seção **Arquivos Gerados**, clique em **Baixar** para cada material desejado
6. Abra o `.sct` no SketchCut
7. Mande recalcular o plano — o SketchCut reorganiza tudo automaticamente

---

## Funcionalidades

### v0.4 (atual)
- [x] Upload de arquivo `.txt` / `.csv`
- [x] Parser da lista de peças do Promob
- [x] Separação automática por material (tipo + cor + espessura)
- [x] Preview da lista em tabela com separadores por material
- [x] Nomes das peças no .sct (espaços substituídos por traço)
- [x] Suporte a fitagem de bordas (0.4mm e 2mm, todos os lados)
- [x] Geração do `.sct` compatível com SketchCut
- [x] Download individual por material

---

## Roadmap

| Versão | Funcionalidade | Status |
|--------|---------------|--------|
| v0.0 | Conversão básica | ✅ |
| v0.1 | Parser corrigido | ✅ |
| v0.2 | Separação por material | ✅ |
| v0.3 | Fitagem de bordas | ✅ |
| v0.4 | Nomes das peças no .sct | ✅ |
| v0.5 | Edição da lista — adicionar, remover e editar peças | 🔜 |
| v0.6 | Histórico de conversões | 🔜 |
| v1.0 | Versão estável — GitHub Pages | 🔜 |

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

O processo envolveu análise comparativa de múltiplos arquivos `.sct` gerados pelo próprio SketchCut — incluindo testes específicos para mapear o formato de fitagem de bordas campo a campo.

A interface e a identidade visual do projeto são de autoria do desenvolvedor.

---

## Autor

**Henrique** — HC Marcenaria  
Projeto iniciado como solução interna para automatizar o fluxo Promob → SketchCut.

---

*"Parti de um problema real no dia a dia da marcenaria e fui resolvendo um passo de cada vez."*