# Diagnóstico e correção — logo responsiva da sidebar

## Causa da instabilidade

A marca Facilities AI estava posicionada de forma absoluta dentro da sidebar:

```css
position: absolute;
bottom: 188px;
left: 15px;
right: 15px;
```

Em telas altas, esse valor coincidia visualmente com o espaço livre. Em resoluções com menor altura, o menu precisava de mais espaço, mas a logo continuava presa à mesma distância do rodapé. Como ela não participava do fluxo do layout, podia cobrir links de navegação ou parecer deslocada.

Havia ainda uma segunda variação para telas maiores, alterando o `bottom` para `202px`. Isso fazia a posição depender de combinações específicas de largura e altura, em vez de depender da estrutura real da sidebar.

## Correção estrutural

A logo passou a fazer parte de um rodapé real da sidebar:

```text
Marca Klabin
Navegação flexível e rolável
Rodapé institucional
  ├─ mensagens institucionais
  └─ marca Facilities AI
```

O rodapé usa fluxo flexível normal, sem coordenadas absolutas. A navegação ocupa apenas o espaço restante e possui rolagem própria quando necessário.

## Ajustes estéticos

- Klabin permanece como marca principal no topo.
- Facilities AI foi reduzida e recebeu uma área discreta no rodapé.
- A logo tem largura máxima controlada e dimensões HTML reservadas para evitar deslocamento durante o carregamento.
- O rodapé recebeu separação visual leve, sem competir com o menu.
- A transparência e a sombra foram suavizadas para manter hierarquia de marca.
- Em telas de baixa altura, os itens do menu ficam mais compactos.
- Abaixo de 700 px de altura, os textos institucionais secundários são ocultados; a navegação e a logo permanecem visíveis.

## Arquivos alterados

- `src/components/app-sidebar.tsx`
- `src/styles.css`
- `scripts/validate-project.mjs`

Nenhum workflow ou endpoint foi alterado.
