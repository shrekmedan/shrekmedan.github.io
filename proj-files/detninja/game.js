/* =========================================================================
   AUDIO SYNTHESIS (Katana Sound Engine)
   ========================================================================= */
const Sound = {
  ctx: null,
  enabled: true,
  init() {
    if (!this.enabled) return;
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  },
  toggle() {
    this.enabled = !this.enabled;
    try {
      localStorage.setItem('ninja_sound_enabled', this.enabled ? '1' : '0');
    } catch (e) {}
    updateSoundUI();
    if (this.enabled) {
      this.slash(1.2);
    }
    return this.enabled;
  },
  loadSetting() {
    try {
      const saved = localStorage.getItem('ninja_sound_enabled');
      if (saved !== null) {
        this.enabled = (saved === '1');
      }
    } catch (e) {}
    updateSoundUI();
  },
  // Real Katana Whoosh (Air slicing with high-speed steel resonance)
  slash(pitch = 1) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;

    // 1. Dynamic air displacement noise
    const len = Math.floor(ctx.sampleRate * 0.2);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin((i / len) * Math.PI);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buf;

    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.setValueAtTime(350 * pitch, t);
    bp.frequency.exponentialRampToValueAtTime(2600 * pitch, t + 0.05);
    bp.frequency.exponentialRampToValueAtTime(280 * pitch, t + 0.18);
    bp.Q.value = 2.8;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.001, t);
    noiseGain.gain.linearRampToValueAtTime(0.55, t + 0.04);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.19);

    noise.connect(bp);
    bp.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(t);

    // 2. High-speed blade edge whistling ("zing" through air)
    const bladeOsc = ctx.createOscillator();
    const bladeGain = ctx.createGain();
    bladeOsc.type = 'sine';
    bladeOsc.frequency.setValueAtTime(2400 * pitch, t);
    bladeOsc.frequency.exponentialRampToValueAtTime(1400 * pitch, t + 0.12);

    bladeGain.gain.setValueAtTime(0.001, t);
    bladeGain.gain.linearRampToValueAtTime(0.12, t + 0.03);
    bladeGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);

    bladeOsc.connect(bladeGain);
    bladeGain.connect(ctx.destination);
    bladeOsc.start(t);
    bladeOsc.stop(t + 0.15);
  },

  // Real Katana Blade Clash (High-carbon steel ring + sharp impact snap)
  clash() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;

    // 1. Initial metallic impact snap
    const snapLen = Math.floor(ctx.sampleRate * 0.02);
    const snapBuf = ctx.createBuffer(1, snapLen, ctx.sampleRate);
    const snapData = snapBuf.getChannelData(0);
    for (let i = 0; i < snapLen; i++) snapData[i] = Math.random() * 2 - 1;
    const snapSource = ctx.createBufferSource();
    snapSource.buffer = snapBuf;

    const snapFilter = ctx.createBiquadFilter();
    snapFilter.type = 'highpass';
    snapFilter.frequency.value = 2000;

    const snapGain = ctx.createGain();
    snapGain.gain.setValueAtTime(0.6, t);
    snapGain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);

    snapSource.connect(snapFilter);
    snapFilter.connect(snapGain);
    snapGain.connect(ctx.destination);
    snapSource.start(t);

    // 2. Inharmonic metallic ringing frequencies (authentic steel sword clash)
    const partials = [
      { freq: 880, gain: 0.25, decay: 0.4 },
      { freq: 1760, gain: 0.35, decay: 0.6 },
      { freq: 2840, gain: 0.28, decay: 0.75 },
      { freq: 4400, gain: 0.2, decay: 0.55 },
      { freq: 6200, gain: 0.15, decay: 0.35 }
    ];

    partials.forEach(p => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(p.freq, t);
      osc.frequency.exponentialRampToValueAtTime(p.freq * 0.98, t + p.decay);

      g.gain.setValueAtTime(p.gain, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + p.decay);

      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + p.decay + 0.02);
    });
  },

  // Real Ninja Deflection / Wooden Block (Blunt thud instead of buzzer)
  error() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;

    // 1. Organic wooden/sheath impact thud
    const thudOsc = ctx.createOscillator();
    const thudGain = ctx.createGain();
    thudOsc.type = 'triangle';
    thudOsc.frequency.setValueAtTime(180, t);
    thudOsc.frequency.exponentialRampToValueAtTime(45, t + 0.16);

    thudGain.gain.setValueAtTime(0.5, t);
    thudGain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

    thudOsc.connect(thudGain);
    thudGain.connect(ctx.destination);
    thudOsc.start(t);
    thudOsc.stop(t + 0.2);

    // 2. Wood crack / armor slap transient
    const len = Math.floor(ctx.sampleRate * 0.06);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    const crack = ctx.createBufferSource();
    crack.buffer = buf;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 750;
    filter.Q.value = 3.5;

    const crackGain = ctx.createGain();
    crackGain.gain.setValueAtTime(0.4, t);
    crackGain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

    crack.connect(filter);
    filter.connect(crackGain);
    crackGain.connect(ctx.destination);
    crack.start(t);
  },

  // Japanese Hirajoshi Pentatonic Flourish (Authentic koto string plucks)
  success() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;

    const kotoNotes = [587.33, 622.25, 783.99, 880.00, 1174.66];

    kotoNotes.forEach((freq, idx) => {
      const noteTime = t + (idx * 0.055);

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.0001, noteTime);
      gain.gain.linearRampToValueAtTime(0.3, noteTime + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.5);

      const overtone = ctx.createOscillator();
      const overGain = ctx.createGain();
      overtone.type = 'sine';
      overtone.frequency.setValueAtTime(freq * 2, noteTime);
      overGain.gain.setValueAtTime(0.08, noteTime);
      overGain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);
      overtone.connect(overGain);
      overGain.connect(ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.52);
      overtone.start(noteTime);
      overtone.stop(noteTime + 0.28);
    });
  },

  // Resonant countdown tick (Ascending Japanese chime / katana flick)
  countdownTick(step) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;

    const pitches = { 3: 440, 2: 554, 1: 659 };
    const baseFreq = pitches[step] || 520;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, t);

    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(0.28, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.58);

    const overtone = ctx.createOscillator();
    const overGain = ctx.createGain();
    overtone.type = 'triangle';
    overtone.frequency.setValueAtTime(baseFreq * 2.76, t);

    overGain.gain.setValueAtTime(0.0001, t);
    overGain.gain.linearRampToValueAtTime(0.08, t + 0.008);
    overGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);

    overtone.connect(overGain);
    overGain.connect(ctx.destination);
    overtone.start(t);
    overtone.stop(t + 0.38);

    this.slash(0.7 + (4 - (step || 3)) * 0.2);
  },

  // Juicy Fruit Slice Sound (Fruit Ninja wet squash + steel katana slash)
  fruitSlice(pitch = 1) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;

    // 1. Wet juicy fruit squish transient
    const len = Math.floor(ctx.sampleRate * 0.12);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (len * 0.28));
    }
    const squishNoise = ctx.createBufferSource();
    squishNoise.buffer = buf;

    const squishFilter = ctx.createBiquadFilter();
    squishFilter.type = 'lowpass';
    squishFilter.frequency.setValueAtTime(1400 * pitch, t);
    squishFilter.frequency.exponentialRampToValueAtTime(320 * pitch, t + 0.1);

    const squishGain = ctx.createGain();
    squishGain.gain.setValueAtTime(0.55, t);
    squishGain.gain.exponentialRampToValueAtTime(0.001, t + 0.11);

    squishNoise.connect(squishFilter);
    squishFilter.connect(squishGain);
    squishGain.connect(ctx.destination);
    squishNoise.start(t);

    // 2. Juicy pulp pitch drop (fruity pop)
    const popOsc = ctx.createOscillator();
    const popGain = ctx.createGain();
    popOsc.type = 'triangle';
    popOsc.frequency.setValueAtTime(360 * pitch, t);
    popOsc.frequency.exponentialRampToValueAtTime(85 * pitch, t + 0.08);

    popGain.gain.setValueAtTime(0.35, t);
    popGain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

    popOsc.connect(popGain);
    popGain.connect(ctx.destination);
    popOsc.start(t);
    popOsc.stop(t + 0.1);

    // 3. Sharp Katana whoosh + metallic ringing blade
    this.slash(1.15 * pitch);
    this.clash();
  },

  // Subtle tactile tap for numpad keys
  tap() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, t);
    osc.frequency.exponentialRampToValueAtTime(160, t + 0.03);
    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.04);
  }
};

function updateSoundUI() {
  const isEnabled = Sound.enabled;

  // 1. Splash Screen Button (Icon only)
  const splashBtn = document.getElementById('splashSoundBtn');
  if (splashBtn) {
    const iconOn = splashBtn.querySelector('.icon-sound-on');
    const iconOff = splashBtn.querySelector('.icon-sound-off');
    if (iconOn) iconOn.style.display = isEnabled ? 'inline-block' : 'none';
    if (iconOff) iconOff.style.display = isEnabled ? 'none' : 'inline-block';
    if (isEnabled) {
      splashBtn.classList.remove('sound-muted');
      splashBtn.title = 'Suara Nyala (Klik untuk membisukan)';
    } else {
      splashBtn.classList.add('sound-muted');
      splashBtn.title = 'Suara Senyap (Klik untuk menyalakan)';
    }
  }

  // 2. In-Match Floating Button (Icon only)
  const matchBtn = document.getElementById('matchSoundBtn');
  if (matchBtn) {
    const iconOn = matchBtn.querySelector('.icon-sound-on');
    const iconOff = matchBtn.querySelector('.icon-sound-off');
    if (iconOn) iconOn.style.display = isEnabled ? 'inline-block' : 'none';
    if (iconOff) iconOff.style.display = isEnabled ? 'none' : 'inline-block';
    if (isEnabled) {
      matchBtn.classList.remove('sound-muted');
      matchBtn.title = 'Suara Nyala (Klik untuk membisukan)';
    } else {
      matchBtn.classList.add('sound-muted');
      matchBtn.title = 'Suara Senyap (Klik untuk menyalakan)';
    }
  }
}

function toggleSound() {
  Sound.toggle();
}

// Inisialisasi preferensi suara saat file termuat
Sound.loadSetting();

/* =========================================================================
   CANVAS ATMOSPHERE (Ambient Mist + Fruit Ninja Splatters + Blade Trails)
   ========================================================================= */
const canvas = document.getElementById('slashCanvas');
const ctx = canvas.getContext('2d');
let trails = [];
let particles = [];
let ambientMist = [];
let splatters = []; // Fruit Ninja juice splatters on the dojo wood wall
let sparkles = [];  // Shimmering blade trail star sparkles

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initAmbientMist();
}
window.addEventListener('resize', resizeCanvas);

function initAmbientMist() {
  ambientMist = [];
  const count = Math.floor(window.innerWidth / 45);
  for (let i = 0; i < count; i++) {
    ambientMist.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2.2 + 1,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -Math.random() * 0.3 - 0.1,
      alpha: Math.random() * 0.25 + 0.08
    });
  }
}
resizeCanvas();

function addTrailPoint(x, y, color) {
  trails.push({ x, y, time: Date.now(), color });

  // Add shimmering Fruit Ninja blade trail sparkles
  if (Math.random() < 0.5) {
    sparkles.push({
      x: x + (Math.random() - 0.5) * 14,
      y: y + (Math.random() - 0.5) * 14,
      vx: (Math.random() - 0.5) * 1.8,
      vy: (Math.random() - 0.5) * 1.8 + 0.4,
      size: Math.random() * 3.5 + 2,
      alpha: 1,
      color: '#ffffff'
    });
  }
}

function addJuiceSplatter(x, y, color) {
  const droplets = [];
  const count = Math.floor(Math.random() * 8) + 12;
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * 65 + 12;
    droplets.push({
      ox: Math.cos(angle) * dist,
      oy: Math.sin(angle) * dist + (Math.random() * 18),
      r: Math.random() * 6 + 2.5
    });
  }

  splatters.push({
    x, y,
    color,
    mainR: Math.random() * 18 + 26,
    droplets,
    time: Date.now(),
    duration: 2500
  });
}

function addSpark(x, y, color, count = 12) {
  for (let i = 0; i < count; i++) {
    particles.push({
      x, y,
      vx: (Math.random() - 0.5) * 12,
      vy: (Math.random() - 0.5) * 12,
      alpha: 1,
      color,
      radius: Math.random() * 3.5 + 2
    });
  }
}

function renderCanvasFrame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const now = Date.now();

  // 1. Fruit Ninja Juice Splatters on background
  for (let i = splatters.length - 1; i >= 0; i--) {
    const s = splatters[i];
    const age = now - s.time;
    if (age > s.duration) {
      splatters.splice(i, 1);
      continue;
    }
    const alpha = Math.max(0, 1 - (age / s.duration));

    ctx.save();
    ctx.globalAlpha = alpha * 0.75;
    ctx.fillStyle = s.color;
    ctx.shadowBlur = 14;
    ctx.shadowColor = s.color;

    // Central splash puddle
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.mainR, 0, Math.PI * 2);
    ctx.fill();

    // Splattered satellite droplets
    for (const d of s.droplets) {
      ctx.beginPath();
      ctx.arc(s.x + d.ox, s.y + d.oy, d.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // 2. Ambient Dojo Lantern Mist
  for (let m of ambientMist) {
    m.x += m.vx;
    m.y += m.vy;
    if (m.y < 0) {
      m.y = canvas.height;
      m.x = Math.random() * canvas.width;
    }
    if (m.x < 0) m.x = canvas.width;
    if (m.x > canvas.width) m.x = 0;

    ctx.save();
    ctx.fillStyle = '#ffb703';
    ctx.globalAlpha = m.alpha;
    ctx.beginPath();
    ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // 3. Shimmering Blade Sparkles (Fruit Ninja Star Glitters)
  for (let i = sparkles.length - 1; i >= 0; i--) {
    const sp = sparkles[i];
    sp.x += sp.vx;
    sp.y += sp.vy;
    sp.alpha -= 0.038;
    if (sp.alpha <= 0) {
      sparkles.splice(i, 1);
      continue;
    }
    ctx.save();
    ctx.globalAlpha = Math.max(0, sp.alpha);
    ctx.fillStyle = sp.color;
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#ffffff';

    const s = sp.size;
    ctx.beginPath();
    ctx.moveTo(sp.x, sp.y - s);
    ctx.lineTo(sp.x + s * 0.35, sp.y);
    ctx.lineTo(sp.x, sp.y + s);
    ctx.lineTo(sp.x - s * 0.35, sp.y);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // 4. Luminous Fruit Ninja Blade Ribbon Trail
  if (trails.length > 1) {
    for (let i = 1; i < trails.length; i++) {
      const p1 = trails[i - 1];
      const p2 = trails[i];
      const age = now - p2.time;
      if (age > 240) continue;
      const ratio = 1 - (age / 240);

      // Outer vivid blade aura
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.strokeStyle = p2.color;
      ctx.lineWidth = ratio * 18 + 5;
      ctx.lineCap = 'round';
      ctx.shadowBlur = 22;
      ctx.shadowColor = p2.color;
      ctx.globalAlpha = ratio * 0.78;
      ctx.stroke();
      ctx.restore();

      // Sharp white luminous razor core
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = ratio * 5 + 1.5;
      ctx.lineCap = 'round';
      ctx.globalAlpha = ratio * 0.95;
      ctx.stroke();
      ctx.restore();
    }
  }

  trails = trails.filter(p => now - p.time < 240);

  // 5. Slash Impact Spark Burst Particles
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.alpha -= 0.045;
    if (p.alpha <= 0) {
      particles.splice(i, 1);
      continue;
    }
    ctx.save();
    ctx.globalAlpha = Math.max(0, p.alpha);
    ctx.fillStyle = p.color;
    ctx.shadowBlur = 10;
    ctx.shadowColor = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  requestAnimationFrame(renderCanvasFrame);
}
requestAnimationFrame(renderCanvasFrame);

/* =========================================================================
   GAME CONTROLLER & NUMPAD
   ========================================================================= */
const appState = {
  mode: 'solo',
  isCountingDown: false,
  playerNames: {
    solo: 'Latihan',
    p1: 'Pemain 1',
    p2: 'Pemain 2'
  },
  timeAttack: {
    enabled: false,
    type: 'global', // 'global' or 'per_question'
    perQuestionDuration: 15,
    globalDuration: 60,
    remaining: 60,
    timerId: null
  },
  slots: {
    solo: {
      id: 'solo',
      step: 1, // 1, '1_input', 2, '2_input', 3
      matrix: { a: 3, b: 2, c: 1, d: 4 },
      score: 0,
      lives: 3,
      maxLives: 3,
      inputVal: '',
      locked: false,
      prefix: 'solo'
    },
    p1: {
      id: 'p1',
      step: 1,
      matrix: { a: 2, b: 3, c: 1, d: 5 },
      score: 0,
      lives: 3,
      maxLives: 3,
      inputVal: '',
      locked: false,
      prefix: 'p1'
    },
    p2: {
      id: 'p2',
      step: 1,
      matrix: { a: 4, b: 1, c: 2, d: 3 },
      score: 0,
      lives: 3,
      maxLives: 3,
      inputVal: '',
      locked: false,
      prefix: 'p2'
    }
  }
};

/* =========================================================================
   GAME START COUNTDOWN CONTROLLER (3, 2, 1, TEBAS!)
   ========================================================================= */
let countdownTimerId = null;

function stopGameCountdown() {
  if (countdownTimerId) {
    clearTimeout(countdownTimerId);
    countdownTimerId = null;
  }
  appState.isCountingDown = false;
  const overlay = document.getElementById('gameCountdownOverlay');
  if (overlay) {
    overlay.style.display = 'none';
    overlay.style.opacity = '1';
  }
}

function runGameCountdown(onComplete) {
  stopGameCountdown();
  appState.isCountingDown = true;

  const overlay = document.getElementById('gameCountdownOverlay');
  const numEl = document.getElementById('countdownNumber');
  const markEl = document.getElementById('countdownWatermark');
  const subEl = document.getElementById('countdownSubtext');

  if (!overlay || !numEl) {
    appState.isCountingDown = false;
    if (typeof onComplete === 'function') onComplete();
    return;
  }

  overlay.style.display = 'flex';
  overlay.style.opacity = '1';

  const sequence = [
    { num: '3', mark: '参', sub: 'Tarik Napas...', sound: 3, delay: 850, isFinal: false },
    { num: '2', mark: '弐', sub: 'Bersedia...', sound: 2, delay: 850, isFinal: false },
    { num: '1', mark: '壱', sub: 'Siap...', sound: 1, delay: 850, isFinal: false },
    { num: 'MULAI!!!', mark: '斬', sub: '', sound: 0, delay: 600, isFinal: true }
  ];

  let stepIdx = 0;

  function nextStep() {
    if (!appState.isCountingDown) return;

    if (stepIdx >= sequence.length) {
      overlay.style.transition = 'opacity 0.25s ease';
      overlay.style.opacity = '0';
      countdownTimerId = setTimeout(() => {
        overlay.style.display = 'none';
        overlay.style.opacity = '1';
        appState.isCountingDown = false;
        countdownTimerId = null;
        if (typeof onComplete === 'function') {
          onComplete();
        }
      }, 250);
      return;
    }

    const current = sequence[stepIdx];
    stepIdx++;

    if (markEl) markEl.textContent = current.mark;
    if (subEl) subEl.textContent = current.sub;
    numEl.textContent = current.num;

    numEl.classList.remove('countdown-pop', 'countdown-slash');
    void numEl.offsetWidth; // Force reflow to re-trigger animation

    if (current.isFinal) {
      numEl.classList.add('countdown-slash');
      Sound.fruitSlice(1.1);
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      addSpark(cx, cy, '#00d2ff', 24);
      addSpark(cx, cy, '#ff2a5f', 24);
      addJuiceSplatter(cx, cy, '#ff2a5f');
    } else {
      numEl.classList.add('countdown-pop');
      Sound.countdownTick(current.sound);
    }

    countdownTimerId = setTimeout(nextStep, current.delay);
  }

  nextStep();
}

const toastTimers = {};

function showSideToast(slotKey, title, message, isWarning = false, duration = 2500) {
  const p = appState.slots[slotKey].prefix;
  const toastEl = document.getElementById(`${p}Toast`);
  const titleEl = document.getElementById(`${p}ToastTitle`);
  const bodyEl = document.getElementById(`${p}ToastBody`);

  if (!toastEl || !titleEl || !bodyEl) return;

  if (toastTimers[slotKey]) {
    clearTimeout(toastTimers[slotKey]);
  }

  titleEl.textContent = title;
  bodyEl.innerHTML = message;

  if (isWarning) {
    toastEl.classList.add('side-toast-warning');
  } else {
    toastEl.classList.remove('side-toast-warning');
  }

  toastEl.style.display = 'block';

  toastTimers[slotKey] = setTimeout(() => {
    toastEl.style.display = 'none';
  }, duration);
}

function hideSideToast(slotKey) {
  const p = appState.slots[slotKey].prefix;
  const toastEl = document.getElementById(`${p}Toast`);
  if (toastEl) toastEl.style.display = 'none';
}

/* =========================================================================
   DIFFICULTY SCALING & ADVANCED STEP CHECK (Skor >= 20, setara 10 soal)
   ========================================================================= */
function isAdvancedMode(slotKey) {
  return appState.slots[slotKey].score >= 20;
}

function randomMatrix(score = 0) {
  const tier = Math.floor(score / 10);

  let minVal, maxVal, allowNegative, maxNegatives;

  if (tier === 0) {
    // Skor 0 - 8 (1 s.d. 4 soal): Tingkat 1 (Positif kecil 1 s.d. 5)
    minVal = 1;
    maxVal = 5;
    allowNegative = false;
    maxNegatives = 0;
  } else if (tier === 1) {
    // Skor 10 - 18 (5 s.d. 9 soal): Tingkat 2 (1 s.d. 8, mulai ada 1 angka negatif -1 s.d. -4)
    minVal = 1;
    maxVal = 8;
    allowNegative = true;
    maxNegatives = 1;
  } else if (tier === 2) {
    // Skor 20 - 28 (10 s.d. 14 soal): Tingkat 3 (Campuran positif & negatif lebih menantang)
    minVal = 1;
    maxVal = 9;
    allowNegative = true;
    maxNegatives = 2;
  } else {
    // Skor 30+ (15+ soal): Tingkat 4 (Angka lebih besar, tantangan tinggi dengan determinan <= 99)
    minVal = 2;
    maxVal = 11;
    allowNegative = true;
    maxNegatives = 2;
  }

  let a, b, c, d, det;
  let attempts = 0;

  do {
    const rand = () => Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;

    a = rand();
    b = rand();
    c = rand();
    d = rand();

    if (allowNegative && maxNegatives > 0) {
      const keys = ['a', 'b', 'c', 'd'].sort(() => Math.random() - 0.5);
      const numNeg = Math.floor(Math.random() * maxNegatives) + 1;
      for (let i = 0; i < numNeg; i++) {
        const k = keys[i];
        if (k === 'a') a = -a;
        else if (k === 'b') b = -b;
        else if (k === 'c') c = -c;
        else if (k === 'd') d = -d;
      }
    }

    det = (a * d) - (b * c);
    attempts++;
  } while ((Math.abs(det) > 99 || (a === 0 && d === 0 && b === 0)) && attempts < 80);

  return { a, b, c, d };
}

function setNumpadActive(slotKey, isActive) {
  const slot = appState.slots[slotKey];
  if (!slot) return;
  const p = slot.prefix || slotKey;
  const numpad = document.getElementById(`${p}Numpad`);
  if (!numpad) return;

  numpad.style.display = 'flex';

  if (isActive && !slot.locked) {
    numpad.classList.remove('numpad-disabled');
    numpad.querySelectorAll('button').forEach(btn => {
      btn.disabled = false;
    });
  } else {
    numpad.classList.add('numpad-disabled');
    numpad.querySelectorAll('button').forEach(btn => {
      btn.disabled = true;
    });
  }
}

function initSlot(slotKey, resetLives = false) {
  const slot = appState.slots[slotKey];

  if (resetLives) {
    slot.lives = slot.maxLives;
    slot.score = 0;
  }

  // Kesulitan soal per player sesuai perolehan skor masing-masing
  slot.matrix = randomMatrix(slot.score);
  slot.step = 1;
  slot.inputVal = '';
  slot.locked = false;

  const p = slot.prefix;
  const scoreEl = document.getElementById(`${p}ScoreText`);
  if (scoreEl) scoreEl.textContent = `Skor: ${slot.score}`;

  document.getElementById(`${p}_a`).querySelector('.node-val').textContent = slot.matrix.a;
  document.getElementById(`${p}_b`).querySelector('.node-val').textContent = slot.matrix.b;
  document.getElementById(`${p}_c`).querySelector('.node-val').textContent = slot.matrix.c;
  document.getElementById(`${p}_d`).querySelector('.node-val').textContent = slot.matrix.d;

  ['a', 'b', 'c', 'd'].forEach(pos => {
    const el = document.getElementById(`${p}_${pos}`);
    el.className = 'node';
  });

  document.getElementById(`${p}ValAD`).textContent = '...';
  document.getElementById(`${p}ValBC`).textContent = '...';
  document.getElementById(`${p}ValDet`).textContent = '...';

  updateInputDisplay(slotKey);
  setNumpadActive(slotKey, false);

  hideSideToast(slotKey);
  const elimEl = document.getElementById(`${p}EliminatedBanner`);
  if (elimEl) elimEl.style.display = 'none';

  renderLives(slotKey);
  updateSlotUI(slotKey);
}

function renderLives(slotKey) {
  const slot = appState.slots[slotKey];
  const p = slot.prefix;
  const container = document.getElementById(`${p}LivesDots`);
  if (!container) return;

  container.innerHTML = '';
  for (let i = 0; i < slot.maxLives; i++) {
    const isAlive = (i < slot.lives);
    const fruitSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    fruitSvg.setAttribute('viewBox', '0 0 24 24');
    fruitSvg.setAttribute('class', `fruit-life-icon ${isAlive ? '' : 'fruit-life-lost'}`);
    if (isAlive) {
      fruitSvg.innerHTML = `
        <path d="M2 13 C 2 18.5, 6.5 22, 12 22 C 17.5 22, 22 18.5, 22 13 Z" fill="#2ecc71" stroke="#27ae60" stroke-width="1.2"/>
        <path d="M3.2 13 C 3.2 17.5, 7.2 20.6, 12 20.6 C 16.8 20.6, 20.8 17.5, 20.8 13 Z" fill="#fffdfa"/>
        <path d="M4.2 13 C 4.2 16.8, 7.6 19.5, 12 19.5 C 16.4 19.5, 19.8 16.8, 19.8 13 Z" fill="#ff2a5f"/>
        <circle cx="8" cy="15.2" r="0.8" fill="#1b120c"/>
        <circle cx="12" cy="16.5" r="0.8" fill="#1b120c"/>
        <circle cx="16" cy="15.2" r="0.8" fill="#1b120c"/>
        <path d="M5 13.6 Q 12 14.5 19 13.6" stroke="rgba(255,255,255,0.75)" stroke-width="1" stroke-linecap="round"/>
      `;
    } else {
      fruitSvg.innerHTML = `
        <path d="M5 5 L19 19 M19 5 L5 19" stroke="#ff2a5f" stroke-width="3.5" stroke-linecap="round"/>
        <path d="M5 5 L19 19 M19 5 L5 19" stroke="#ff8da1" stroke-width="1.6" stroke-linecap="round"/>
      `;
    }
    container.appendChild(fruitSvg);
  }
}

function updateSlotUI(slotKey) {
  const slot = appState.slots[slotKey];
  const p = slot.prefix;
  const isAdv = isAdvancedMode(slotKey);

  const numpad = document.getElementById(`${p}Numpad`);
  const numpadLabel = numpad ? numpad.querySelector('.numpad-display-label') : null;

  const boxAD = document.getElementById(`${p}ValAD`).parentElement;
  const boxBC = document.getElementById(`${p}ValBC`).parentElement;
  const boxDet = document.getElementById(`${p}ValDet`).parentElement;

  // Clear focus styling
  boxAD.classList.remove('tray-box-focus');
  boxBC.classList.remove('tray-box-focus');
  boxDet.classList.remove('tray-box-focus');

  // Solo mode status text banner and guide dash line updates
  if (slotKey === 'solo') {
    const stepTag = document.getElementById('soloStepTag');
    const instruction = document.getElementById('soloInstruction');
    const dashBlue = document.getElementById('soloDashBlue');
    const dashRed = document.getElementById('soloDashRed');

    if (appState.mode === 'solo_serious') {
      // In serious solo mode: NO text hint banners or dash lines
      if (stepTag) stepTag.style.display = 'none';
      if (instruction) instruction.style.display = 'none';
      if (dashBlue) dashBlue.style.display = 'none';
      if (dashRed) dashRed.style.display = 'none';
    } else {
      // In practice mode: show stepTag, instruction, and appropriate dash lines
      if (stepTag) stepTag.style.display = 'inline-block';
      if (instruction) instruction.style.display = 'block';

      if (slot.step === 1) {
        stepTag.className = 'step-tag step-blue';
        stepTag.textContent = 'Langkah 1: Tebas Diagonal (a → d)';
        instruction.textContent = 'Tebas miring dari node a ke node d';
        if (dashBlue) dashBlue.style.display = 'block';
        if (dashRed) dashRed.style.display = 'none';
      } else if (slot.step === '1_input') {
        stepTag.className = 'step-tag step-blue';
        stepTag.textContent = 'Langkah 1: Hitung (a × d)';
        instruction.textContent = 'Masukkan hasil kali node a × d';
        if (dashBlue) dashBlue.style.display = 'none';
        if (dashRed) dashRed.style.display = 'none';
      } else if (slot.step === 2) {
        stepTag.className = 'step-tag step-red';
        stepTag.textContent = 'Langkah 2: Tebas Diagonal (b → c)';
        instruction.textContent = 'Tebas miring dari node b ke node c';
        if (dashBlue) dashBlue.style.display = 'none';
        if (dashRed) dashRed.style.display = 'block';
      } else if (slot.step === '2_input') {
        stepTag.className = 'step-tag step-red';
        stepTag.textContent = 'Langkah 2: Hitung (b × c)';
        instruction.textContent = 'Masukkan hasil kali node b × c';
        if (dashBlue) dashBlue.style.display = 'none';
        if (dashRed) dashRed.style.display = 'none';
      } else if (slot.step === 3) {
        stepTag.className = 'step-tag step-amber';
        stepTag.textContent = 'Langkah 3: Hitung Determinan';
        instruction.textContent = 'Hitung selisih: (a × d) − (b × c)';
        if (dashBlue) dashBlue.style.display = 'none';
        if (dashRed) dashRed.style.display = 'none';
      }
    }
  }

  // Handle visual state per step (Numpad tetap dibawah, hanya disabled state bila belum gilirannya input)
  if (slot.step === 1) {
    setNumpadActive(slotKey, false);
    if (numpadLabel) numpadLabel.textContent = 'Hasil:';
  }
  else if (slot.step === '1_input') {
    // Node a dan d sudah ditebas
    document.getElementById(`${p}_a`).classList.add('node-done-blue');
    document.getElementById(`${p}_d`).classList.add('node-done-blue');
    boxAD.classList.add('tray-box-focus');

    setNumpadActive(slotKey, true);
    if (numpadLabel) numpadLabel.textContent = '(a × d):';
    updateInputDisplay(slotKey);
  }
  else if (slot.step === 2) {
    document.getElementById(`${p}_a`).classList.add('node-done-blue');
    document.getElementById(`${p}_d`).classList.add('node-done-blue');
    if (!isAdv) {
      document.getElementById(`${p}ValAD`).textContent = slot.matrix.a * slot.matrix.d;
    }
    // Numpad tetap dibawah, berikan disabled state agar murid menebas diagonal kedua
    setNumpadActive(slotKey, false);
    if (numpadLabel) numpadLabel.textContent = 'Hasil:';
  }
  else if (slot.step === '2_input') {
    document.getElementById(`${p}_b`).classList.add('node-done-red');
    document.getElementById(`${p}_c`).classList.add('node-done-red');
    boxBC.classList.add('tray-box-focus');

    setNumpadActive(slotKey, true);
    if (numpadLabel) numpadLabel.textContent = '(b × c):';
    updateInputDisplay(slotKey);
  }
  else if (slot.step === 3) {
    document.getElementById(`${p}_b`).classList.add('node-done-red');
    document.getElementById(`${p}_c`).classList.add('node-done-red');
    if (!isAdv) {
      document.getElementById(`${p}ValBC`).textContent = slot.matrix.b * slot.matrix.c;
    }
    boxDet.classList.add('tray-box-focus');

    setNumpadActive(slotKey, true);
    if (numpadLabel) numpadLabel.textContent = 'Hasil:';
    updateInputDisplay(slotKey);
  }
}

/* =========================================================================
   NUMPAD INPUT & MULTI-STEP SUBMISSION
   ========================================================================= */
function pressNumpad(slotKey, key) {
  if (appState.isCountingDown) return;
  const slot = appState.slots[slotKey];
  if (slot.locked || (slot.step !== 3 && slot.step !== '1_input' && slot.step !== '2_input')) return;

  Sound.tap();

  if (key === 'backspace') {
    slot.inputVal = slot.inputVal.slice(0, -1);
  } else if (key === '-') {
    if (slot.inputVal.startsWith('-')) {
      slot.inputVal = slot.inputVal.substring(1);
    } else {
      slot.inputVal = '-' + slot.inputVal;
    }
  } else if (key >= '0' && key <= '9') {
    const digitsOnly = slot.inputVal.replace('-', '');
    if (digitsOnly.length < 2) {
      slot.inputVal += key;
    }
  }

  updateInputDisplay(slotKey);
}

function updateInputDisplay(slotKey) {
  const slot = appState.slots[slotKey];
  const p = slot.prefix;
  const display = document.getElementById(`${p}InputDisplay`);
  if (!display) return;
  display.textContent = slot.inputVal === '' ? ' ' : slot.inputVal;
}

function triggerPlayerFlash(slotKey, isSuccess) {
  let targetEl = null;
  if (slotKey === 'p1') {
    targetEl = document.getElementById('colP1');
  } else if (slotKey === 'p2') {
    targetEl = document.getElementById('colP2');
  } else if (slotKey === 'solo') {
    targetEl = document.getElementById('soloSection');
  }

  if (!targetEl) return;

  targetEl.classList.remove('player-flash-success', 'player-flash-danger');
  void targetEl.offsetWidth; // Force reflow
  targetEl.classList.add(isSuccess ? 'player-flash-success' : 'player-flash-danger');

  setTimeout(() => {
    if (targetEl) {
      targetEl.classList.remove('player-flash-success', 'player-flash-danger');
    }
  }, 480);
}

function submitAnswer(slotKey) {
  if (appState.isCountingDown) return;
  const slot = appState.slots[slotKey];
  if (slot.locked || (slot.step !== 3 && slot.step !== '1_input' && slot.step !== '2_input')) return;
  if (slot.inputVal === '' || slot.inputVal === '-') return;

  Sound.tap();

  const userAns = parseInt(slot.inputVal, 10);
  const p = slot.prefix;

  // 1. SUB-STEP: Input hasil (a × d) sendiri (skor >= 10)
  if (slot.step === '1_input') {
    const correctAD = slot.matrix.a * slot.matrix.d;
    if (userAns === correctAD) {
      triggerPlayerFlash(slotKey, true);
      Sound.success();
      document.getElementById(`${p}ValAD`).textContent = userAns;
      slot.inputVal = '';
      slot.step = 2; // Lanjut menebas diagonal kedua
      updateSlotUI(slotKey);
    } else {
      handleWrongAnswer(slotKey, userAns, correctAD, 'Hasil (a × d)');
    }
    return;
  }

  // 2. SUB-STEP: Input hasil (b × c) sendiri (skor >= 10)
  if (slot.step === '2_input') {
    const correctBC = slot.matrix.b * slot.matrix.c;
    if (userAns === correctBC) {
      triggerPlayerFlash(slotKey, true);
      Sound.success();
      document.getElementById(`${p}ValBC`).textContent = userAns;
      slot.inputVal = '';
      slot.step = 3; // Lanjut menghitung hasil determinan akhir
      updateSlotUI(slotKey);
    } else {
      handleWrongAnswer(slotKey, userAns, correctBC, 'Hasil (b × c)');
    }
    return;
  }

  // 3. STEP 3: Input hasil akhir determinan (ad - bc)
  if (slot.step === 3) {
    const ad = slot.matrix.a * slot.matrix.d;
    const bc = slot.matrix.b * slot.matrix.c;
    const correct = ad - bc;

    if (userAns === correct) {
      triggerPlayerFlash(slotKey, true);
      Sound.fruitSlice(1.2);
      Sound.success();
      slot.score += 2;
      document.getElementById(`${slot.prefix}ScoreText`).textContent = `Skor: ${slot.score}`;

      const boardEl = document.getElementById(slotKey === 'solo' ? 'boardSolo' : (slotKey === 'p1' ? 'boardP1' : 'boardP2'));
      if (boardEl) {
        const rect = boardEl.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        addJuiceSplatter(cx, cy, '#f59e0b');
        addSpark(cx, cy, '#f59e0b', 24);
      }

      showSideToast(
        slotKey,
        'Mantap! Benar',
        `+2 Poin!<br>(${ad}) − (${bc}) = <b>${correct}</b>`,
        false,
        1800
      );

      // Langsung ke soal berikutnya tanpa jeda modal
      initSlot(slotKey);
      if (appState.timeAttack.enabled && (appState.timeAttack.type === 'per_question')) {
        startTimer(true);
      }
    } else {
      handleWrongAnswer(slotKey, userAns, correct, 'Determinan');
    }
  }
}

function handleWrongAnswer(slotKey, userAns, correctTarget, stepName) {
  const slot = appState.slots[slotKey];
  if (!slot || slot.locked) return;

  triggerPlayerFlash(slotKey, false);
  Sound.error();
  slot.lives = Math.max(0, slot.lives - 1);
  renderLives(slotKey);

  const boardEl = document.getElementById(slotKey === 'solo' ? 'boardSolo' : (slotKey === 'p1' ? 'boardP1' : 'boardP2'));
  if (boardEl) {
    boardEl.classList.remove('board-shake');
    void boardEl.offsetWidth;
    boardEl.classList.add('board-shake');
    setTimeout(() => boardEl.classList.remove('board-shake'), 400);
  }

  const isGameOver = (slot.lives <= 0);

  if (isGameOver) {
    slot.locked = true;
    if (appState.mode === 'versus') {
      const elimEl = document.getElementById(`${slot.prefix}EliminatedBanner`);
      if (elimEl) elimEl.style.display = 'flex';

      const otherKey = (slotKey === 'p1') ? 'p2' : 'p1';
      const otherSlot = appState.slots[otherKey];

      if (otherSlot.locked || appState.timeAttack.type !== 'global') {
        stopTimer();
        setTimeout(() => {
          const winnerName = appState.playerNames[otherKey];
          showRoundResult(
            `${winnerName} Menang!`,
            `Nyawa ${appState.playerNames[slotKey]} sudah habis duluan. Pertandingan selesai!`,
            'Main Lagi',
            () => {
              initSlot('p1', true);
              initSlot('p2', true);
              startTimer(false);
            }
          );
        }, 800);
      }
    } else {
      stopTimer();
      showRoundResult(
        'Nyawa Habis!',
        `${stepName} keliru: kamu isi <b>${userAns}</b> (harusnya <b>${correctTarget}</b>).<br>Total skor akhir kamu: <b>${slot.score}</b> poin.`,
        'Main Lagi',
        () => {
          initSlot('solo', true);
          if (appState.timeAttack.enabled && appState.mode === 'solo_serious') {
            startTimer(false);
          }
        }
      );
    }
  } else {
    // Sisa nyawa masih ada: JANGAN KUNCI INPUT, LANGSUNG KE SOAL BERIKUTNYA!
    showSideToast(
      slotKey,
      'Kurang Tepat!',
      `${stepName}: kamu isi <b>${userAns}</b>, harusnya <b>${correctTarget}</b>.<br>Nyawa -1, yuk lanjut soal berikutnya!`,
      false,
      2200
    );

    initSlot(slotKey);
    if (appState.timeAttack.enabled && (appState.timeAttack.type === 'per_question')) {
      startTimer(true);
    }
  }
}

/* =========================================================================
   SALAH STEP TEBAS MENGURANGI NYAWA
   ========================================================================= */
function handleWrongSlash(slotKey, reason) {
  const slot = appState.slots[slotKey];
  if (!slot || slot.locked) return;

  triggerPlayerFlash(slotKey, false);
  Sound.error();
  slot.lives = Math.max(0, slot.lives - 1);
  renderLives(slotKey);

  const boardEl = document.getElementById(slotKey === 'solo' ? 'boardSolo' : (slotKey === 'p1' ? 'boardP1' : 'boardP2'));
  if (boardEl) {
    boardEl.classList.remove('board-shake');
    void boardEl.offsetWidth;
    boardEl.classList.add('board-shake');
    setTimeout(() => boardEl.classList.remove('board-shake'), 400);
  }

  const isGameOver = (slot.lives <= 0);

  if (isGameOver) {
    slot.locked = true;
    if (appState.mode === 'versus') {
      const elimEl = document.getElementById(`${slot.prefix}EliminatedBanner`);
      if (elimEl) elimEl.style.display = 'flex';

      const otherKey = (slotKey === 'p1') ? 'p2' : 'p1';
      const otherSlot = appState.slots[otherKey];
      if (otherSlot.locked || appState.timeAttack.type !== 'global') {
        stopTimer();
        setTimeout(() => {
          const winnerName = appState.playerNames[otherKey];
          showRoundResult(
            `${winnerName} Menang!`,
            `Nyawa ${appState.playerNames[slotKey]} sudah habis duluan. Pertandingan selesai!`,
            'Main Lagi',
            () => {
              initSlot('p1', true);
              initSlot('p2', true);
              runGameCountdown(() => {
                if (appState.timeAttack.enabled) {
                  startTimer(false);
                }
              });
            }
          );
        }, 800);
      }
    } else {
      stopTimer();
      showRoundResult(
        'Nyawa Habis!',
        `${reason}<br>Total skor akhir kamu: <b>${slot.score}</b> poin.`,
        'Main Lagi',
        () => {
          initSlot('solo', true);
          runGameCountdown(() => {
            if (appState.timeAttack.enabled && appState.mode === 'solo_serious') {
              startTimer(false);
            }
          });
        }
      );
    }
  } else {
    // Sisa nyawa masih ada: JANGAN KUNCI INPUT, LANGSUNG KE SOAL BERIKUTNYA!
    showSideToast(
      slotKey,
      'Arah Tebasan Keliru!',
      `${reason}<br>Nyawa -1, yuk lanjut soal berikutnya!`,
      false,
      2200
    );

    initSlot(slotKey);
    if (appState.timeAttack.enabled && (appState.timeAttack.type === 'per_question')) {
      startTimer(true);
    }
  }
}

/* =========================================================================
   TIME ATTACK CONTROLS & TIMERS
   ========================================================================= */
function toggleTimeAttackSettings() {
  const isChecked = document.getElementById('toggleTimeAttack').checked;
  const optBox = document.getElementById('timeAttackOptionsBox');
  const hintEl = document.getElementById('timeAttackHintText');
  if (optBox) optBox.style.display = isChecked ? 'block' : 'none';

  if (!isChecked) {
    if (hintEl) hintEl.textContent = 'Nonaktif';
  } else {
    updateTimeAttackHint();
  }
}

function updateTimeAttackHint() {
  const hintEl = document.getElementById('timeAttackHintText');
  if (!hintEl) return;
  if (appState.timeAttack.type === 'per_question') {
    hintEl.textContent = `${appState.timeAttack.perQuestionDuration} detik per soal`;
  } else {
    hintEl.textContent = `Total ${appState.timeAttack.globalDuration} detik (skor terbanyak menang)`;
  }
}

function setTimeAttackType(type) {
  appState.timeAttack.type = type;

  const tabPerQ = document.getElementById('tabTimePerQuestion');
  const tabGlobal = document.getElementById('tabTimeGlobal');
  const labelEl = document.getElementById('adjusterLabel');
  const dispEl = document.getElementById('timeDurationDisplay');

  if (type === 'per_question') {
    if (tabPerQ) tabPerQ.classList.add('active');
    if (tabGlobal) tabGlobal.classList.remove('active');
    if (labelEl) labelEl.textContent = 'Batas Waktu per Soal:';
    if (dispEl) dispEl.textContent = appState.timeAttack.perQuestionDuration + ' detik';
  } else {
    if (tabPerQ) tabPerQ.classList.remove('active');
    if (tabGlobal) tabGlobal.classList.add('active');
    if (labelEl) labelEl.textContent = 'Total Batas Waktu:';
    if (dispEl) dispEl.textContent = appState.timeAttack.globalDuration + ' detik';
  }
  updateTimeAttackHint();
}

function adjustTime(stepDirection) {
  if (appState.timeAttack.type === 'per_question') {
    let cur = appState.timeAttack.perQuestionDuration + (stepDirection * 5);
    if (cur < 5) cur = 5;
    if (cur > 60) cur = 60;
    appState.timeAttack.perQuestionDuration = cur;
    document.getElementById('timeDurationDisplay').textContent = cur + ' detik';
  } else {
    let cur = appState.timeAttack.globalDuration + (stepDirection * 15);
    if (cur < 30) cur = 30;
    if (cur > 300) cur = 300;
    appState.timeAttack.globalDuration = cur;
    document.getElementById('timeDurationDisplay').textContent = cur + ' detik';
  }
  updateTimeAttackHint();
}

function toggleVersusSetting() {
  const isVersus = document.getElementById('toggleVersusMode').checked;
  const inputP2 = document.getElementById('inputNameP2');

  if (isVersus) {
    if (inputP2) {
      inputP2.disabled = false;
      inputP2.placeholder = 'Nama Pemain 2';
    }
  } else {
    if (inputP2) {
      inputP2.disabled = true;
      inputP2.placeholder = 'Pemain 2 (Nonaktif)';
    }
  }
}

function startTimer(isNextQuestion = false, isResume = false) {
  if (!appState.timeAttack.enabled) return;

  if (isResume) {
    // Pertahankan sisa waktu yang tersimpan
    stopTimer();
  } else if (appState.timeAttack.type === 'global') {
    // Mode waktu keseluruhan: jika ganti soal dan timer masih berjalan, biarkan terus berjalan
    if (isNextQuestion && appState.timeAttack.timerId) {
      return;
    }
    if (!isNextQuestion) {
      stopTimer();
      appState.timeAttack.remaining = appState.timeAttack.globalDuration;
    }
  } else {
    // Mode per soal: reset waktu setiap ada soal baru
    stopTimer();
    appState.timeAttack.remaining = appState.timeAttack.perQuestionDuration;
  }

  updateTimerDisplay();

  if (!appState.timeAttack.timerId) {
    appState.timeAttack.timerId = setInterval(() => {
      appState.timeAttack.remaining -= 1;
      updateTimerDisplay();

      if (appState.timeAttack.remaining <= 0) {
        stopTimer();
        handleTimeUp();
      }
    }, 1000);
  }
}

function stopTimer() {
  if (appState.timeAttack.timerId) {
    clearInterval(appState.timeAttack.timerId);
    appState.timeAttack.timerId = null;
  }
}

function updateTimerDisplay() {
  const rem = appState.timeAttack.remaining;
  const total = (appState.timeAttack.type === 'global')
    ? appState.timeAttack.globalDuration
    : appState.timeAttack.perQuestionDuration;
  const percent = Math.max(0, Math.min(100, (rem / total) * 100));

  let displayTime = rem;
  if (appState.timeAttack.type === 'global' && rem >= 60) {
    const m = Math.floor(rem / 60);
    const s = rem % 60;
    displayTime = `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  const isUrgent = (rem <= 5) || (appState.timeAttack.type === 'global' && rem <= 10);

  // Update Versus timer
  const vVal = document.getElementById('versusTimerVal');
  const vFill = document.getElementById('versusTimerFill');
  if (vVal && vFill) {
    vVal.textContent = displayTime;
    vFill.style.width = percent + '%';
    if (isUrgent) {
      vVal.style.color = 'var(--crimson)';
      vFill.style.background = 'var(--crimson)';
    } else {
      vVal.style.color = 'var(--gold)';
      vFill.style.background = 'linear-gradient(90deg, var(--katana-blue), var(--crimson))';
    }
  }

  // Update Solo timer
  const sVal = document.getElementById('soloTimerVal');
  const sFill = document.getElementById('soloTimerFill');
  if (sVal && sFill) {
    sVal.textContent = displayTime;
    sFill.style.width = percent + '%';
    if (isUrgent) {
      sVal.style.color = 'var(--crimson)';
      sFill.style.background = 'var(--crimson)';
    } else {
      sVal.style.color = 'var(--gold)';
      sFill.style.background = 'linear-gradient(90deg, var(--katana-blue), var(--crimson))';
    }
  }
}

function handleTimeUp() {
  Sound.error();

  if (appState.timeAttack.type === 'global') {
    handleGlobalTimeUp();
  } else {
    if (appState.mode === 'versus') {
      handleVersusTimeUp();
    } else if (appState.mode === 'solo_serious') {
      handleSoloSeriousTimeUp();
    }
  }
}

function handleGlobalTimeUp() {
  Sound.clash();
  appState.slots.solo.locked = true;
  appState.slots.p1.locked = true;
  appState.slots.p2.locked = true;

  if (appState.mode === 'versus') {
    const s1 = appState.slots.p1.score;
    const s2 = appState.slots.p2.score;
    const name1 = appState.playerNames.p1;
    const name2 = appState.playerNames.p2;

    let title, desc;
    if (s1 > s2) {
      title = `${name1} Menang!`;
      desc = `Waktu habis! ${name1} unggul dengan skor ${s1} vs ${s2}.`;
    } else if (s2 > s1) {
      title = `${name2} Menang!`;
      desc = `Waktu habis! ${name2} unggul dengan skor ${s2} vs ${s1}.`;
    } else {
      title = 'Hasil Seri!';
      desc = `Waktu habis! Kalian berdua sama-sama meraih ${s1} poin.`;
    }

    showRoundResult(title, desc, 'Main Lagi', () => {
      initSlot('p1', true);
      initSlot('p2', true);
      runGameCountdown(() => {
        startTimer(false);
      });
    });
  } else {
    showRoundResult('Waktu Habis!', `Waktu latihan selesai. Total skor: <b>${appState.slots.solo.score}</b> poin.`, 'Main Lagi', () => {
      initSlot('solo', true);
      runGameCountdown(() => {
        startTimer(false);
      });
    });
  }
}

function handleSoloSeriousTimeUp() {
  const solo = appState.slots.solo;
  triggerPlayerFlash('solo', false);
  solo.lives = Math.max(0, solo.lives - 1);
  solo.locked = true;
  renderLives('solo');

  showSideToast('solo', 'Waktu Habis!', 'Waktu untuk soal ini keburu habis (-1 nyawa).', false, 2500);

  setTimeout(() => {
    if (solo.lives <= 0) {
      showRoundResult('Nyawa Habis!', `Waktu habis dan semua nyawa telah habis.<br>Skor Akhir: <b>${solo.score}</b> poin.`, 'Main Lagi', () => {
        initSlot('solo', true);
        runGameCountdown(() => {
          startTimer(false);
        });
      });
    } else {
      showRoundResult('Waktu Habis!', 'Waktu soal ini telah habis (-1 nyawa). Yuk lanjut!', 'Soal Berikutnya', () => {
        initSlot('solo');
        startTimer(true);
      });
    }
  }, 1200);
}

function handleVersusTimeUp() {
  const p1 = appState.slots.p1;
  const p2 = appState.slots.p2;

  let p1TimedOut = !p1.locked;
  let p2TimedOut = !p2.locked;

  if (p1TimedOut) {
    triggerPlayerFlash('p1', false);
    p1.lives = Math.max(0, p1.lives - 1);
    p1.locked = true;
    renderLives('p1');
    showSideToast('p1', 'Waktu Habis!', 'Waktu untuk soal ini keburu habis (-1 nyawa).', false, 2500);
    if (p1.lives <= 0) {
      const el = document.getElementById('p1EliminatedBanner');
      if (el) el.style.display = 'flex';
    }
  }

  if (p2TimedOut) {
    triggerPlayerFlash('p2', false);
    p2.lives = Math.max(0, p2.lives - 1);
    p2.locked = true;
    renderLives('p2');
    showSideToast('p2', 'Waktu Habis!', 'Waktu untuk soal ini keburu habis (-1 nyawa).', false, 2500);
    if (p2.lives <= 0) {
      const el = document.getElementById('p2EliminatedBanner');
      if (el) el.style.display = 'flex';
    }
  }

  setTimeout(() => {
    if (p1.lives <= 0 && p2.lives <= 0) {
      showRoundResult('Pertandingan Selesai!', 'Kedua pemain sama-sama kehabisan nyawa.', 'Main Lagi', () => {
        initSlot('p1', true);
        initSlot('p2', true);
        runGameCountdown(() => {
          startTimer(false);
        });
      });
    } else if (p1.lives <= 0) {
      showRoundResult(`${appState.playerNames.p2} Menang!`, 'Nyawa lawan sudah habis duluan.', 'Main Lagi', () => {
        initSlot('p1', true);
        initSlot('p2', true);
        runGameCountdown(() => {
          startTimer(false);
        });
      });
    } else if (p2.lives <= 0) {
      showRoundResult(`${appState.playerNames.p1} Menang!`, 'Nyawa lawan sudah habis duluan.', 'Main Lagi', () => {
        initSlot('p1', true);
        initSlot('p2', true);
        runGameCountdown(() => {
          startTimer(false);
        });
      });
    } else {
      showRoundResult('Waktu Habis!', 'Ronde ini selesai karena waktu habis. Yuk lanjut!', 'Ronde Berikutnya', () => {
        initSlot('p1');
        initSlot('p2');
        startTimer(true);
      });
    }
  }, 1200);
}

/* =========================================================================
   SPLASH SCREEN & FULLSCREEN LAUNCHERS
   ========================================================================= */
function requestAutoFullScreen() {
  const elem = document.documentElement;
  if (!document.fullscreenElement) {
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch(() => {});
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen().catch(() => {});
    }
  }
}

/* =========================================================================
   SESSION PERSISTENCE & RESUME SYSTEM
   ========================================================================= */
let pendingLaunchMode = 'play'; // 'play' or 'practice'

function isValidSession(data) {
  if (!data || typeof data !== 'object') return false;
  if (!['practice', 'solo_serious', 'versus'].includes(data.mode)) return false;
  if (!data.slots || typeof data.slots !== 'object') return false;

  if (data.mode === 'versus') {
    if (!data.slots.p1 || !data.slots.p2) return false;
    if (!data.slots.p1.matrix || !data.slots.p2.matrix) return false;
    if (data.slots.p1.lives <= 0 && data.slots.p2.lives <= 0) return false;
  } else {
    if (!data.slots.solo || !data.slots.solo.matrix) return false;
    if (data.mode === 'solo_serious' && data.slots.solo.lives <= 0) return false;
  }
  return true;
}

function saveCurrentSession() {
  if (appState.mode !== 'practice' && appState.mode !== 'solo_serious' && appState.mode !== 'versus') {
    return;
  }
  // Jangan simpan sesi jika semua nyawa sudah habis / pertandingan selesai
  if (appState.mode === 'versus') {
    if (appState.slots.p1.lives <= 0 && appState.slots.p2.lives <= 0) {
      clearSavedSession();
      return;
    }
  } else if (appState.mode === 'solo_serious') {
    if (appState.slots.solo.lives <= 0) {
      clearSavedSession();
      return;
    }
  }

  const sessionData = {
    mode: appState.mode,
    playerNames: { ...appState.playerNames },
    timeAttack: {
      enabled: appState.timeAttack.enabled,
      type: appState.timeAttack.type,
      perQuestionDuration: appState.timeAttack.perQuestionDuration,
      globalDuration: appState.timeAttack.globalDuration,
      remaining: appState.timeAttack.remaining
    },
    slots: JSON.parse(JSON.stringify(appState.slots)),
    savedAt: Date.now()
  };
  try {
    localStorage.setItem('ninja_saved_session', JSON.stringify(sessionData));
  } catch (e) {
    appState._inMemorySavedSession = sessionData;
  }
}

function getSavedSession() {
  try {
    const raw = localStorage.getItem('ninja_saved_session');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (isValidSession(parsed)) {
        return parsed;
      } else {
        clearSavedSession();
      }
    }
  } catch (e) {
    clearSavedSession();
  }
  if (appState._inMemorySavedSession && isValidSession(appState._inMemorySavedSession)) {
    return appState._inMemorySavedSession;
  }
  return null;
}

function clearSavedSession() {
  try {
    localStorage.removeItem('ninja_saved_session');
  } catch (e) {}
  appState._inMemorySavedSession = null;
}

function promptResumeSession(targetMode) {
  const saved = getSavedSession();
  if (!saved) return false;

  pendingLaunchMode = targetMode;
  const infoCard = document.getElementById('sessionInfoCard');

  let modeLabel = '';
  let detailsHtml = '';

  const p1Name = (saved.playerNames && saved.playerNames.p1) || 'Pemain 1';
  const p2Name = (saved.playerNames && saved.playerNames.p2) || 'Pemain 2';
  const soloName = (saved.playerNames && saved.playerNames.solo) || 'Pemain';

  if (saved.mode === 'versus') {
    modeLabel = 'Duel 1 vs 1';
    const s1 = (saved.slots && saved.slots.p1) ? saved.slots.p1.score : 0;
    const l1 = (saved.slots && saved.slots.p1) ? saved.slots.p1.lives : 0;
    const s2 = (saved.slots && saved.slots.p2) ? saved.slots.p2.score : 0;
    const l2 = (saved.slots && saved.slots.p2) ? saved.slots.p2.lives : 0;

    detailsHtml = `
      <div class="session-info-row">
        <span class="session-info-label">Mode:</span>
        <span class="session-info-val" style="color: var(--crimson);">${modeLabel}</span>
      </div>
      <div class="session-info-row">
        <span class="session-info-label">Pemain 1:</span>
        <span class="session-info-val">${p1Name} (${s1} Poin, ${l1} Nyawa)</span>
      </div>
      <div class="session-info-row">
        <span class="session-info-label">Pemain 2:</span>
        <span class="session-info-val">${p2Name} (${s2} Poin, ${l2} Nyawa)</span>
      </div>
    `;
  } else if (saved.mode === 'solo_serious') {
    modeLabel = 'Bermain Solo';
    const sSolo = (saved.slots && saved.slots.solo) ? saved.slots.solo.score : 0;
    const lSolo = (saved.slots && saved.slots.solo) ? saved.slots.solo.lives : 0;

    detailsHtml = `
      <div class="session-info-row">
        <span class="session-info-label">Mode:</span>
        <span class="session-info-val" style="color: var(--gold);">${modeLabel}</span>
      </div>
      <div class="session-info-row">
        <span class="session-info-label">Pemain:</span>
        <span class="session-info-val">${soloName}</span>
      </div>
      <div class="session-info-row">
        <span class="session-info-label">Skor / Nyawa:</span>
        <span class="session-info-val">${sSolo} Poin | ${lSolo} Nyawa</span>
      </div>
    `;
  } else {
    modeLabel = 'Mode Latihan';
    const sSolo = (saved.slots && saved.slots.solo) ? saved.slots.solo.score : 0;

    detailsHtml = `
      <div class="session-info-row">
        <span class="session-info-label">Mode:</span>
        <span class="session-info-val" style="color: var(--katana-blue);">${modeLabel}</span>
      </div>
      <div class="session-info-row">
        <span class="session-info-label">Skor Latihan:</span>
        <span class="session-info-val">${sSolo} Poin</span>
      </div>
    `;
  }

  if (saved.timeAttack && saved.timeAttack.enabled) {
    const timeLabel = (saved.timeAttack.type === 'global') ? 'Total Waktu' : 'Waktu per Soal';
    detailsHtml += `
      <div class="session-info-row">
        <span class="session-info-label">Time Attack (${timeLabel}):</span>
        <span class="session-info-val" style="color: var(--gold);">${saved.timeAttack.remaining} detik tersisa</span>
      </div>
    `;
  }

  if (infoCard) infoCard.innerHTML = detailsHtml;

  const modal = document.getElementById('sessionPromptModal');
  if (modal) modal.style.display = 'flex';
  return true;
}

function closeSessionPromptModal() {
  const modal = document.getElementById('sessionPromptModal');
  if (modal) modal.style.display = 'none';
}

function confirmStartNewSession() {
  closeSessionPromptModal();
  clearSavedSession();
  if (pendingLaunchMode === 'practice') {
    startFreshPracticeMode();
  } else {
    startFreshPlayMode();
  }
}

function confirmResumeSession() {
  const saved = getSavedSession();
  if (!saved) {
    closeSessionPromptModal();
    return;
  }
  closeSessionPromptModal();
  requestAutoFullScreen();

  appState.mode = saved.mode;
  appState.playerNames = { ...saved.playerNames };
  appState.timeAttack = { ...saved.timeAttack };
  appState.slots = JSON.parse(JSON.stringify(saved.slots));

  document.getElementById('splashScreen').style.display = 'none';
  document.getElementById('floatingControls').style.display = 'flex';

  if (appState.mode === 'versus') {
    document.getElementById('p1PlayerName').textContent = appState.playerNames.p1;
    document.getElementById('p2PlayerName').textContent = appState.playerNames.p2;

    document.getElementById('soloSection').style.display = 'none';
    document.getElementById('versusSection').style.display = 'flex';
    document.getElementById('soloTimerContainer').style.display = 'none';
    document.getElementById('versusTimerContainer').style.display = appState.timeAttack.enabled ? 'flex' : 'none';

    restoreSlotDOM('p1');
    restoreSlotDOM('p2');
  } else {
    document.getElementById('soloPlayerName').textContent = appState.playerNames.solo;

    document.getElementById('soloSection').style.display = 'flex';
    document.getElementById('versusSection').style.display = 'none';
    document.getElementById('versusTimerContainer').style.display = 'none';
    document.getElementById('soloTimerContainer').style.display = (appState.timeAttack.enabled && appState.mode === 'solo_serious') ? 'flex' : 'none';

    restoreSlotDOM('solo');
  }

  runGameCountdown(() => {
    if (appState.timeAttack.enabled) {
      startTimer(false, true);
    }
  });

  Sound.slash(1.1);
}

function restoreSlotDOM(slotKey) {
  const slot = appState.slots[slotKey];
  if (!slot || !slot.matrix) return;
  const p = slot.prefix || slotKey;

  const elA = document.getElementById(`${p}_a`);
  const elB = document.getElementById(`${p}_b`);
  const elC = document.getElementById(`${p}_c`);
  const elD = document.getElementById(`${p}_d`);

  if (elA) elA.querySelector('.node-val').textContent = slot.matrix.a;
  if (elB) elB.querySelector('.node-val').textContent = slot.matrix.b;
  if (elC) elC.querySelector('.node-val').textContent = slot.matrix.c;
  if (elD) elD.querySelector('.node-val').textContent = slot.matrix.d;

  const scoreEl = document.getElementById(`${p}ScoreText`);
  if (scoreEl) scoreEl.textContent = `Skor: ${slot.score}`;

  renderLives(slotKey);

  ['a', 'b', 'c', 'd'].forEach(pos => {
    const el = document.getElementById(`${p}_${pos}`);
    if (el) el.className = 'node';
  });

  const valAD = document.getElementById(`${p}ValAD`);
  const valBC = document.getElementById(`${p}ValBC`);
  const valDet = document.getElementById(`${p}ValDet`);

  if (slot.step === '1_input' || slot.step === 2 || slot.step === '2_input' || slot.step === 3) {
    if (elA) elA.classList.add('node-done-blue');
    if (elD) elD.classList.add('node-done-blue');
    if (valAD) valAD.textContent = slot.matrix.a * slot.matrix.d;
  } else {
    if (valAD) valAD.textContent = '-';
  }

  if (slot.step === '2_input' || slot.step === 3) {
    if (elB) elB.classList.add('node-done-red');
    if (elC) elC.classList.add('node-done-red');
    if (valBC) valBC.textContent = slot.matrix.b * slot.matrix.c;
  } else {
    if (valBC) valBC.textContent = '-';
  }

  if (valDet) valDet.textContent = '-';

  updateInputDisplay(slotKey);
  updateSlotUI(slotKey);
}

function launchPracticeMode() {
  if (getSavedSession()) {
    promptResumeSession('practice');
    return;
  }
  startFreshPracticeMode();
}

function startFreshPracticeMode() {
  requestAutoFullScreen();
  stopTimer();
  clearSavedSession();
  appState.mode = 'practice';
  appState.timeAttack.enabled = false;

  appState.playerNames.solo = 'Latihan';
  document.getElementById('soloPlayerName').textContent = 'Latihan';

  document.getElementById('splashScreen').style.display = 'none';
  document.getElementById('floatingControls').style.display = 'flex';
  document.getElementById('soloSection').style.display = 'flex';
  document.getElementById('versusSection').style.display = 'none';
  document.getElementById('soloTimerContainer').style.display = 'none';
  document.getElementById('versusTimerContainer').style.display = 'none';

  initSlot('solo', true);
  runGameCountdown();
}

function launchPlayMode() {
  if (getSavedSession()) {
    promptResumeSession('play');
    return;
  }
  startFreshPlayMode();
}

function startFreshPlayMode() {
  requestAutoFullScreen();
  clearSavedSession();

  const isVersus = document.getElementById('toggleVersusMode').checked;
  const isTimeAttack = document.getElementById('toggleTimeAttack').checked;
  const nameP1 = document.getElementById('inputNameP1').value.trim() || 'Pemain 1';
  const nameP2 = document.getElementById('inputNameP2').value.trim() || 'Pemain 2';

  appState.timeAttack.enabled = isTimeAttack;

  document.getElementById('splashScreen').style.display = 'none';
  document.getElementById('floatingControls').style.display = 'flex';

  if (isVersus) {
    appState.mode = 'versus';
    appState.playerNames.p1 = nameP1;
    appState.playerNames.p2 = nameP2;

    document.getElementById('p1PlayerName').textContent = nameP1;
    document.getElementById('p2PlayerName').textContent = nameP2;

    document.getElementById('soloSection').style.display = 'none';
    document.getElementById('versusSection').style.display = 'flex';
    document.getElementById('soloTimerContainer').style.display = 'none';
    document.getElementById('versusTimerContainer').style.display = isTimeAttack ? 'flex' : 'none';

    initSlot('p1', true);
    initSlot('p2', true);

    runGameCountdown(() => {
      if (isTimeAttack) {
        startTimer(false);
      }
    });
  } else {
    // Mode Serius 1 Pemain
    appState.mode = 'solo_serious';
    appState.playerNames.solo = nameP1;

    document.getElementById('soloPlayerName').textContent = nameP1;

    document.getElementById('soloSection').style.display = 'flex';
    document.getElementById('versusSection').style.display = 'none';
    document.getElementById('versusTimerContainer').style.display = 'none';
    document.getElementById('soloTimerContainer').style.display = isTimeAttack ? 'flex' : 'none';

    initSlot('solo', true);

    runGameCountdown(() => {
      if (isTimeAttack) {
        startTimer(false);
      }
    });
  }
}

function launchSoloMode() {
  launchPracticeMode();
}

function launchVersusMode() {
  launchPlayMode();
}

function exitToSplash(skipSave = false) {
  stopGameCountdown();
  if (!skipSave) {
    saveCurrentSession();
  }
  stopTimer();
  document.getElementById('splashScreen').style.display = 'flex';
  document.getElementById('floatingControls').style.display = 'none';
  document.getElementById('roundResultCard').style.display = 'none';
  const promptModal = document.getElementById('sessionPromptModal');
  if (promptModal) promptModal.style.display = 'none';
  document.getElementById('soloTimerContainer').style.display = 'none';
  document.getElementById('versusTimerContainer').style.display = 'none';

  const p1Elim = document.getElementById('p1EliminatedBanner');
  if (p1Elim) p1Elim.style.display = 'none';
  const p2Elim = document.getElementById('p2EliminatedBanner');
  if (p2Elim) p2Elim.style.display = 'none';
}

/* =========================================================================
   ROUND RESULT MODAL HANDLERS
   ========================================================================= */
let nextActionCallback = null;

function showRoundResult(title, desc, buttonLabel, callback) {
  clearSavedSession();
  const titleEl = document.getElementById('roundResultTitle');
  const descEl = document.getElementById('roundResultDesc');
  if (titleEl) titleEl.textContent = title;
  if (descEl) descEl.innerHTML = desc;

  const btnReplay = document.getElementById('btnNextRound');
  if (btnReplay) {
    btnReplay.innerHTML = `
      <svg viewBox="0 0 24 24" class="btn-svg-icon"><path d="M21 12a9 9 0 1 1-2.64-6.36L21 8m0-5v5h-5"/></svg>
      ${buttonLabel}
    `;
  }
  nextActionCallback = callback;

  const scoreCompEl = document.getElementById('resultScoreComparison');
  const soloSummEl = document.getElementById('resultSoloSummary');
  const badgeLabelEl = document.getElementById('resultBadgeLabel');

  if (appState.mode === 'versus') {
    if (scoreCompEl) scoreCompEl.style.display = 'flex';
    if (soloSummEl) soloSummEl.style.display = 'none';

    const s1 = appState.slots.p1.score;
    const s2 = appState.slots.p2.score;
    const name1 = appState.playerNames.p1;
    const name2 = appState.playerNames.p2;

    const elP1Name = document.getElementById('resultP1Name');
    const elP2Name = document.getElementById('resultP2Name');
    const elP1Score = document.getElementById('resultP1Score');
    const elP2Score = document.getElementById('resultP2Score');
    const elP1Tag = document.getElementById('resultP1Tag');
    const elP2Tag = document.getElementById('resultP2Tag');
    const colP1 = document.getElementById('resultColP1');
    const colP2 = document.getElementById('resultColP2');

    if (elP1Name) elP1Name.textContent = name1;
    if (elP2Name) elP2Name.textContent = name2;
    if (elP1Score) elP1Score.textContent = s1;
    if (elP2Score) elP2Score.textContent = s2;

    if (colP1) colP1.classList.remove('winner-card', 'loser-card');
    if (colP2) colP2.classList.remove('winner-card', 'loser-card');

    if (s1 > s2) {
      if (badgeLabelEl) badgeLabelEl.textContent = 'MENANG TELAK!';
      if (colP1) colP1.classList.add('winner-card');
      if (colP2) colP2.classList.add('loser-card');
      if (elP1Tag) elP1Tag.textContent = 'Pemenang';
      if (elP2Tag) elP2Tag.textContent = 'Kalah';
    } else if (s2 > s1) {
      if (badgeLabelEl) badgeLabelEl.textContent = 'MENANG TELAK!';
      if (colP2) colP2.classList.add('winner-card');
      if (colP1) colP1.classList.add('loser-card');
      if (elP2Tag) elP2Tag.textContent = 'Pemenang';
      if (elP1Tag) elP1Tag.textContent = 'Kalah';
    } else {
      if (badgeLabelEl) badgeLabelEl.textContent = 'HASIL SERI!';
      if (elP1Tag) elP1Tag.textContent = 'Seri';
      if (elP2Tag) elP2Tag.textContent = 'Seri';
    }
  } else {
    // Mode Latihan atau Solo Serius
    if (scoreCompEl) scoreCompEl.style.display = 'none';
    if (soloSummEl) soloSummEl.style.display = 'flex';

    if (badgeLabelEl) {
      badgeLabelEl.textContent = (appState.mode === 'solo_serious') ? 'SKOR AKHIR' : 'HASIL LATIHAN';
    }

    const soloScoreVal = document.getElementById('resultSoloScoreVal');
    if (soloScoreVal) {
      soloScoreVal.textContent = appState.slots.solo.score;
    }
  }

  const modalEl = document.getElementById('roundResultCard');
  if (modalEl) modalEl.style.display = 'flex';
}

function closeRoundResult() {
  document.getElementById('roundResultCard').style.display = 'none';
  if (typeof nextActionCallback === 'function') {
    const cb = nextActionCallback;
    nextActionCallback = null;
    cb();
  }
}

function exitToSplashFromModal() {
  clearSavedSession();
  document.getElementById('roundResultCard').style.display = 'none';
  nextActionCallback = null;
  exitToSplash(true);
}

function resetCurrentProblems() {
  if (appState.mode === 'versus') {
    initSlot('p1', false);
    initSlot('p2', false);
    if (appState.timeAttack.enabled) {
      startTimer(true);
    }
  } else {
    initSlot('solo', false);
    if (appState.timeAttack.enabled && appState.mode === 'solo_serious') {
      startTimer(true);
    }
  }
}

/* =========================================================================
   MULTI-TOUCH GESTURE DETECTION (PID Screen)
   ========================================================================= */
const activePointers = new Map();

function getElementNodeInfo(x, y) {
  const elements = document.elementsFromPoint(x, y);
  for (const el of elements) {
    if (el.classList.contains('node')) {
      const arenaEl = el.closest('.matrix-board');
      const arenaKey = arenaEl ? arenaEl.dataset.arena : null;
      return { pos: el.dataset.pos, arena: arenaKey, element: el };
    }
  }
  return null;
}

function getArenaUnderPoint(x, y) {
  const elements = document.elementsFromPoint(x, y);
  for (const el of elements) {
    if (el.classList.contains('matrix-board')) {
      return el.dataset.arena;
    }
  }
  return null;
}

function onPointerStart(id, x, y) {
  if (appState.isCountingDown) return;
  const arena = getArenaUnderPoint(x, y);
  if (!arena) return;

  const slot = appState.slots[arena];
  // Hanya bisa menebas jika di step 1 atau step 2 (bukan saat sedang input numpad)
  if (!slot || (slot.step !== 1 && slot.step !== 2) || slot.locked) return;

  const slashColor = (slot.step === 1) ? '#00d2ff' : '#e63946';
  const pointerState = {
    arena,
    visited: new Set(),
    color: slashColor
  };

  const nodeInfo = getElementNodeInfo(x, y);
  if (nodeInfo && nodeInfo.arena === arena) {
    pointerState.visited.add(nodeInfo.pos);
  }

  activePointers.set(id, pointerState);
  addTrailPoint(x, y, slashColor);
  Sound.slash(slot.step === 1 ? 1.05 : 0.85);
}

function onPointerMove(id, x, y) {
  const state = activePointers.get(id);
  if (!state) return;

  addTrailPoint(x, y, state.color);

  const nodeInfo = getElementNodeInfo(x, y);
  if (nodeInfo && nodeInfo.arena === state.arena) {
    state.visited.add(nodeInfo.pos);
  }
}

function onPointerEnd(id) {
  const state = activePointers.get(id);
  if (!state) return;

  const slot = appState.slots[state.arena];
  if (slot && !slot.locked) {
    const visited = state.visited;
    const isAdv = isAdvancedMode(state.arena);

    if (visited.size >= 2) {
      if (slot.step === 1) {
        if (visited.has('a') && visited.has('d')) {
          triggerPlayerFlash(state.arena, true);
          Sound.fruitSlice(1.15);
          const boardEl = document.getElementById(state.arena === 'solo' ? 'boardSolo' : (state.arena === 'p1' ? 'boardP1' : 'boardP2'));
          const rect = boardEl ? boardEl.getBoundingClientRect() : { left: window.innerWidth / 2, top: window.innerHeight / 2, width: 0, height: 0 };
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          addSpark(cx, cy, '#00d2ff', 24);
          addJuiceSplatter(cx, cy, '#00d2ff');

          if (isAdv) {
            slot.step = '1_input'; // Menunggu murid memasukkan nilai a * d sendiri via numpad
          } else {
            slot.step = 2; // Otomatis lanjut ke diagonal kedua
          }
          updateSlotUI(state.arena);
        } else {
          handleWrongSlash(state.arena, 'Tebas miring dari node <b>a</b> ke <b>d</b> dulu ya!');
        }
      } 
      else if (slot.step === 2) {
        if (visited.has('b') && visited.has('c')) {
          triggerPlayerFlash(state.arena, true);
          Sound.fruitSlice(0.95);
          const boardEl = document.getElementById(state.arena === 'solo' ? 'boardSolo' : (state.arena === 'p1' ? 'boardP1' : 'boardP2'));
          const rect = boardEl ? boardEl.getBoundingClientRect() : { left: window.innerWidth / 2, top: window.innerHeight / 2, width: 0, height: 0 };
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          addSpark(cx, cy, '#ff2a5f', 24);
          addJuiceSplatter(cx, cy, '#ff2a5f');

          if (isAdv) {
            slot.step = '2_input'; // Menunggu murid memasukkan nilai b * c sendiri via numpad
          } else {
            slot.step = 3; // Otomatis lanjut ke pengurangan akhir
          }
          updateSlotUI(state.arena);
        } else {
          handleWrongSlash(state.arena, 'Tebas miring dari node <b>b</b> ke <b>c</b>!');
        }
      }
    }
  }

  activePointers.delete(id);
}

// Touch Event Listeners
window.addEventListener('touchstart', (e) => {
  for (let i = 0; i < e.changedTouches.length; i++) {
    const t = e.changedTouches[i];
    onPointerStart(t.identifier, t.clientX, t.clientY);
  }
}, { passive: false });

window.addEventListener('touchmove', (e) => {
  for (let i = 0; i < e.changedTouches.length; i++) {
    const t = e.changedTouches[i];
    onPointerMove(t.identifier, t.clientX, t.clientY);
  }
}, { passive: false });

window.addEventListener('touchend', (e) => {
  for (let i = 0; i < e.changedTouches.length; i++) {
    const t = e.changedTouches[i];
    onPointerEnd(t.identifier);
  }
}, { passive: false });

window.addEventListener('touchcancel', (e) => {
  for (let i = 0; i < e.changedTouches.length; i++) {
    const t = e.changedTouches[i];
    onPointerEnd(t.identifier);
  }
}, { passive: false });

// Mouse Listeners
let isMouseDown = false;
window.addEventListener('mousedown', (e) => {
  isMouseDown = true;
  onPointerStart('mouse', e.clientX, e.clientY);
});
window.addEventListener('mousemove', (e) => {
  if (!isMouseDown) return;
  onPointerMove('mouse', e.clientX, e.clientY);
});
window.addEventListener('mouseup', () => {
  if (!isMouseDown) return;
  isMouseDown = false;
  onPointerEnd('mouse');
});
