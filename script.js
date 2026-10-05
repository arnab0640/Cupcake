/* ==========================================================================
   MRS. CUPCAKE (MRITTICA NASKAR) - JAVASCRIPT ENGINE
   Crafted with love by Arnab
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  unlockAudioOnFirstTouch();
  initMobileNavigation();
  initAmbientCanvas();
  initAudioSystem();
  initHeroInteractions();
  initMemorySlider();
  init24ReasonsSlider();
  initArcadeHub();
  initHandiGame();
  initMemoryMatchGame();
  initCakeStudio();
  initSoundboardAndWishes();
  initQuizSystem();
  initCupcakeArcadeGame();
  initFortuneBakery();
  initEnvelopeLetter();
});

/* ==========================================================================
   1. AMBIENT BACKGROUND PARTICLES CANVAS
   ========================================================================== */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  // Optimize particle count for mobile screens (iOS & Android battery/fps)
  const particleCount = window.innerWidth < 768 ? 22 : 45;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.5 + 0.8,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: -Math.random() * 0.6 - 0.2,
      opacity: Math.random() * 0.7 + 0.2,
      color: ['#ff85a1', '#f6c90e', '#ffffff', '#ffccd5'][Math.floor(Math.random() * 4)]
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    for (let p of particles) {
      p.x += p.speedX;
      p.y += p.speedY;

      if (p.y < -10) {
        p.y = height + 10;
        p.x = Math.random() * width;
      }
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.shadowBlur = 8;
      ctx.shadowColor = p.color;
      ctx.fill();
    }
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;

    requestAnimationFrame(render);
  }
  render();
}

/* ==========================================================================
   2. AUDIO SYSTEM & YOUTUBE PLAYER (FAKIRA BY SANAM PURI)
   ========================================================================== */
let ytPlayer = null;
let isAudioPlaying = false;
let isMuted = false;
let audioContext = null;

// Simple Web Audio API Synthesizer for SFX (no audio file dependencies)
function playSoundFX(type = 'chime') {
  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.connect(gain);
    gain.connect(audioContext.destination);

    const now = audioContext.currentTime;

    if (type === 'chime') {
      // Pleasant sparkle chime
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.2); // C6
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'success') {
      // Cheerful fanfare chord
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(554.37, now + 0.1);
      osc.frequency.setValueAtTime(659.25, now + 0.2);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
    } else if (type === 'pop') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.08);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'wrong') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.linearRampToValueAtTime(110, now + 0.25);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    }
  } catch (e) {
    console.warn('Audio FX error:', e);
  }
}

// Global hook called by YouTube IFrame API script
window.onYouTubeIframeAPIReady = function() {
  ytPlayer = new YT.Player('youtube-audio-player', {
    height: '10',
    width: '10',
    videoId: 'LPpztd3Z19w', // Fakira - Sanam Puri & Neeti Mohan (User Requested Video)
    playerVars: {
      autoplay: 0,
      controls: 0,
      loop: 1,
      playlist: 'LPpztd3Z19w',
      playsinline: 1,
      modestbranding: 1
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange
    }
  });
};

function onPlayerReady(event) {
  event.target.setVolume(80);
  const statusEl = document.getElementById('track-status-text');
  if (statusEl) statusEl.textContent = 'Fakira ready to play';
}

function onPlayerStateChange(event) {
  const widget = document.getElementById('music-player-widget');
  const playIcon = document.getElementById('play-icon');
  const pauseIcon = document.getElementById('pause-icon');
  const statusEl = document.getElementById('track-status-text');

  if (event.data === YT.PlayerState.PLAYING) {
    isAudioPlaying = true;
    if (widget) widget.classList.add('playing');
    if (playIcon) playIcon.classList.add('hidden');
    if (pauseIcon) pauseIcon.classList.remove('hidden');
    if (statusEl) statusEl.textContent = 'Playing: Fakira 🎵';
  } else {
    isAudioPlaying = false;
    if (widget) widget.classList.remove('playing');
    if (playIcon) playIcon.classList.remove('hidden');
    if (pauseIcon) pauseIcon.classList.add('hidden');
    if (statusEl) statusEl.textContent = 'Paused';
  }
}

function initAudioSystem() {
  const welcomeModal = document.getElementById('welcome-modal');
  const enterBtn = document.getElementById('enter-btn');
  const musicToggleBtn = document.getElementById('music-toggle-btn');
  const lyricsToggleBtn = document.getElementById('lyrics-toggle-btn');
  const lyricsPopup = document.getElementById('lyrics-popup');
  const closeLyricsBtn = document.getElementById('close-lyrics-btn');
  const muteBtn = document.getElementById('mute-toggle-btn');
  const volumeSlider = document.getElementById('volume-slider');
  const volHighIcon = document.getElementById('volume-high-icon');
  const volMuteIcon = document.getElementById('volume-mute-icon');

  // Enter Experience & Start Song
  if (enterBtn) {
    enterBtn.addEventListener('click', () => {
      welcomeModal.classList.add('hidden');
      playSoundFX('success');

      // Trigger celebratory confetti
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#ff85a1', '#f6c90e', '#ffffff', '#ff7eb3']
        });
      }

      // Play YouTube track
      if (ytPlayer && typeof ytPlayer.playVideo === 'function') {
        ytPlayer.playVideo();
      } else {
        // Fallback simulated playing state if player API still loading
        const widget = document.getElementById('music-player-widget');
        if (widget) widget.classList.add('playing');
      }
    });
  }

  // Play / Pause Toggle
  if (musicToggleBtn) {
    musicToggleBtn.addEventListener('click', () => {
      if (!ytPlayer || typeof ytPlayer.getPlayerState !== 'function') return;

      const state = ytPlayer.getPlayerState();
      if (state === YT.PlayerState.PLAYING) {
        ytPlayer.pauseVideo();
      } else {
        ytPlayer.playVideo();
      }
    });
  }

  // Lyrics Card Toggle
  if (lyricsToggleBtn && lyricsPopup) {
    lyricsToggleBtn.addEventListener('click', () => {
      lyricsPopup.classList.toggle('hidden');
      playSoundFX('pop');
    });
  }
  if (closeLyricsBtn && lyricsPopup) {
    closeLyricsBtn.addEventListener('click', () => {
      lyricsPopup.classList.add('hidden');
    });
  }

  // Volume Slider
  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      if (ytPlayer && typeof ytPlayer.setVolume === 'function') {
        ytPlayer.setVolume(val);
        if (val === 0) {
          volHighIcon.classList.add('hidden');
          volMuteIcon.classList.remove('hidden');
        } else {
          volHighIcon.classList.remove('hidden');
          volMuteIcon.classList.add('hidden');
        }
      }
    });
  }

  // Mute Toggle
  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      if (!ytPlayer) return;
      isMuted = !isMuted;
      if (isMuted) {
        if (typeof ytPlayer.mute === 'function') ytPlayer.mute();
        volHighIcon.classList.add('hidden');
        volMuteIcon.classList.remove('hidden');
      } else {
        if (typeof ytPlayer.unMute === 'function') ytPlayer.unMute();
        volHighIcon.classList.remove('hidden');
        volMuteIcon.classList.add('hidden');
      }
    });
  }
}

/* ==========================================================================
   3. HERO & INTERACTIVE LOVE COUNTER
   ========================================================================== */
function initHeroInteractions() {
  const tapCupcakeBtn = document.getElementById('tap-cupcake-btn');
  const cupcakeCounter = document.getElementById('cupcake-counter');
  const navHeartBtn = document.getElementById('appreciation-heart-btn');
  const navLoveCount = document.getElementById('nav-love-count');
  const showerCupcakesBtn = document.getElementById('cupcake-shower-btn');

  let loveCount = 2002; // Initialized to Didi's birth year!

  function triggerLove(event) {
    loveCount += 1;
    if (cupcakeCounter) cupcakeCounter.textContent = loveCount;
    if (navLoveCount) navLoveCount.textContent = loveCount;

    playSoundFX('pop');

    // Spawn floating element
    const heart = document.createElement('div');
    heart.className = 'floating-sparkle-heart';
    const emojis = ['🧁', '💖', '✨', '🍓', '👑'];
    heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];

    const rect = (event && event.currentTarget) ? event.currentTarget.getBoundingClientRect() : { left: window.innerWidth / 2, top: window.innerHeight / 2 };
    heart.style.left = `${rect.left + (Math.random() * 40 - 20) + 30}px`;
    heart.style.top = `${rect.top - 10}px`;

    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1200);
  }

  if (tapCupcakeBtn) tapCupcakeBtn.addEventListener('click', triggerLove);
  if (navHeartBtn) navHeartBtn.addEventListener('click', triggerLove);

  if (showerCupcakesBtn) {
    showerCupcakesBtn.addEventListener('click', () => {
      playSoundFX('chime');
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.5 },
          colors: ['#ff758c', '#ff7eb3', '#f6c90e', '#ffffff']
        });
      }
    });
  }
}

/* ==========================================================================
   4. LIGHTBOX MODAL (PHOTO ENLARGEMENT)
   ========================================================================== */
window.openLightbox = function(src, caption) {
  const modal = document.getElementById('lightbox-modal');
  const img = document.getElementById('lightbox-img');
  const cap = document.getElementById('lightbox-caption');

  if (modal && img && cap) {
    img.src = src;
    cap.textContent = caption || 'Cherished Memory with Mrs. Cupcake';
    modal.classList.remove('hidden');
    playSoundFX('pop');
  }
};

window.closeLightbox = function(event) {
  const modal = document.getElementById('lightbox-modal');
  if (!modal) return;
  // If clicked directly on overlay or close button
  if (!event || event.target.id === 'lightbox-modal' || event.target.classList.contains('lightbox-close')) {
    modal.classList.add('hidden');
  }
};

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const modal = document.getElementById('lightbox-modal');
    if (modal) modal.classList.add('hidden');
  }
});

/* ==========================================================================
   5. INTERACTIVE MRS. CUPCAKE QUIZ GAME
   ========================================================================== */
function initQuizSystem() {
  const questions = [
    {
      emoji: '🧁',
      question: "What is Didi's official sweet nickname given exclusively by her brother Arnab?",
      options: [
        { text: "Queen Bee 🐝", correct: false },
        { text: "Mrs. Cupcake 🧁✨", correct: true },
        { text: "Boss Lady 💼", correct: false },
        { text: "Sweet Tooth 🍫", correct: false }
      ],
      feedbackCorrect: "Bingo! She will forever be Arnab's one and only 'Mrs. Cupcake'! 🧁",
      feedbackWrong: "Nice try! But her exclusive royal nickname is Mrs. Cupcake!"
    },
    {
      emoji: '🎂',
      question: "In which year did the world receive the sweetest gift (Mrs. Cupcake's birth year, turning 24)?",
      options: [
        { text: "Year 2000", correct: false },
        { text: "Year 2001", correct: false },
        { text: "Year 2002 (24 & fabulous!) 🌟", correct: true },
        { text: "Year 2004", correct: false }
      ],
      feedbackCorrect: "Spot on! Born in 2002, bringing 24 whole years of sunshine! 🌟",
      feedbackWrong: "Oops! Mrittica Didi was born in 2002 and is celebrating 24!"
    },
    {
      emoji: '🎭',
      question: "When Didi and Arnab have a funny sibling argument, what is the guaranteed outcome?",
      options: [
        { text: "Didi delivers an Oscar-worthy speech, then they laugh 5 mins later! 😂", correct: true },
        { text: "Arnab surrenders all his snacks peacefully", correct: false },
        { text: "Total silence for a month", correct: false },
        { text: "A debate judged by the Supreme Court", correct: false }
      ],
      feedbackCorrect: "Haha absolutely! Sibling drama lasts 5 minutes, then it's back to giggles & snacks!",
      feedbackWrong: "Close! But in this house, dramatic scoldings quickly turn into shared laughter!"
    },
    {
      emoji: '🥻',
      question: "Which festive look makes Mrittica Didi look like an absolute royal goddess?",
      options: [
        { text: "A classic graphic t-shirt and cool sneakers", correct: false },
        { text: "The vibrant yellow Durga Puja saree with festive abir & smile! 🌼", correct: true },
        { text: "Winter jacket with hood up", correct: false },
        { text: "Chef apron in the bakery", correct: false }
      ],
      feedbackCorrect: "100%! Her yellow saree Puja look is unmatched festive royalty! 🌼✨",
      feedbackWrong: "All looks are great, but her traditional Durga Puja yellow saree is iconic!"
    },
    {
      emoji: '💖',
      question: "What is the unbreakable golden rule of the Arnab & Mrittica sibling bond?",
      options: [
        { text: "Tease each other constantly, but always have each other's back forever!", correct: false },
        { text: "Take goofy photos wherever we travel", correct: false },
        { text: "Cherish the sweet cupcake moments of life", correct: false },
        { text: "All of the above, now and for eternity! ❤️", correct: true }
      ],
      feedbackCorrect: "Pure perfection! An eternal bond filled with laughter, loyalty, and love! 🏆",
      feedbackWrong: "Actually, it's ALL of the above! Their bond is infinite!"
    }
  ];

  let currentIdx = 0;
  let score = 0;

  const currentQNum = document.getElementById('current-q-num');
  const totalQNum = document.getElementById('total-q-num');
  const scoreDisplay = document.getElementById('quiz-score-display');
  const progressBar = document.getElementById('quiz-progress-bar');
  const qEmoji = document.getElementById('question-emoji');
  const qText = document.getElementById('question-text');
  const optionsGrid = document.getElementById('options-grid');
  const feedbackBox = document.getElementById('quiz-feedback');
  const feedbackText = document.getElementById('feedback-text');
  const nextBtn = document.getElementById('next-question-btn');
  const questionContainer = document.getElementById('quiz-question-container');
  const resultsContainer = document.getElementById('quiz-results-container');
  const finalScoreVal = document.getElementById('final-score-val');
  const restartBtn = document.getElementById('restart-quiz-btn');

  if (totalQNum) totalQNum.textContent = questions.length;

  function loadQuestion() {
    feedbackBox.classList.add('hidden');
    const q = questions[currentIdx];

    currentQNum.textContent = currentIdx + 1;
    qEmoji.textContent = q.emoji;
    qText.textContent = q.question;
    progressBar.style.width = `${((currentIdx + 1) / questions.length) * 100}%`;

    optionsGrid.innerHTML = '';

    const letters = ['A', 'B', 'C', 'D'];
    q.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.innerHTML = `
        <span class="option-letter">${letters[idx]}</span>
        <span class="option-text">${opt.text}</span>
      `;

      btn.addEventListener('click', () => handleOptionClick(btn, opt, q));
      optionsGrid.appendChild(btn);
    });
  }

  function handleOptionClick(selectedBtn, opt, q) {
    // Disable all options
    const allBtns = optionsGrid.querySelectorAll('.option-btn');
    allBtns.forEach(b => b.disabled = true);

    if (opt.correct) {
      selectedBtn.classList.add('correct');
      score += 10;
      scoreDisplay.textContent = score;
      feedbackText.textContent = q.feedbackCorrect;
      playSoundFX('chime');
    } else {
      selectedBtn.classList.add('wrong');
      feedbackText.textContent = q.feedbackWrong;
      playSoundFX('wrong');

      // Highlight the correct option
      allBtns.forEach((b, i) => {
        if (q.options[i].correct) b.classList.add('correct');
      });
    }

    feedbackBox.classList.remove('hidden');

    if (currentIdx === questions.length - 1) {
      nextBtn.textContent = 'See Final Results 🏆';
    } else {
      nextBtn.textContent = 'Next Question →';
    }
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentIdx < questions.length - 1) {
        currentIdx++;
        loadQuestion();
      } else {
        showResults();
      }
    });
  }

  function showResults() {
    questionContainer.classList.add('hidden');
    feedbackBox.classList.add('hidden');
    resultsContainer.classList.remove('hidden');
    finalScoreVal.textContent = score;

    playSoundFX('success');

    if (typeof confetti === 'function') {
      confetti({
        particleCount: 160,
        spread: 90,
        origin: { y: 0.6 }
      });
    }
  }

  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      currentIdx = 0;
      score = 0;
      scoreDisplay.textContent = '0';
      resultsContainer.classList.add('hidden');
      questionContainer.classList.remove('hidden');
      loadQuestion();
    });
  }

  loadQuestion();
}

/* ==========================================================================
   6. CUPCAKE RUSH MINI-GAME (CANVAS ARCADE)
   ========================================================================== */
function initCupcakeArcadeGame() {
  const canvas = document.getElementById('cupcake-game-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const startOverlay = document.getElementById('game-start-overlay');
  const overOverlay = document.getElementById('game-over-overlay');
  const startBtn = document.getElementById('start-game-btn');
  const playAgainBtn = document.getElementById('play-again-game-btn');
  const scoreDisplay = document.getElementById('game-score');
  const timerDisplay = document.getElementById('game-timer');
  const highscoreDisplay = document.getElementById('game-highscore');
  const finalScoreEl = document.getElementById('final-game-score');

  let animationId = null;
  let timerInterval = null;
  let gameRunning = false;
  let score = 0;
  let timeLeft = 30;
  let highScore = parseInt(localStorage.getItem('mrs_cupcake_highscore') || '0', 10);

  if (highscoreDisplay) highscoreDisplay.textContent = highScore;

  // Basket / Player
  const basket = {
    x: canvas.width / 2 - 40,
    y: canvas.height - 45,
    width: 80,
    height: 30,
    speed: 7,
    dx: 0
  };

  let items = [];
  const itemTypes = [
    { type: 'cupcake', emoji: '🧁', points: 10 },
    { type: 'heart', emoji: '💖', points: 15 },
    { type: 'strawberry', emoji: '🍓', points: 10 },
    { type: 'star', emoji: '⭐', points: 20 },
    { type: 'cloud', emoji: '🌧️', points: -5 }
  ];

  let spawnTimer = 0;

  // Key controls
  const keys = {};
  window.addEventListener('keydown', (e) => {
    if (['ArrowLeft', 'ArrowRight', 'a', 'd'].includes(e.key)) {
      keys[e.key] = true;
    }
  });
  window.addEventListener('keyup', (e) => {
    if (['ArrowLeft', 'ArrowRight', 'a', 'd'].includes(e.key)) {
      keys[e.key] = false;
    }
  });

  // Mouse / Touch controls on canvas
  function handlePointerMove(clientX) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const canvasX = (clientX - rect.left) * scaleX;
    basket.x = Math.max(0, Math.min(canvas.width - basket.width, canvasX - basket.width / 2));
  }

  canvas.addEventListener('mousemove', (e) => {
    if (gameRunning) handlePointerMove(e.clientX);
  });
  
  canvas.addEventListener('touchstart', (e) => {
    if (gameRunning && e.touches.length > 0) {
      handlePointerMove(e.touches[0].clientX);
      e.preventDefault();
    }
  }, { passive: false });

  canvas.addEventListener('touchmove', (e) => {
    if (gameRunning && e.touches.length > 0) {
      handlePointerMove(e.touches[0].clientX);
      e.preventDefault();
    }
  }, { passive: false });

  // Mobile On-Screen Arrow Controls
  const touchBtnLeft = document.getElementById('touch-btn-left');
  const touchBtnRight = document.getElementById('touch-btn-right');

  function bindContinuousTouch(btn, keyName) {
    if (!btn) return;
    const press = (e) => {
      e.preventDefault();
      keys[keyName] = true;
      if (typeof navigator.vibrate === 'function') {
        try { navigator.vibrate(15); } catch (err) {}
      }
    };
    const release = (e) => {
      e.preventDefault();
      keys[keyName] = false;
    };
    btn.addEventListener('touchstart', press, { passive: false });
    btn.addEventListener('touchend', release, { passive: false });
    btn.addEventListener('touchcancel', release, { passive: false });
    btn.addEventListener('mousedown', press);
    btn.addEventListener('mouseup', release);
    btn.addEventListener('mouseleave', release);
  }

  bindContinuousTouch(touchBtnLeft, 'ArrowLeft');
  bindContinuousTouch(touchBtnRight, 'ArrowRight');

  function spawnItem() {
    const chosen = itemTypes[Math.floor(Math.random() * itemTypes.length)];
    items.push({
      x: Math.random() * (canvas.width - 35) + 10,
      y: -25,
      size: 26,
      speed: Math.random() * 2 + 2.5,
      ...chosen
    });
  }

  function startGame() {
    score = 0;
    timeLeft = 30;
    items = [];
    basket.x = canvas.width / 2 - basket.width / 2;
    gameRunning = true;

    scoreDisplay.textContent = '0';
    timerDisplay.textContent = '30s';
    startOverlay.classList.add('hidden');
    overOverlay.classList.add('hidden');

    playSoundFX('chime');

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      timeLeft--;
      timerDisplay.textContent = `${timeLeft}s`;
      if (timeLeft <= 0) {
        endGame();
      }
    }, 1000);

    lastTime = performance.now();
    gameLoop();
  }

  function endGame() {
    gameRunning = false;
    clearInterval(timerInterval);
    cancelAnimationFrame(animationId);

    if (score > highScore) {
      highScore = score;
      localStorage.setItem('mrs_cupcake_highscore', highScore);
      if (highscoreDisplay) highscoreDisplay.textContent = highScore;
    }

    if (finalScoreEl) finalScoreEl.textContent = score;
    overOverlay.classList.remove('hidden');
    playSoundFX('success');

    if (typeof confetti === 'function') {
      confetti({ particleCount: 80, spread: 60 });
    }
  }

  let lastTime = 0;
  function gameLoop(time) {
    if (!gameRunning) return;

    // Keyboard move
    if (keys['ArrowLeft'] || keys['a']) {
      basket.x = Math.max(0, basket.x - basket.speed);
    }
    if (keys['ArrowRight'] || keys['d']) {
      basket.x = Math.min(canvas.width - basket.width, basket.x + basket.speed);
    }

    // Spawn logic
    spawnTimer++;
    if (spawnTimer % 35 === 0) {
      spawnItem();
    }

    // Clear
    ctx.fillStyle = '#160822';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw falling items
    ctx.font = '24px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = items.length - 1; i >= 0; i--) {
      const item = items[i];
      item.y += item.speed;

      ctx.fillText(item.emoji, item.x, item.y);

      // Check collision with basket
      if (
        item.y + 10 >= basket.y &&
        item.y - 10 <= basket.y + basket.height &&
        item.x >= basket.x - 5 &&
        item.x <= basket.x + basket.width + 5
      ) {
        score = Math.max(0, score + item.points);
        scoreDisplay.textContent = score;
        if (item.points > 0) {
          playSoundFX('pop');
        } else {
          playSoundFX('wrong');
        }
        items.splice(i, 1);
        continue;
      }

      // Remove out of bounds
      if (item.y > canvas.height + 30) {
        items.splice(i, 1);
      }
    }

    // Draw Basket (styled like a cute cupcake bowl)
    ctx.save();
    ctx.shadowColor = '#ff758c';
    ctx.shadowBlur = 12;

    // Basket body
    const grad = ctx.createLinearGradient(basket.x, basket.y, basket.x + basket.width, basket.y + basket.height);
    grad.addColorStop(0, '#ff758c');
    grad.addColorStop(1, '#f6c90e');
    ctx.fillStyle = grad;

    ctx.beginPath();
    ctx.roundRect(basket.x, basket.y, basket.width, basket.height, [6, 6, 14, 14]);
    ctx.fill();

    // Basket rim & label
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('🧁 Didi', basket.x + basket.width / 2, basket.y + basket.height / 2);
    ctx.restore();

    animationId = requestAnimationFrame(gameLoop);
  }

  if (startBtn) startBtn.addEventListener('click', startGame);
  if (playAgainBtn) playAgainBtn.addEventListener('click', startGame);
}

/* ==========================================================================
   7. FORTUNE BAKERY (SWEET COMPLIMENTS GENERATOR)
   ========================================================================== */
function initFortuneBakery() {
  const trigger = document.getElementById('fortune-cupcake-trigger');
  const newBtn = document.getElementById('new-fortune-btn');
  const display = document.getElementById('fortune-display');

  const fortunes = [
    "✨ Mrs. Cupcake's smile has the rare superpower to instantly brighten any room!",
    "👑 Bengali Royalty Award: Nobody carries a yellow festive saree with more grace than Didi!",
    "🧁 Didi Sweetness Meter: 1000% pure gold, with just the right sprinkle of fun drama!",
    "✈️ Best Travel & Food Partner: Hill-station strolls are 100x happier with Didi by your side!",
    "🌟 'There is a future version, don't look back.' Didi, you are destined for boundless brilliance!",
    "🛡️ Protective Shield: Having an elder sister like Mrittica means you always have a guardian angel.",
    "🍫 Secret Sibling Law: Arnab may pretend he is innocent, but Didi will always be the smarter one!"
  ];

  let lastIdx = -1;

  function revealFortune() {
    let rand;
    do {
      rand = Math.floor(Math.random() * fortunes.length);
    } while (rand === lastIdx && fortunes.length > 1);
    lastIdx = rand;

    playSoundFX('chime');

    if (display) {
      display.innerHTML = `<p class="fortune-text-active">${fortunes[rand]}</p>`;
    }

    if (trigger) {
      trigger.style.transform = 'scale(0.92) rotate(-8deg)';
      setTimeout(() => {
        trigger.style.transform = 'scale(1) rotate(0deg)';
      }, 250);
    }
  }

  if (trigger) trigger.addEventListener('click', revealFortune);
  if (newBtn) newBtn.addEventListener('click', revealFortune);
}

/* ==========================================================================
   8. BROTHER'S HEARTFELT ENVELOPE & LETTER
   ========================================================================== */
function initEnvelopeLetter() {
  const envelopeBox = document.getElementById('envelope-box');
  const waxSeal = document.getElementById('wax-seal');
  const envelopeFlap = document.getElementById('envelope-flap');
  const letterContent = document.getElementById('letter-content');
  const recloseBtn = document.getElementById('reclose-letter-btn');

  function openLetter() {
    playSoundFX('chime');

    if (typeof confetti === 'function') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#ff85a1', '#f6c90e', '#ffffff']
      });
    }

    if (envelopeFlap) envelopeFlap.style.transform = 'rotateX(180deg)';
    if (waxSeal) waxSeal.style.transform = 'scale(0) rotate(45deg)';

    setTimeout(() => {
      if (envelopeBox) envelopeBox.style.display = 'none';
      if (letterContent) letterContent.classList.remove('hidden');
    }, 450);
  }

  function closeLetter() {
    playSoundFX('pop');
    if (letterContent) letterContent.classList.add('hidden');
    if (envelopeBox) envelopeBox.style.display = 'flex';
    if (envelopeFlap) envelopeFlap.style.transform = 'rotateX(0deg)';
    if (waxSeal) waxSeal.style.transform = 'scale(1) rotate(0deg)';
  }

  if (envelopeBox) envelopeBox.addEventListener('click', openLetter);
  if (waxSeal) waxSeal.addEventListener('click', (e) => {
    e.stopPropagation();
    openLetter();
  });
  if (recloseBtn) recloseBtn.addEventListener('click', closeLetter);
}

/* ==========================================================================
   9. MOBILE NAVIGATION SYSTEM (IOS & ANDROID)
   ========================================================================== */
function initMobileNavigation() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const drawer = document.getElementById('mobile-nav-drawer');
  const backdrop = document.getElementById('mobile-nav-backdrop');
  const closeBtn = document.getElementById('close-mobile-menu-btn');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (!menuBtn || !drawer || !backdrop) return;

  function openDrawer() {
    drawer.classList.add('open');
    backdrop.classList.add('open');
    menuBtn.classList.add('active');
    menuBtn.setAttribute('aria-expanded', 'true');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    playSoundFX('pop');
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    menuBtn.classList.remove('active');
    menuBtn.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  menuBtn.addEventListener('click', () => {
    if (drawer.classList.contains('open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeDrawer);
  }

  backdrop.addEventListener('click', closeDrawer);

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });
}

/* ==========================================================================
   10. USER GESTURE AUDIO UNLOCK (IOS SAFARI & ANDROID CHROME)
   ========================================================================== */
function unlockAudioOnFirstTouch() {
  const unlock = () => {
    try {
      if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume();
      }
      // Play a short silent buffer to unlock the audio pipeline on iOS
      const buffer = audioContext.createBuffer(1, 1, 22050);
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      source.start(0);
    } catch (e) {
      // Audio unlock silent error ignore
    }
    window.removeEventListener('touchstart', unlock, true);
    window.removeEventListener('touchend', unlock, true);
    window.removeEventListener('click', unlock, true);
  };

  window.addEventListener('touchstart', unlock, true);
  window.addEventListener('touchend', unlock, true);
  window.addEventListener('click', unlock, true);
}

/* ==========================================================================
   11. CINEMATIC MEMORY PHOTO SLIDER
   ========================================================================== */
function initMemorySlider() {
  const track = document.getElementById('memory-slider-track');
  const slides = document.querySelectorAll('.slider-slide');
  const prevBtn = document.getElementById('slider-prev-btn');
  const nextBtn = document.getElementById('slider-next-btn');
  const dots = document.querySelectorAll('.slider-dot');
  const counter = document.getElementById('slider-counter');
  const playBtn = document.getElementById('slider-play-btn');
  const wrapper = document.getElementById('memory-slider-wrapper');

  if (!track || slides.length === 0) return;

  let current = 0;
  const total = slides.length;
  let autoPlay = true;
  let timer = null;

  function goToSlide(idx) {
    current = (idx + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;

    slides.forEach((s, i) => s.classList.toggle('active', i === current));
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
    if (counter) counter.textContent = `${current + 1} / ${total}`;
  }

  function nextSlide() {
    goToSlide(current + 1);
  }

  function prevSlide() {
    goToSlide(current - 1);
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      playSoundFX('pop');
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      playSoundFX('pop');
    });
  }

  dots.forEach(d => {
    d.addEventListener('click', () => {
      const idx = parseInt(d.getAttribute('data-slide'), 10);
      goToSlide(idx);
      playSoundFX('pop');
    });
  });

  // Auto-play interval
  function startAuto() {
    stopAuto();
    if (autoPlay) {
      timer = setInterval(nextSlide, 5000);
    }
  }

  function stopAuto() {
    if (timer) clearInterval(timer);
  }

  if (playBtn) {
    playBtn.addEventListener('click', () => {
      autoPlay = !autoPlay;
      playBtn.textContent = autoPlay ? '⏸' : '▶';
      if (autoPlay) startAuto(); else stopAuto();
    });
  }

  if (wrapper) {
    wrapper.addEventListener('mouseenter', stopAuto);
    wrapper.addEventListener('mouseleave', () => { if (autoPlay) startAuto(); });

    // Touch Swipe Gesture for iOS & Android
    let startX = 0;
    let endX = 0;

    wrapper.addEventListener('touchstart', (e) => {
      stopAuto();
      startX = e.touches[0].clientX;
    }, { passive: true });

    wrapper.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      const diff = startX - endX;
      if (Math.abs(diff) > 45) {
        if (diff > 0) nextSlide(); else prevSlide();
        playSoundFX('pop');
      }
      if (autoPlay) startAuto();
    }, { passive: true });
  }

  startAuto();
}

/* ==========================================================================
   12. 24 REASONS WHY DIDI IS UNMATCHED (SLIDE DECK)
   ========================================================================== */
function init24ReasonsSlider() {
  const reasons = [
    { num: 1, icon: "🧁", title: "The Secret Sweetness Stash", desc: "She always secretly shares extra dessert, pastries, and snacks with Arnab when Mom isn't watching!", tag: "#CertifiedSweetheart" },
    { num: 2, icon: "🥻", title: "Durga Puja Royal Radiance", desc: "Her vibrant yellow saree styling and festive Bijoya glow rival the royal palaces of Bengal!", tag: "#FestiveRoyalty" },
    { num: 3, icon: "🧠", title: "The Best Elder Sister Advice", desc: "Even when she pretends to scold, her guidance is pure gold and shields Arnab from every mistake.", tag: "#GuardianAngel" },
    { num: 4, icon: "👓", title: "Signature Specs & Sass", desc: "Nobody rocks glasses with 1000% intellectual elegance quite like Mrs. Cupcake!", tag: "#SpecsAndSass" },
    { num: 5, icon: "🐾", title: "The Red Panda Companion", desc: "Striking goofy thumbs-up poses with the giant red panda on Mall Road without any hesitation!", tag: "#WanderlustQueen" },
    { num: 6, icon: "🦸‍♀️", title: "Arnab's Personal Superhero", desc: "From childhood disputes to life hurdles, she always stands firmly between her little bro and the storm.", tag: "#UnbreakableShield" },
    { num: 7, icon: "👑", title: "The Official 'Mrs. Cupcake' Crown", desc: "Because a cupcake brings instant smiles to everyone who looks at it — just like having Didi around.", tag: "#TheOriginalCupcake" },
    { num: 8, icon: "✨", title: "Infectious Room-Brightening Laugh", desc: "Her genuine laughter has the superpower to instantly dissolve tension in any room.", tag: "#SunshineSoul" },
    { num: 9, icon: "☕", title: "Late-Night Tea Gossips", desc: "Steaming cups of tea accompanied by hilarious life updates that last until 2 AM.", tag: "#TeaPartySquad" },
    { num: 10, icon: "🚗", title: "Turns Ordinary Chores Into Fun", desc: "Even running boring family errands becomes an adventure when Didi is riding shotgun.", tag: "#AdventurePartner" },
    { num: 11, icon: "🌟", title: "The Legendary Sibling Motto", desc: "'Grow. There is a future version, don’t look back.' Words that guide both of us every single day.", tag: "#FutureVersion" },
    { num: 12, icon: "🎯", title: "Master of Playful Teasing", desc: "She knows every single embarrassing childhood secret of Arnab and knows exactly when to drop it!", tag: "#PartnerInCrime" },
    { num: 13, icon: "🎵", title: "Flawless Music Taste", desc: "Making Sanam Puri's 'Fakira' our official sibling anthem that echoes through every memorable drive.", tag: "#FakiraAnthem" },
    { num: 14, icon: "🎂", title: "24 Years of Pure Sweetness", desc: "Turning 24 with unmatched grace, wisdom, beauty, and that delightful sprinkle of drama on top.", tag: "#Sweet24" },
    { num: 15, icon: "💖", title: "Instant Forgiveness", desc: "No matter how annoying Arnab acts, she forgives him in five minutes with an exasperated smile.", tag: "#SisterlyGrace" },
    { num: 16, icon: "🎉", title: "The Life of Every Celebration", desc: "Festivals don't feel like festivals until Mrittica Didi starts laughing and organizing the music.", tag: "#FestiveEnergy" },
    { num: 17, icon: "🪙", title: "A 24-Carat Golden Heart", desc: "Behind the banter lies the most compassionate, selfless heart that only wants happiness for her brother.", tag: "#PureGold" },
    { num: 18, icon: "📸", title: "The 100-Photo Perfectionist", desc: "Taking hundred photos until the lighting, smile, and sisterly angle are certified magazine-worthy.", tag: "#SelfieQueen" },
    { num: 19, icon: "🤝", title: "Three-in-One Superhero", desc: "She is a motherly mentor, a trustworthy best friend, and an elder sister all wrapped into one.", tag: "#UltimateTrio" },
    { num: 20, icon: "🏡", title: "Hugs That Feel Like Home", desc: "No matter where life takes us, a sisterly hug from Didi brings back peace and grounding.", tag: "#SafeHaven" },
    { num: 21, icon: "💃", title: "Poise, Dignity & Bengali Pride", desc: "Carrying her roots, heritage, and values with timeless dignity that makes our entire family proud.", tag: "#BengaliGrace" },
    { num: 22, icon: "🛡️", title: "Forever in Your Corner", desc: "Win or lose, success or stumble, Didi is the first to cheer and the last to leave.", tag: "#EternalCheerleader" },
    { num: 23, icon: "🧁", title: "The Glue of Our Family", desc: "Her kindness and affectionate nature bind the family together like sweet frosting on a warm cupcake.", tag: "#SweetBinding" },
    { num: 24, icon: "👑", title: "Simply The World's Best Sister", desc: "Out of 8 billion people on Earth, Arnab was blessed with the absolute finest Didi in existence!", tag: "#NumberOneForever" }
  ];

  let currentIdx = 0;
  const numBadge = document.getElementById('reason-num-badge');
  const iconEl = document.getElementById('reason-icon');
  const titleEl = document.getElementById('reason-title');
  const descEl = document.getElementById('reason-desc');
  const tagEl = document.getElementById('reason-tag');
  const prevBtn = document.getElementById('reason-prev-btn');
  const nextBtn = document.getElementById('reason-next-btn');
  const randomBtn = document.getElementById('reason-random-btn');
  const dotsBar = document.getElementById('reasons-dots-bar');
  const displayCard = document.getElementById('reason-display-card');

  if (!displayCard || !dotsBar) return;

  // Build 24 dots
  dotsBar.innerHTML = '';
  reasons.forEach((r, idx) => {
    const dot = document.createElement('button');
    dot.className = `reason-dot ${idx === 0 ? 'active' : ''}`;
    dot.title = `Reason #${r.num}`;
    dot.addEventListener('click', () => {
      currentIdx = idx;
      renderReason();
      playSoundFX('pop');
    });
    dotsBar.appendChild(dot);
  });

  function renderReason() {
    const r = reasons[currentIdx];
    displayCard.style.opacity = '0';
    displayCard.style.transform = 'translateY(10px)';

    setTimeout(() => {
      if (numBadge) numBadge.textContent = `Reason #${r.num}`;
      if (iconEl) iconEl.textContent = r.icon;
      if (titleEl) titleEl.textContent = r.title;
      if (descEl) descEl.textContent = r.desc;
      if (tagEl) tagEl.textContent = r.tag;

      displayCard.style.opacity = '1';
      displayCard.style.transform = 'translateY(0)';

      const allDots = dotsBar.querySelectorAll('.reason-dot');
      allDots.forEach((d, i) => d.classList.toggle('active', i === currentIdx));
    }, 180);
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentIdx = (currentIdx + 1) % reasons.length;
      renderReason();
      playSoundFX('pop');
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentIdx = (currentIdx - 1 + reasons.length) % reasons.length;
      renderReason();
      playSoundFX('pop');
    });
  }

  if (randomBtn) {
    randomBtn.addEventListener('click', () => {
      let rand;
      do {
        rand = Math.floor(Math.random() * reasons.length);
      } while (rand === currentIdx);
      currentIdx = rand;
      renderReason();
      playSoundFX('chime');
    });
  }

  renderReason();
}

/* ==========================================================================
   13. ARCADE HUB TAB SWITCHER
   ========================================================================== */
function initArcadeHub() {
  const tabs = document.querySelectorAll('.arcade-tab-btn');
  const views = {
    rush: document.getElementById('game-view-rush'),
    handi: document.getElementById('game-view-handi'),
    match: document.getElementById('game-view-match'),
    cake: document.getElementById('game-view-cake')
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-game');
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      Object.keys(views).forEach(k => {
        if (views[k]) {
          views[k].classList.toggle('hidden', k !== target);
          views[k].classList.toggle('active', k === target);
        }
      });

      playSoundFX('pop');
    });
  });
}

/* ==========================================================================
   14. GAME 2: FESTIVE HANDI BURST (MATKA CRACK)
   ========================================================================== */
function initHandiGame() {
  const pot = document.getElementById('handi-pot');
  const hitBtn = document.getElementById('hit-handi-btn');
  const stick = document.getElementById('whack-stick');
  const hitsLabel = document.getElementById('handi-hits-label');
  const healthFill = document.getElementById('handi-health-fill');
  const cracksOverlay = document.getElementById('pot-cracks');
  const burstCard = document.getElementById('handi-burst-card');
  const resetBtn = document.getElementById('reset-handi-btn');

  let hitsLeft = 5;
  const maxHits = 5;
  let isBroken = false;

  const crackEmojis = ['', '⚡', '⚡⚡', '💥⚡💥', '💥💥💥'];

  function whackHandi() {
    if (isBroken || hitsLeft <= 0) return;

    hitsLeft--;
    if (healthFill) healthFill.style.width = `${(hitsLeft / maxHits) * 100}%`;
    if (hitsLabel) hitsLabel.textContent = `${hitsLeft} / ${maxHits} Hits Left`;

    // Stick whack animation
    if (stick) {
      stick.classList.add('hit');
      setTimeout(() => stick.classList.remove('hit'), 200);
    }

    // Pot shake & crack display
    if (pot) {
      pot.style.transform = `scale(0.92) rotate(${Math.random() > 0.5 ? 12 : -12}deg)`;
      setTimeout(() => {
        pot.style.transform = '';
      }, 160);
    }

    if (cracksOverlay) {
      cracksOverlay.textContent = crackEmojis[maxHits - hitsLeft] || '';
      cracksOverlay.style.fontSize = '2rem';
    }

    // Android/iOS touch feedback
    if (typeof navigator.vibrate === 'function') {
      try { navigator.vibrate(20); } catch (e) {}
    }

    if (hitsLeft > 0) {
      playSoundFX('pop');
    } else {
      // BURST!
      isBroken = true;
      playSoundFX('success');

      if (typeof confetti === 'function') {
        confetti({
          particleCount: 160,
          spread: 100,
          origin: { y: 0.6 },
          colors: ['#f6c90e', '#ff85a1', '#fb8500', '#ffffff']
        });
      }

      if (burstCard) burstCard.classList.remove('hidden');
    }
  }

  function resetHandi() {
    hitsLeft = maxHits;
    isBroken = false;
    if (healthFill) healthFill.style.width = '100%';
    if (hitsLabel) hitsLabel.textContent = `${maxHits} / ${maxHits} Hits Left`;
    if (cracksOverlay) cracksOverlay.textContent = '';
    if (burstCard) burstCard.classList.add('hidden');
    playSoundFX('chime');
  }

  if (pot) pot.addEventListener('click', whackHandi);
  if (hitBtn) hitBtn.addEventListener('click', whackHandi);
  if (resetBtn) resetBtn.addEventListener('click', resetHandi);
}

/* ==========================================================================
   15. GAME 3: SWEET MEMORY MATCH (CARD FLIP PUZZLE)
   ========================================================================== */
function initMemoryMatchGame() {
  const grid = document.getElementById('memory-cards-grid');
  const movesEl = document.getElementById('match-moves-count');
  const pairsEl = document.getElementById('match-pairs-count');
  const timerEl = document.getElementById('match-timer-count');
  const resetBtn = document.getElementById('reset-match-btn');
  const victoryOverlay = document.getElementById('match-victory-overlay');
  const playAgainBtn = document.getElementById('match-play-again-btn');
  const vicMoves = document.getElementById('vic-moves');
  const vicTime = document.getElementById('vic-time');

  if (!grid) return;

  const cardItems = ['🧁', '👑', '🐾', '🌸', '🏔️', '📸'];
  let deck = [];
  let flippedCards = [];
  let matchedPairs = 0;
  let moves = 0;
  let seconds = 0;
  let gameTimer = null;
  let isChecking = false;

  function shuffle(arr) {
    return arr.slice().sort(() => Math.random() - 0.5);
  }

  function formatTime(s) {
    const min = String(Math.floor(s / 60)).padStart(2, '0');
    const sec = String(s % 60).padStart(2, '0');
    return `${min}:${sec}`;
  }

  function startTimer() {
    clearInterval(gameTimer);
    seconds = 0;
    gameTimer = setInterval(() => {
      seconds++;
      if (timerEl) timerEl.textContent = formatTime(seconds);
    }, 1000);
  }

  function setupBoard() {
    deck = shuffle([...cardItems, ...cardItems]);
    grid.innerHTML = '';
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    isChecking = false;

    if (movesEl) movesEl.textContent = '0';
    if (pairsEl) pairsEl.textContent = '0 / 6';
    if (timerEl) timerEl.textContent = '00:00';
    if (victoryOverlay) victoryOverlay.classList.add('hidden');

    deck.forEach((emoji, idx) => {
      const card = document.createElement('div');
      card.className = 'memory-card';
      card.setAttribute('data-emoji', emoji);
      card.setAttribute('data-id', idx);

      card.innerHTML = `
        <div class="card-inner">
          <div class="card-front">✨</div>
          <div class="card-back">${emoji}</div>
        </div>
      `;

      card.addEventListener('click', () => handleCardClick(card));
      grid.appendChild(card);
    });

    startTimer();
  }

  function handleCardClick(card) {
    if (isChecking || card.classList.contains('flipped') || card.classList.contains('matched')) return;

    card.classList.add('flipped');
    flippedCards.push(card);
    playSoundFX('pop');

    if (flippedCards.length === 2) {
      moves++;
      if (movesEl) movesEl.textContent = moves;
      isChecking = true;

      const [c1, c2] = flippedCards;
      const match = c1.getAttribute('data-emoji') === c2.getAttribute('data-emoji');

      if (match) {
        setTimeout(() => {
          c1.classList.add('matched');
          c2.classList.add('matched');
          matchedPairs++;
          if (pairsEl) pairsEl.textContent = `${matchedPairs} / 6`;
          playSoundFX('chime');
          flippedCards = [];
          isChecking = false;

          if (matchedPairs === 6) {
            handleVictory();
          }
        }, 350);
      } else {
        setTimeout(() => {
          c1.classList.remove('flipped');
          c2.classList.remove('flipped');
          flippedCards = [];
          isChecking = false;
        }, 850);
      }
    }
  }

  function handleVictory() {
    clearInterval(gameTimer);
    playSoundFX('success');

    if (vicMoves) vicMoves.textContent = moves;
    if (vicTime) vicTime.textContent = formatTime(seconds);

    if (typeof confetti === 'function') {
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 }
      });
    }

    if (victoryOverlay) victoryOverlay.classList.remove('hidden');
  }

  if (resetBtn) resetBtn.addEventListener('click', setupBoard);
  if (playAgainBtn) playAgainBtn.addEventListener('click', setupBoard);

  setupBoard();
}

/* ==========================================================================
   16. GAME 4: 24TH BIRTHDAY CAKE STUDIO
   ========================================================================== */
function initCakeStudio() {
  const flavorPills = document.querySelectorAll('.flavor-pill');
  const toppingPills = document.querySelectorAll('.topping-pill');
  const tiers = document.querySelectorAll('.cake-tier');
  const topToppings = document.getElementById('toppings-top');
  const midToppings = document.getElementById('toppings-mid');
  const baseToppings = document.getElementById('toppings-base');
  const blowBtn = document.getElementById('blow-candles-btn');
  const relightBtn = document.getElementById('relight-candles-btn');
  const flames = document.querySelectorAll('.candle-flame');
  const wishBanner = document.getElementById('wish-banner');

  flavorPills.forEach(pill => {
    pill.addEventListener('click', () => {
      flavorPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const flavor = pill.getAttribute('data-flavor');
      tiers.forEach(t => {
        t.className = `cake-tier ${t.id === 'tier-top' ? 'tier-top' : t.id === 'tier-mid' ? 'tier-mid' : 'tier-base'} ${flavor}`;
      });
      playSoundFX('pop');
    });
  });

  const toppingSets = {
    cherries: { top: '🍒 🍓 🍒', mid: '✨ 🧁 ✨', base: '👑 Mrs. Cupcake 👑' },
    sprinkles: { top: '⭐ ✨ ⭐', mid: '💖 ✨ 💖', base: '✨ Queen of Hearts ✨' },
    macarons: { top: '🍥 🍓 🍥', mid: '🧁 🍥 🧁', base: '👑 24 Years Sweet 👑' }
  };

  toppingPills.forEach(pill => {
    pill.addEventListener('click', () => {
      toppingPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const topping = pill.getAttribute('data-topping');
      const set = toppingSets[topping] || toppingSets.cherries;

      if (topToppings) topToppings.textContent = set.top;
      if (midToppings) midToppings.textContent = set.mid;
      if (baseToppings) baseToppings.textContent = set.base;
      playSoundFX('pop');
    });
  });

  if (blowBtn) {
    blowBtn.addEventListener('click', () => {
      flames.forEach(f => f.classList.add('out'));
      playSoundFX('success');

      if (typeof confetti === 'function') {
        confetti({
          particleCount: 200,
          spread: 120,
          origin: { y: 0.55 },
          colors: ['#ff85a1', '#f6c90e', '#ffffff', '#ff7eb3', '#7209b7']
        });
      }

      if (wishBanner) wishBanner.classList.remove('hidden');
      blowBtn.classList.add('hidden');
      if (relightBtn) relightBtn.classList.remove('hidden');
    });
  }

  if (relightBtn) {
    relightBtn.addEventListener('click', () => {
      flames.forEach(f => f.classList.remove('out'));
      playSoundFX('chime');
      if (wishBanner) wishBanner.classList.add('hidden');
      relightBtn.classList.add('hidden');
      if (blowBtn) blowBtn.classList.remove('hidden');
    });
  }
}

/* ==========================================================================
   17. SISTERHOOD SOUNDBOARD & WISHES WALL
   ========================================================================== */
function initSoundboardAndWishes() {
  const chips = document.querySelectorAll('.sound-chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const type = chip.getAttribute('data-sound');
      playSoundFX('chime');

      chip.style.transform = 'scale(0.92)';
      setTimeout(() => chip.style.transform = '', 150);

      // Create floating text notification
      const bubble = document.createElement('div');
      bubble.className = 'floating-sparkle-heart';
      bubble.textContent = chip.querySelector('.chip-icon')?.textContent || '💖';
      bubble.style.left = `${Math.random() * 60 + 20}vw`;
      bubble.style.top = `60vh`;
      document.body.appendChild(bubble);
      setTimeout(() => bubble.remove(), 1200);
    });
  });

  // Wishes Wall interactivity
  const postBtn = document.getElementById('post-wish-btn');
  const inputEl = document.getElementById('custom-wish-input');
  const grid = document.getElementById('wishes-cards-grid');

  function bindLikeButtons() {
    const likeBtns = document.querySelectorAll('.wish-heart-btn');
    likeBtns.forEach(btn => {
      if (!btn.dataset.bound) {
        btn.dataset.bound = 'true';
        btn.addEventListener('click', () => {
          const numEl = btn.querySelector('.like-num');
          if (numEl) {
            let count = parseInt(numEl.textContent, 10) || 0;
            numEl.textContent = count + 1;
          }
          playSoundFX('pop');

          const heart = document.createElement('div');
          heart.className = 'floating-sparkle-heart';
          heart.textContent = '💖';
          const rect = btn.getBoundingClientRect();
          heart.style.left = `${rect.left + rect.width / 2}px`;
          heart.style.top = `${rect.top}px`;
          document.body.appendChild(heart);
          setTimeout(() => heart.remove(), 1200);
        });
      }
    });
  }

  if (postBtn && inputEl && grid) {
    postBtn.addEventListener('click', () => {
      const text = inputEl.value.trim();
      if (!text) return;

      const card = document.createElement('div');
      card.className = 'wish-sticky-card glass-panel';
      card.innerHTML = `
        <div class="sticky-pin">📍</div>
        <p class="wish-text">"${text}"</p>
        <div class="wish-author-row">
          <span class="wish-author">— With love, A Family Well-Wisher</span>
          <button class="wish-heart-btn">💖 <span class="like-num">1</span></button>
        </div>
      `;

      grid.prepend(card);
      inputEl.value = '';
      playSoundFX('chime');
      bindLikeButtons();
    });
  }

  bindLikeButtons();
}

