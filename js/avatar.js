// ===== CAREERBOOST AI - AI AVATAR ENGINE =====

const Avatar = (() => {
  let talkInterval = null;
  let blinkInterval = null;
  let state = 'idle'; // idle | thinking | speaking | listening

  // ── BUILD AVATAR SVG ──────────────────────────────────
  function buildHTML() {
    return `
    <div class="avatar-wrap" id="avatar-wrap">
      <div class="avatar-bg-glow"></div>

      <!-- Avatar SVG Person -->
      <div class="avatar-figure">
        <svg id="avatar-svg" viewBox="0 0 160 220" xmlns="http://www.w3.org/2000/svg">
          <!-- Suit body -->
          <rect x="30" y="140" width="100" height="80" rx="12" fill="#1e293b"/>
          <!-- Shirt/tie area -->
          <rect x="67" y="140" width="26" height="50" rx="3" fill="#f8fafc"/>
          <!-- Tie -->
          <polygon points="80,148 74,155 80,185 86,155" fill="#7c3aed"/>
          <!-- Collar left -->
          <polygon points="67,140 55,148 67,160" fill="#f8fafc"/>
          <!-- Collar right -->
          <polygon points="93,140 105,148 93,160" fill="#f8fafc"/>
          <!-- Left shoulder -->
          <ellipse cx="40" cy="148" rx="20" ry="14" fill="#1e293b"/>
          <!-- Right shoulder -->
          <ellipse cx="120" cy="148" rx="20" ry="14" fill="#1e293b"/>

          <!-- Neck -->
          <rect x="70" y="124" width="20" height="22" rx="6" fill="#f5c5a3"/>

          <!-- Head -->
          <ellipse id="av-head" cx="80" cy="100" rx="42" ry="48" fill="#f5c5a3"/>

          <!-- Hair -->
          <ellipse cx="80" cy="60" rx="42" ry="20" fill="#3b2a1a"/>
          <rect x="38" y="60" width="84" height="18" rx="4" fill="#3b2a1a"/>
          <!-- Side hair -->
          <ellipse cx="39" cy="90" rx="8" ry="22" fill="#3b2a1a"/>
          <ellipse cx="121" cy="90" rx="8" ry="22" fill="#3b2a1a"/>

          <!-- Ears -->
          <ellipse cx="38" cy="102" rx="7" ry="10" fill="#f0b090"/>
          <ellipse cx="122" cy="102" rx="7" ry="10" fill="#f0b090"/>

          <!-- Eyebrows -->
          <path d="M56 84 Q64 80 72 84" stroke="#3b2a1a" stroke-width="3" fill="none" stroke-linecap="round"/>
          <path d="M88 84 Q96 80 104 84" stroke="#3b2a1a" stroke-width="3" fill="none" stroke-linecap="round"/>

          <!-- Eyes (with blink animation) -->
          <g id="av-eye-left">
            <ellipse cx="64" cy="96" rx="9" ry="9" fill="white"/>
            <ellipse cx="64" cy="97" rx="5" ry="5" fill="#2d4a8a"/>
            <ellipse cx="64" cy="97" rx="3" ry="3" fill="#111"/>
            <ellipse cx="62" cy="95" rx="1.5" ry="1.5" fill="white"/>
            <!-- Eyelid for blink -->
            <ellipse id="av-blink-left" cx="64" cy="96" rx="9" ry="0" fill="#f5c5a3"/>
          </g>
          <g id="av-eye-right">
            <ellipse cx="96" cy="96" rx="9" ry="9" fill="white"/>
            <ellipse cx="96" cy="97" rx="5" ry="5" fill="#2d4a8a"/>
            <ellipse cx="96" cy="97" rx="3" ry="3" fill="#111"/>
            <ellipse cx="94" cy="95" rx="1.5" ry="1.5" fill="white"/>
            <!-- Eyelid for blink -->
            <ellipse id="av-blink-right" cx="96" cy="96" rx="9" ry="0" fill="#f5c5a3"/>
          </g>

          <!-- Nose -->
          <path d="M78 106 Q80 114 82 106" stroke="#d4956a" stroke-width="2" fill="none" stroke-linecap="round"/>
          <path d="M74 114 Q80 118 86 114" stroke="#d4956a" stroke-width="2" fill="none" stroke-linecap="round"/>

          <!-- Mouth — changes shape based on state -->
          <g id="av-mouth">
            <!-- Lips background -->
            <ellipse id="av-mouth-bg" cx="80" cy="126" rx="14" ry="5" fill="#c07850"/>
            <!-- Upper lip -->
            <path id="av-mouth-top" d="M66 124 Q80 120 94 124" stroke="#a05530" stroke-width="1.5" fill="#d4956a" stroke-linecap="round"/>
            <!-- Inner (dark opening) — changes height when talking -->
            <ellipse id="av-mouth-open" cx="80" cy="127" rx="10" ry="0" fill="#2d1a0a"/>
            <!-- Lower lip -->
            <path id="av-mouth-bot" d="M66 127 Q80 132 94 127" fill="#c07850" stroke="none"/>
          </g>

          <!-- Smile dimples (shown when idle/good state) -->
          <circle id="av-dimple-l" cx="58" cy="118" r="2" fill="#e0a080" opacity="0.6"/>
          <circle id="av-dimple-r" cx="102" cy="118" r="2" fill="#e0a080" opacity="0.6"/>
        </svg>

        <!-- Status indicator ring around avatar -->
        <div class="avatar-status-ring" id="avatar-ring"></div>
      </div>

      <!-- State label -->
      <div class="avatar-state-label" id="avatar-state-label">
        <span class="avatar-state-dot" id="avatar-dot"></span>
        <span id="avatar-state-text">Ready</span>
      </div>
    </div>`;
  }

  // ── BLINK ANIMATION ───────────────────────────────────
  function startBlink() {
    stopBlink();
    function doBlink() {
      const bl = document.getElementById('av-blink-left');
      const br = document.getElementById('av-blink-right');
      if (!bl || !br) return;
      // Close eyes
      bl.setAttribute('ry', '9');
      br.setAttribute('ry', '9');
      setTimeout(() => {
        bl.setAttribute('ry', '0');
        br.setAttribute('ry', '0');
      }, 120);
    }
    doBlink();
    blinkInterval = setInterval(doBlink, Math.random() * 2000 + 2500);
  }

  function stopBlink() {
    if (blinkInterval) { clearInterval(blinkInterval); blinkInterval = null; }
  }

  // ── TALK ANIMATION ────────────────────────────────────
  function startTalk() {
    stopTalk();
    let open = false;
    talkInterval = setInterval(() => {
      const m = document.getElementById('av-mouth-open');
      if (!m) return;
      open = !open;
      m.setAttribute('ry', open ? (2 + Math.random() * 4).toFixed(1) : '0');
    }, 120);
  }

  function stopTalk() {
    if (talkInterval) { clearInterval(talkInterval); talkInterval = null; }
    const m = document.getElementById('av-mouth-open');
    if (m) m.setAttribute('ry', '0');
  }

  // ── STATE MACHINE ─────────────────────────────────────
  function setState(newState) {
    state = newState;
    const ring   = document.getElementById('avatar-ring');
    const dot    = document.getElementById('avatar-dot');
    const label  = document.getElementById('avatar-state-text');
    const wrap   = document.getElementById('avatar-wrap');

    if (!ring) return;

    // Remove all state classes
    wrap?.classList.remove('av-idle','av-thinking','av-speaking','av-listening');

    switch(newState) {
      case 'idle':
        wrap?.classList.add('av-idle');
        ring.className = 'avatar-status-ring ring-idle';
        if (dot) dot.className = 'avatar-state-dot dot-idle';
        if (label) label.textContent = 'Ready';
        stopTalk();
        startBlink();
        break;

      case 'thinking':
        wrap?.classList.add('av-thinking');
        ring.className = 'avatar-status-ring ring-thinking';
        if (dot) dot.className = 'avatar-state-dot dot-thinking';
        if (label) label.textContent = 'Thinking...';
        stopTalk();
        startBlink();
        break;

      case 'speaking':
        wrap?.classList.add('av-speaking');
        ring.className = 'avatar-status-ring ring-speaking';
        if (dot) dot.className = 'avatar-state-dot dot-speaking';
        if (label) label.textContent = 'Speaking...';
        startTalk();
        startBlink();
        break;

      case 'listening':
        wrap?.classList.add('av-listening');
        ring.className = 'avatar-status-ring ring-listening';
        if (dot) dot.className = 'avatar-state-dot dot-listening';
        if (label) label.textContent = 'Listening to you...';
        stopTalk();
        startBlink();
        break;
    }
  }

  // ── SPEAK with avatar animation ───────────────────────
  function avatarSpeak(text, onDone) {
    setState('speaking');
    speak(text,
      () => setState('speaking'),
      () => { stopTalk(); setState('idle'); onDone && onDone(); }
    );
  }

  // ── PUBLIC API ────────────────────────────────────────
  return {
    buildHTML,
    setState,
    speak: avatarSpeak,
    startBlink,
    stopBlink,
    startTalk,
    stopTalk
  };
})();
