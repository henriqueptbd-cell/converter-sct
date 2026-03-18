# Conversor SCT
**Conversor de lista de peças (Promob) para plano de corte (SketchCut)**

![Versão](https://img.shields.io/badge/versão-1.0-c8922a)
![Status](https://img.shields.io/badge/status-estável-brightgreen)
![Licença](https://img.shields.io/badge/licença-MIT-green)

🔗 **[Acessar o app](https://converter-sct.vercel.app/)**

---

## Sobre

Ferramenta web para converter a lista de peças exportada pelo **Promob** diretamente para o formato `.sct` do **SketchCut** — sem digitação manual, sem erros de transcrição.

Roda 100% no navegador. Sem instalação, sem servidor, sem cadastro. Funciona no PC e no celular.

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

Este conversor faz a ponte entre os dois: lê o arquivo exportado pelo Promob e gera os `.sct` prontos para abrir no SketchCut — separados por material, com fitagem e nomes das peças configurados. O SketchCut então recalcula e otimiza o plano automaticamente.

---

## Como Usar

1. Abra o app no navegador — PC ou celular
2. No Promob, exporte a lista de peças em **Arquivo → Exportar → Lista de Peças (.txt)**
3. Arraste o arquivo exportado para a área de upload (ou clique para selecionar)
4. Confira a lista de peças na tabela de preview — separada por material
5. Na seção **Arquivos Gerados**, clique em **Baixar** para cada material desejado
6. Abra o `.sct` no SketchCut
7. Mande recalcular o plano — o SketchCut reorganiza tudo automaticamente

---

## Funcionalidades

- Upload de arquivo `.txt` / `.csv` exportado pelo Promob
- Separação automática por material (tipo + cor + espessura)
- Suporte a fitagem de bordas (0.4mm e 2mm, todos os lados)
- Nomes das peças incluídos no `.sct`
- Preview da lista em tabela antes de exportar
- Download individual por material
- Interface responsiva — funciona no PC e no celular

---

## Limitações Conhecidas

- **Nomes das peças no plano de corte** — a exibição dos nomes nas peças do plano visual requer o **SketchCut PRO**. Na versão gratuita do SketchCut (mobile), os nomes não aparecem no plano gráfico, mas aparecem na lista de peças — o que já permite conferência com as medidas.
- **Dimensões decimais** — valores como `794.5mm` são arredondados para baixo (`794mm`) por segurança na marcenaria.
- **Sulcos** — o campo de sulcos do SketchCut não é preenchido pelo conversor (não utilizado no fluxo atual).

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
│   └── ui.js           → lógica da interface
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
- Hospedagem: Vercel

---

## Notas de Desenvolvimento

A lógica de conversão e a engenharia reversa do formato `.sct` foram desenvolvidas com assistência de IA (Claude — Anthropic).

O processo envolveu análise comparativa de múltiplos arquivos `.sct` gerados pelo próprio SketchCut — incluindo testes específicos para mapear fitagem de bordas, nomes de peças e estrutura do cabeçalho campo a campo.

A interface, identidade visual e decisões de produto são de autoria do desenvolvedor.

---

## Autor

**Henrique** — HC Marcenaria
Projeto iniciado como solução interna para automatizar o fluxo Promob → SketchCut.

🔗 [Acessar o app](https://converter-sct.vercel.app/)

---

*"Parti de um problema real no dia a dia da marcenaria e fui resolvendo um passo de cada vez."*