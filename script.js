/* ═══════════════════════════════════════════════════════════════
   HUMANO VS IA — SCRIPT.JS
   Quiz logic, animations, canvas particles
═══════════════════════════════════════════════════════════════ */

/* ── BANCO DE PERGUNTAS ──────────────────────────────────────── */
const questions = [

  /* ---- TEXTO 1: HUMANO ---- */
  {
    id: 1,
    type: "text",
    label: "Leia este trecho:",
    hint: "Preste atenção à voz e às imperfeições do texto.",
    content: `
      <span class="text-label">Trecho de texto — qual a origem?</span>
      Minha vó dizia que a gente aprende mais errando, e eu custei a acreditar. Achava frescura, sabe?
      Aí veio aquele semestre horrível na facul — reprovei em duas matérias — e tive que repensar tudo.
      A diferença não é errar ou não: é o que você faz depois. Eu ainda roemô bastante, não vou mentir.
    `,
    answer: "human",
    feedbackCorrect: "✅ Correto! Texto escrito por um HUMANO.",
    feedbackWrong: "❌ Errado! Texto escrito por um HUMANO.",
    explanation: "Marcas de oralidade ('sabe?', 'tô', 'facul'), erro proposital ('roemô') e narrativa pessoal — características difíceis de imitar por IA."
  },

  /* ---- TEXTO 2: IA ---- */
  {
    id: 2,
    type: "text",
    label: "Leia este trecho:",
    hint: "Analise a estrutura e o tom.",
    content: `
      <span class="text-label">Trecho de texto — qual a origem?</span>
      O erro é uma componente fundamental do processo de aprendizagem humana. Ao falhar, o indivíduo
      é exposto a novas perspectivas que estimulam a reorganização cognitiva. Estudos confirmam que
      experiências de falha ativam a memória de longo prazo de forma mais intensa que os sucessos.
    `,
    answer: "ai",
    feedbackCorrect: "✅ Correto! Texto gerado por IA.",
    feedbackWrong: "❌ Errado! Texto gerado por IA.",
    explanation: "Estrutura perfeita, linguagem formal e genérica ('componente fundamental', 'reorganização cognitiva') e ausência de voz pessoal são marcas clássicas de IA."
  },

  /* ---- TEXTO 3: AMBÍGUO ---- */
  {
    id: 3,
    type: "text",
    label: "Este é o mais difícil:",
    hint: "Confie no seu instinto.",
    content: `
      <span class="text-label">Trecho de texto — qual a origem?</span>
      Era tarde e chovia muito. Eu via a rua ficar vazia da varanda. Percebi que solidão não é a
      ausência de pessoas — é ocupar um espaço que ninguém mais consegue preencher. Anotei num
      guardanapo. Nunca soube se era descoberta ou clichê.
    `,
    answer: "ai",
    feedbackCorrect: "✅ Correto! Apesar da aparência humana, este texto foi gerado por IA.",
    feedbackWrong: "❌ Quase! Texto gerado por IA com instrução para imitar escrita humana.",
    explanation: "A IA usou detalhes sensoriais ('chovia', 'guardanapo'), hesitação e autoconsciência ('nunca soube se era clichê') — padrão comum quando IA tenta soar reflexiva."
  },

    /* ---- IMAGEM 1: FOTO REAL (HUMANO) ---- */
  {
    id: 4,
    type: "image",
    label: "Observe esta imagem:",
    hint: "Atenção: o que parece perfeito demais às vezes é real.",
    content: {
      src: "imagens/foto1.jpg",
      caption: "Retrato — real ou gerado por IA?"
    },
    answer: "human",
    feedbackCorrect: "✅ Correto! É uma fotografia REAL.",
    feedbackWrong: "❌ Pegadinha! É uma fotografia REAL.",
    explanation: "Olhe os fios de cabelo soltos, a textura da pele e a assimetria sutil do rosto. Fotos reais podem parecer 'limpas demais' e enganar."
  },

  /* ---- IMAGEM 2: GERADA POR IA ---- */
  {
    id: 5,
    type: "image",
    label: "Observe esta imagem:",
    hint: "Cheque olhos, dentes, orelhas e fundo.",
    content: {
      src: "imagens/foto2.jpg",
      caption: "Retrato — real ou gerado por IA?"
    },
    answer: "ai",
    feedbackCorrect: "✅ Correto! Imagem gerada por Inteligência Artificial.",
    feedbackWrong: "❌ Errado! Imagem gerada por IA.",
    explanation: "Sinais sutis: pele suave demais, simetria 'perfeita' e detalhes pequenos (orelhas, fios de cabelo, fundo) que somem se você ampliar."
  },

  /* ---- IMAGEM 3: DESAFIO FINAL (IA) ---- */
  {
    id: 6,
    type: "image",
    label: "Desafio final:",
    hint: "Mesmo especialistas erram aqui. Olhe letreiros, reflexos e perspectiva.",
    content: {
      src: "imagens/foto3.webp",
      caption: "Cena — real ou gerada por IA?"
    },
    answer: "ai",
    feedbackCorrect: "✅ Impressionante! Você pegou que é IA.",
    feedbackWrong: "❌ É IA — e enganou bastante gente.",
    explanation: "Reflexos inconsistentes, letreiros borrados sem texto legível e perspectiva levemente torta — sinais clássicos de imagem gerada."
  }
];

/* ── ESTADO DO QUIZ ──────────────────────────────────────────── */
let currentQ   = 0;
let score      = 0;
let answers    = [];   // { qIndex, userAnswer, correct }
let answered   = false;

/* ── REFERÊNCIAS DOM ─────────────────────────────────────────── */
const screens = {
  intro:  document.getElementById('screen-intro'),
  quiz:   document.getElementById('screen-quiz'),
  result: document.getElementById('screen-result')
};

const elTypeBadge    = document.getElementById('q-type-badge');
const elCounter      = document.getElementById('q-counter');
const elProgress     = document.getElementById('progress-fill');
const elCard         = document.getElementById('question-card');
const elLabel        = document.getElementById('q-label');
const elContent      = document.getElementById('content-area');
const elHint         = document.getElementById('hint-text');
const elFeedbackBox  = document.getElementById('feedback-box');
const elFeedbackIcon = document.getElementById('feedback-icon');
const elFeedVerdict  = document.getElementById('feedback-verdict');
const elFeedExplain  = document.getElementById('feedback-explain');
const elBtnNext      = document.getElementById('btn-next');
const elBtnNextLbl   = document.getElementById('btn-next-label');
const elAnsButtons   = document.querySelectorAll('.btn-answer');

/* ── NAVEGAÇÃO ENTRE TELAS ───────────────────────────────────── */
function showScreen(name) {
  Object.entries(screens).forEach(([k, el]) => {
    if (k === name) {
      el.classList.remove('exit');
      el.classList.add('active');
    } else if (el.classList.contains('active')) {
      el.classList.add('exit');
      setTimeout(() => {
        el.classList.remove('active', 'exit');
      }, 350);
    }
  });
}

/* ── RENDERIZAR PERGUNTA ─────────────────────────────────────── */
function renderQuestion(index) {
  answered = false;
  const q = questions[index];

  // Badge e contador
  elTypeBadge.textContent = q.type === 'text' ? 'TEXTO' : 'IMAGEM';
  elTypeBadge.className   = 'type-badge' + (q.type === 'image' ? ' image-type' : '');
  elCounter.textContent   = `${index + 1} / ${questions.length}`;

  // Progresso
  elProgress.style.width  = `${(index / questions.length) * 100}%`;

  // Label e dica
  elLabel.textContent  = q.label;
  elHint.textContent   = q.hint;

  // Conteúdo
  if (q.type === 'text') {
    elContent.innerHTML = `<div class="content-text">${q.content}</div>`;
  } else {
    elContent.innerHTML = `
      <img class="content-image" src="${q.content.src}" alt="Conteúdo visual do quiz" loading="lazy"/>
      <p class="image-caption">${q.content.caption}</p>
    `;
  }

  // Resetar botões
  elAnsButtons.forEach(btn => {
    btn.className = 'btn-answer ' + (btn.dataset.answer === 'human' ? 'btn-human' : 'btn-ai');
    btn.disabled  = false;
  });

  // Esconder feedback
  elFeedbackBox.classList.remove('visible');

  // Animar card
  elCard.style.animation = 'none';
  void elCard.offsetWidth;
  elCard.style.animation = 'cardIn 400ms cubic-bezier(.4,0,.2,1)';
}

/* ── PROCESSAR RESPOSTA ──────────────────────────────────────── */
function handleAnswer(userAnswer) {
  if (answered) return;
  answered = true;

  const q       = questions[currentQ];
  const correct = userAnswer === q.answer;
  if (correct) score++;

  answers.push({ qIndex: currentQ, userAnswer, correct });

  // Estilizar botões
  elAnsButtons.forEach(btn => {
    btn.disabled = true;
    const isUserBtn    = btn.dataset.answer === userAnswer;
    const isCorrectBtn = btn.dataset.answer === q.answer;

    if (isUserBtn && correct)     btn.classList.add('selected-correct');
    else if (isUserBtn && !correct) btn.classList.add('selected-wrong');
    else if (!isUserBtn && isCorrectBtn) btn.classList.add('show-correct');
    else btn.classList.add('disabled');
  });

  // Feedback
  const isLast = currentQ === questions.length - 1;
  elFeedbackIcon.textContent   = correct ? '🎯' : '💡';
  elFeedVerdict.textContent    = correct ? q.feedbackCorrect : q.feedbackWrong;
  elFeedVerdict.className      = 'feedback-verdict ' + (correct ? 'correct' : 'wrong');
  elFeedExplain.textContent    = q.explanation;
  elBtnNextLbl.textContent     = isLast ? 'Ver Resultado' : 'Próxima Pergunta';

  elFeedbackBox.classList.add('visible');

  // Scroll suave para o feedback
  setTimeout(() => {
    elFeedbackBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 100);
}

/* ── PRÓXIMA PERGUNTA / RESULTADO ────────────────────────────── */
function nextQuestion() {
  currentQ++;
  if (currentQ >= questions.length) {
    showResult();
  } else {
    renderQuestion(currentQ);
  }
}

/* ── MOSTRAR RESULTADO ───────────────────────────────────────── */
function showResult() {
  // Progresso cheio
  elProgress.style.width = '100%';

  showScreen('result');

  // Score ring SVG gradient
  injectRingGradient();

  // Animar o anel
  setTimeout(() => {
    const pct = score / questions.length;
    const circumference = 2 * Math.PI * 50; // r=50
    const offset = circumference * (1 - pct);
    const ring = document.getElementById('ring-progress');
    ring.style.strokeDashoffset = offset;
  }, 400);

  // Texto do anel
  document.getElementById('ring-score').textContent = `${score}/${questions.length}`;

  // Título e mensagem
  const titleEl = document.getElementById('result-title');
  const msgEl   = document.getElementById('result-msg');

  if (score <= 2) {
    titleEl.textContent = 'Desafio e tanto, não é?';
    msgEl.textContent   = 'Em um mundo com excesso de informação, distinguir o que é real está cada vez mais difícil. Não se preocupe — mesmo especialistas se enganam.';
  } else if (score <= 4) {
    titleEl.textContent = 'Bom desempenho!';
    msgEl.textContent   = 'Você tem senso crítico, mas percebeu como é fácil ser enganado? A IA evolui rapidamente. Hoje você acertou alguns — e se fosse amanhã?';
  } else {
    titleEl.textContent = 'Excelente senso crítico!';
    msgEl.textContent   = 'Você tem um olhar afiado para detectar conteúdo gerado por IA. Mas atenção: a IA está ficando cada vez mais convincente. Continue desconfiando.';
  }

  // Breakdown
  const breakdown = document.getElementById('result-breakdown');
  breakdown.innerHTML = '';
  answers.forEach(a => {
    const q   = questions[a.qIndex];
    const row = document.createElement('div');
    row.className = 'breakdown-row';
    const shortContent = q.type === 'text'
      ? q.content.replace(/<[^>]+>/g, '').trim().slice(0, 60) + '...'
      : q.content.caption;
    row.innerHTML = `
      <span class="br-label">${q.type === 'text' ? '📝' : '🖼️'} Pergunta ${a.qIndex + 1}</span>
      <span class="br-content">${shortContent}</span>
      <span class="br-result ${a.correct ? 'correct' : 'wrong'}">${a.correct ? '✓ Acerto' : '✗ Erro'}</span>
    `;
    breakdown.appendChild(row);
  });
}

/* ── GRADIENT SVG PARA O ANEL ────────────────────────────────── */
function injectRingGradient() {
  const svg = document.querySelector('.ring-svg');
  if (!svg.querySelector('defs')) {
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `
      <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stop-color="#4f8ef7"/>
        <stop offset="50%"  stop-color="#a78bfa"/>
        <stop offset="100%" stop-color="#f472b6"/>
      </linearGradient>
    `;
    svg.prepend(defs);
  }
}

/* ── REINICIAR QUIZ ──────────────────────────────────────────── */
function restartQuiz() {
  currentQ = 0;
  score    = 0;
  answers  = [];
  answered = false;
  renderQuestion(0);
  showScreen('quiz');
}

/* ── EVENT LISTENERS ─────────────────────────────────────────── */
document.getElementById('btn-start').addEventListener('click', () => {
  renderQuestion(0);
  showScreen('quiz');
});

elAnsButtons.forEach(btn => {
  btn.addEventListener('click', () => handleAnswer(btn.dataset.answer));
});

elBtnNext.addEventListener('click', nextQuestion);

document.getElementById('btn-restart').addEventListener('click', restartQuiz);

/* ══════════════════════════════════════════════════════════════
   CANVAS — PARTÍCULAS DE FUNDO
══════════════════════════════════════════════════════════════ */
(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles;

  const PARTICLE_COUNT = 60;
  const COLORS = ['rgba(79,142,247,', 'rgba(167,139,250,', 'rgba(244,114,182,'];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x  = Math.random() * W;
      this.y  = init ? Math.random() * H : H + 10;
      this.r  = Math.random() * 1.8 + 0.4;
      this.vx = (Math.random() - 0.5) * 0.25;
      this.vy = -(Math.random() * 0.4 + 0.15);
      this.alpha = Math.random() * 0.5 + 0.1;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.y < -10) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.fill();
    }
  }

  function init() {
    resize();
    particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => { resize(); });
  init();
  loop();
})();

/* ══════════════════════════════════════════════════════════════
   FOCO INICIAL
══════════════════════════════════════════════════════════════ */
document.getElementById('btn-start').focus();
    const ring = document.getElementById('ring-progress');
    ring.style.strokeDashoffset = offset;
   400;

  document.getElementById('ring-score').textContent = `${score}/${questions.length}`;

  const titleEl = document.getElementById('result-title');
  const msgEl   = document.getElementById('result-msg');

  if (score <= 2) {
    titleEl.textContent = 'Desafio e tanto, não é?';
    msgEl.textContent   = 'Em um mundo com excesso de informação, distinguir o que é real está cada vez mais difícil. Não se preocupe — mesmo especialistas se enganam.';
  } else if (score <= 4) {
    titleEl.textContent = 'Bom desempenho!';
    msgEl.textContent   = 'Você tem senso crítico, mas percebeu como é fácil ser enganado? A IA evolui rapidamente. Hoje você acertou alguns — e se fosse amanhã?';
  } else {
    titleEl.textContent = 'Excelente senso crítico!';
    msgEl.textContent   = 'Você tem um olhar afiado para detectar conteúdo gerado por IA. Mas atenção: a IA está ficando cada vez mais convincente. Continue desconfiando.';
  }

  const breakdown = document.getElementById('result-breakdown');
  breakdown.innerHTML = '';
  answers.forEach(a => {
    const q   = questions[a.qIndex];
    const row = document.createElement('div');
    row.className = 'breakdown-row';
    const shortContent = q.type === 'text'
      ? q.content.replace(/<[^>]+>/g, '').trim().slice(0, 60) + '...'
      : q.content.caption;
    row.innerHTML = `
      <span class="br-label">${q.type === 'text' ? '📝' : '🖼️'} Pergunta ${a.qIndex + 1}</span>
      <span class="br-content">${shortContent}</span>
      <span class="br-result ${a.correct ? 'correct' : 'wrong'}">${a.correct ? '✓ Acerto' : '✗ Erro'}</span>
    `;
    breakdown.appendChild(row);
  });


function injectRingGradient() {
  const svg = document.querySelector('.ring-svg');
  if (!svg.querySelector('defs')) {
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `
      <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stop-color="#4f8ef7"/>
        <stop offset="50%"  stop-color="#a78bfa"/>
        <stop offset="100%" stop-color="#f472b6"/>
      </linearGradient>
    `;
    svg.prepend(defs);
  }
}

function restartQuiz() {
  currentQ = 0;
  score    = 0;
  answers  = [];
  answered = false;
  renderQuestion(0);
  showScreen('quiz');
}

document.getElementById('btn-start').addEventListener('click', () => {
  renderQuestion(0);
  showScreen('quiz');
});

elAnsButtons.forEach(btn => {
  btn.addEventListener('click', () => handleAnswer(btn.dataset.answer));
});

elBtnNext.addEventListener('click', nextQuestion);

document.getElementById('btn-restart').addEventListener('click', restartQuiz);

(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles;

  const PARTICLE_COUNT = 60;
  const COLORS = ['rgba(79,142,247,', 'rgba(167,139,250,', 'rgba(244,114,182,'];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x  = Math.random() * W;
      this.y  = init ? Math.random() * H : H + 10;
      this.r  = Math.random() * 1.8 + 0.4;
      this.vx = (Math.random() - 0.5) * 0.25;
      this.vy = -(Math.random() * 0.4 + 0.15);
      this.alpha = Math.random() * 0.5 + 0.1;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.y < -10) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.fill();
    }
  }

  function init() {
    resize();
    particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => { resize(); });
  init();
  loop();
})();

document.getElementById('btn-start').focus();