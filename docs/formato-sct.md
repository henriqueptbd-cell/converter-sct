# Documentação Técnica — Formato .sct (SketchCut)

> Documento gerado a partir de engenharia reversa de arquivos reais produzidos pelo SketchCut.  
> Base para o parser e gerador do Conversor SCT.

---

## Visão Geral

O arquivo `.sct` é o formato nativo do SketchCut para salvar e carregar planos de corte de painéis.  
É um arquivo de texto simples, encoding **ASCII**, quebra de linha **LF** (Unix).

---

## Estrutura Completa

```
<V3.0>
1
2750X1850_N        ← N = número de chapas usadas no plano
1X4X10_True        ← configurações de corte
                   ← linha em branco 1  ┐
                   ← linha em branco 2  │
                   ← linha em branco 3  │ EXATAMENTE 5 linhas em branco — CRÍTICO
                   ← linha em branco 4  │
                   ← linha em branco 5  ┘
2
                   ← linha em branco
0.4                ← espessura da lâmina de serra (kerf) em mm
                   ← linha em branco
1
                   ← linha em branco
                   ← linha em branco extra (adicionada pelo SketchCut ao salvar)
<Parts>N           ← N = número de grupos de peças
[bloco de peças]
<USnips>0
<NSnips>N          ← N = número de sobras calculadas
[bloco de NSnips se N > 0]
8
15
4
```

---

## Bloco de Peças

Cada grupo de peças segue o padrão:

```
LARGURAxALTURAxQTD
0X0_0X0
10
PREFIXO_-1XposXposY    ← repetido QTD vezes
```

### Prefixos de posição

| Prefixo | Significado |
|---------|-------------|
| 101 / 111 | Chapa 1 |
| 102 / 112 | Chapa 2 |
| 103 / 113 | Chapa 3 |

- `101`, `102`, `103` — primeira ocorrência de uma peça na chapa
- `111`, `112`, `113` — demais ocorrências

### Posição dummy para importação

Para importar apenas a lista de peças (sem posições calculadas), usar:

```
111_-1X10X10
```

O SketchCut aceita essa posição e recalcula ao otimizar.

---

## Bloco de NSnips (sobras)

```
LARGURAxALTURAxQTD
11_-1XposXposY
```

- `11_` = sobra da chapa 1
- `12_` = sobra da chapa 2
- Se `<NSnips>0`, nenhum dado é necessário

---

## Rodapé

O arquivo sempre termina com:

```
8
15
4
```

Presente em todos os arquivos analisados, independente do número de peças ou chapas.

---

## Arquivo Mínimo Válido (vazio)

```
<V3.0>
1
2750X1850_0
1X4X10_True




(5 linhas em branco)
2

0.4

1

<Parts>0
<USnips>0
<NSnips>0
8
15
4
```

---

## Observações

- O número `_N` em `2750X1850_N` é atualizado pelo SketchCut ao recalcular
- Ao salvar, o SketchCut adiciona 1 linha em branco extra antes de `<Parts>`
- O campo `0X0_0X0` abaixo de cada peça controla rotação e fio da madeira (0 = sem restrição)
- O campo `10` ou `00` após `0X0_0X0` indica configuração de borda

---

*Documento mantido como parte do projeto Conversor SCT — HC Marcenaria*
