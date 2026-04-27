# Humano vs IA
Quiz interativo em português onde o jogador precisa adivinhar se um trecho de texto ou uma imagem foi criado por um **humano** ou gerado por **inteligência artificial**.
Projeto desenvolvido para a **Feira Multidisciplinar** da escola, com o objetivo de provocar reflexão sobre o avanço da IA e a dificuldade crescente de distinguir conteúdo humano de conteúdo gerado por máquina.
---
## Sobre o projeto
O quiz tem **6 perguntas no total**:
- **3 perguntas de texto** — pequenos trechos onde o jogador analisa estilo, vocabulário e tom para descobrir se quem escreveu foi um humano ou uma IA.
- **3 perguntas de imagem** — fotografias ou ilustrações onde o jogador precisa identificar pistas visuais (textura, iluminação, simetria, detalhes estranhos) para distinguir foto real de imagem gerada por IA.
A cada resposta, o jogo mostra um **feedback explicativo** apontando os indícios que delatam o autor — transformando o quiz numa pequena aula sobre como reconhecer conteúdo de IA no dia a dia.
No final, o jogador vê:
- Sua **pontuação** (de 0 a 6)
- Um **resumo** de cada pergunta com acerto/erro
- Uma **frase de reflexão** sobre o tema
---
## Tecnologias usadas
Projeto **100% estático**, sem dependências externas nem servidor:
- **HTML5**
- **CSS3** (variáveis, grid, flexbox, animações)
- **JavaScript puro** (sem frameworks)
- **Canvas API** (para o efeito de partículas no fundo)
- Fontes **Google Fonts** (Syne + DM Sans)
---
## Estrutura de arquivos
```
humano-vs-ia/
├── index.html        ← estrutura da página
├── style.css         ← visual (tema industrial/HUD)
├── script.js         ← lógica do quiz e banco de perguntas
└── imagens/          ← fotos usadas nas perguntas visuais
    ├── foto1.jpg     ← foto real (humana)
    ├── foto2.jpg     ← imagem gerada por IA
    └── foto3.jpg     ← imagem gerada por IA
```
---
## Como executar
Como é um site estático, basta **abrir o `index.html` em qualquer navegador** (Chrome, Edge, Firefox, etc.) com dois cliques. Não precisa instalar nada.
> **Dica:** se as imagens não aparecerem, verifique se a pasta `imagens/` está no mesmo nível do `index.html` e se os arquivos têm exatamente os nomes `foto1.jpg`, `foto2.jpg` e `foto3.jpg`.
---
## Visual
O quiz usa um tema **industrial / terminal / HUD** com:
- Fundo grafite com grid estilo blueprint
- Acentos em **ciano elétrico** (IA) e **âmbar** (humano)
- Cantos retos com brackets de canto estilo viewfinder
- Tipografia mono nos detalhes técnicos (`▸`, `// label`, `[ 1 / 6 ]`)
- Partículas animadas sutis no fundo
- Animações suaves de transição entre telas
---
## Como personalizar
### Trocar as perguntas
Abra o `script.js` e edite o array `questions`. Cada pergunta tem este formato:
```js
{
  id: 1,
  type: "text",                    // "text" ou "image"
  label: "Título da pergunta",
  hint: "Dica para o jogador",
  content: "...",                  // texto OU { src, caption }
  answer: "human",                 // "human" ou "ai"
  feedbackCorrect: "Mensagem de acerto",
  feedbackWrong: "Mensagem de erro",
  explanation: "Explicação que aparece após responder"
}
```
### Trocar as imagens
Substitua os arquivos dentro da pasta `imagens/` pelos seus, mantendo os mesmos nomes (`foto1.jpg`, `foto2.jpg`, `foto3.jpg`). Para usar mais imagens, basta adicionar novas perguntas no array e referenciar `imagens/foto4.jpg`, etc.
### Trocar as cores
No topo do `style.css`, dentro de `:root`, mude as variáveis:
```css
--c-cyan: #5ee2ff;   /* cor da IA */
--c-amber: #ffb547;  /* cor do humano */
--bg-0: #0b0d10;     /* cor de fundo */
```
---
## Tema da feira
> *Em um mundo onde máquinas escrevem, pintam e fotografam, **o que ainda nos define como humanos?***
A proposta é provocar a discussão: hoje a fronteira entre criação humana e máquina está cada vez mais fina — e saber identificar isso virou uma habilidade essencial.
---
## Créditos
Projeto desenvolvido para a Feira Multidisciplinar da escola.
