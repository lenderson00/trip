# Papel

Sistema de componentes com estetica de papel recortado / revista jovem, para
um site de planejamento de viagem.

```bash
npm run dev
```

Depois abra **http://localhost:3000/ui** — o catalogo vivo, com todos os
componentes em tamanho real.

**52 componentes:** 39 de papel (SVG e CSS), 9 efeitos WebGL autorais e 4
vendorizados do canvasui.dev.

## Tudo roda em WebGL2, sem flag

Nenhum componente depende de html-in-canvas, origin trial ou flag de browser.
Os efeitos desenham papel, tinta e luz por conta propria, entao aparecem igual
em Chrome, Safari e Firefox. Sem WebGL2, cada efeito mostra so o conteudo HTML,
intacto e interativo.

A pagina `/ui` tem um checkbox **desligar efeitos** pra ver como a pagina fica
sem eles.

## Estrutura

```
src/
  styles/tokens.css        UNICO lugar com cor e familia tipografica
  lib/
    seed.ts                PRNG deterministico
    canvas-support.ts      deteccao de WebGL2 (memoizada)
    svg.ts                 IDs de filtro estaveis + contorno de adesivo
  components/
    paper/                 39 componentes de papel (+ index.ts)
    fx/
      gl-effect.ts         runtime WebGL2: compila, uniforms, loop, limpeza
      gl-surface.tsx       empilha conteudo e canvas
      <efeito>.tsx         9 efeitos, cada um so um fragment shader
    canvasui/              vendorizado do canvasui.dev — NAO editar a mao
    rect-cache.ts          dependencia que o registry do Canvas UI nao entrega
  app/ui/                  o catalogo
```

## Escrever um efeito novo

Cada efeito e um fragment shader mais seus uniforms. O runtime cuida do resto:

```tsx
const SPEC: GlSpec<MinhaConfig> = {
  frag: `${GL_PRELUDE}
    uniform float uForca;
    void main () {
      vec2 rel = vUv * uResolution - uRectCenter;  // Y pra cima
      ...
    }`,
  defaults: { forca: 1 },
  uniforms: (gl, loc, c) => {
    if (loc.uForca) gl.uniform1f(loc.uForca, c.forca);
  },
};
```

`GL_PRELUDE` ja traz os uniforms comuns (`uTime`, `uResolution`, `uRectCenter`,
`uRectHalf`, `uDpr`), ruido simplex, fbm, fibra de papel, hash e SDF.

### Tres armadilhas que ja custaram caro aqui

1. **Array uniform chama-se `uFoo[0]`, nao `uFoo`.** E o nome que
   `getActiveUniform` devolve. O runtime ja registra os dois, mas se voce
   procurar o uniform pelo nome errado ele fica zerado e o shader nao desenha
   nada — sem erro nenhum no console.
2. **Config que o shader le a cada frame precisa ser mutada no lugar.** Trocar
   a referencia do array deixa o `useMemo` das options apontando pra lista
   velha. Veja `ink-bleed.tsx`.
3. **Cuidado com palavra reservada do GLSL e com crase dentro do shader.**
   `flat`, `sample`, `input` e `output` nao compilam como nome de variavel; e
   uma crase no meio do template literal encerra a string e quebra o build.

## Limite de contextos WebGL

Cada efeito ativo segura um contexto WebGL, e o browser permite algo em torno
de **16 ao mesmo tempo**. Passado o teto, `getContext` devolve `null` e os
efeitos novos somem sem erro — parece bug de codigo, e e so cota. Em telas de
produto, prefira poucos efeitos por rota.

Pelo mesmo motivo, `supportsWebGL2()` em `lib/canvas-support.ts` e memoizada:
sondar a cada render vazaria um contexto por chamada e derrubaria a propria
deteccao.

## Duas regras que o sistema depende

**1. Nada de `Math.random()` no render.** Rotacao de fita, ruido de borda
rasgada, jitter das letras recortadas — tudo vem de `lib/seed.ts`, via a prop
`seed` (aceita numero ou string). `Math.random()` geraria HTML diferente no
servidor e no cliente e derrubaria a pagina com erro de hidratacao.

```tsx
<WashiTape seed="lisboa" />   // sempre a mesma fita
<TornEdge seed={7} />
```

**2. IDs de filtro SVG vem de `filterId()`.** Hooks nao rodam em Server
Component, entao o ID e derivado dos proprios parametros do filtro: filtros
iguais compartilham ID (inofensivo), filtros diferentes nunca colidem.

## Atualizar os componentes do Canvas UI

O codigo em `components/canvasui/` e copiado do registry e nao deve ser
editado. Pra atualizar, rode o install de novo:

```bash
npx shadcn@latest add @canvas-ui/droplets-react --overwrite
```

O Biome ignora essa pasta de proposito, pra que reinstalar nao gere diff de
formatacao. `components/rect-cache.ts` e uma dependencia que os arquivos do
registry importam mas que o registry nao entrega — ela e nossa, e precisa
continuar existindo.

Vendorizamos so efeitos de **overlay de GPU** (`Droplets`, `Glass`, `Clouds`,
`Ripple`). Os que deformam pixels capturados do conteudo — `Peel`, `Cloth`,
`Canvas`, `Bend`, `RetroDither` — dependem de html-in-canvas e mostram o
conteudo intacto sem a flag, entao ficaram de fora.

## Fotos

As imagens em `public/photos/` sao placeholders gerados, so pro catalogo.
Troque por fotos de verdade — a classe utilitaria `.photo-graded` aplica o
trato dessaturado e quente que mantem qualquer foto em acordo com a paleta, e
o `<LightLeak>` soma o vazamento de luz por cima.

## Comandos

```bash
npm run dev      # desenvolvimento
npm run build    # build de producao
npm run lint     # Biome
npm run format   # Biome --write
```
