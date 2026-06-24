// ===== CAREERBOOST AI - CORE APP JS =====

// ── API KEYS ──────────────────────────────────────────────
const GROQ_KEY_STORAGE   = 'cb_groq_key';
const GEMINI_KEY_STORAGE = 'cb_api_key';  // keep old name for compatibility

function getGroqKey()    { return localStorage.getItem(GROQ_KEY_STORAGE)   || ''; }
function getGeminiKey()  { return localStorage.getItem(GEMINI_KEY_STORAGE) || ''; }
function saveGroqKey(k)  { localStorage.setItem(GROQ_KEY_STORAGE,   k.trim()); }
function saveGeminiKey(k){ localStorage.setItem(GEMINI_KEY_STORAGE, k.trim()); }
function hasApiKey()     { return !!(getGroqKey() || getGeminiKey()); }

// ── GROQ API (Primary — Free, Fast, Llama 3) ─────────────
async function callGroq(prompt, systemPrompt = '') {
  const key = getGroqKey();
  if (!key) return null; // signal: no groq key, try fallback

  const messages = [];
  if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
  messages.push({ role: 'user', content: prompt });

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages,
        temperature: 0.7,
        max_tokens: 4096
      })
    });

    if (res.ok) {
      const data = await res.json();
      return data.choices?.[0]?.message?.content || '';
    }

    const err = await res.json().catch(() => ({}));
    const status = res.status;
    if (status === 401 || status === 403) {
      showToast('❌ Invalid Groq key. Please update it.', 'error', 5000);
      return null;
    }
    if (status === 429) {
      showToast('⚠️ Groq rate limit hit, trying Gemini...', 'info', 2500);
      return null; // fallback to gemini
    }
    return null;
  } catch(e) {
    return null; // network error — try gemini
  }
}

// ── GEMINI API (Fallback) ────────────────────────────────
async function callGemini(prompt, systemPrompt = '', jsonMode = false) {
  const key = getGeminiKey();
  if (!key) throw new Error('No API key');

  const body = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.7, maxOutputTokens: 4096 }
  };
  if (systemPrompt) body.systemInstruction = { parts: [{ text: systemPrompt }] };
  if (jsonMode) body.generationConfig.responseMimeType = 'application/json';

  const models = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-flash-8b'];

  for (const model of models) {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
    );
    if (res.ok) {
      const data = await res.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    }
    const err = await res.json().catch(() => ({}));
    if (res.status === 400 || res.status === 401) {
      showToast('❌ Invalid Gemini key. Please update it.', 'error', 5000);
      throw new Error('Invalid key');
    }
    // 429 quota — try next model
  }
  throw new Error('All Gemini models quota exceeded');
}

// ── MASTER AI CALLER — Groq first, Gemini fallback ───────
async function callAI(prompt, systemPrompt = '', jsonMode = false) {
  if (!hasApiKey()) {
    showToast('❌ Please set an API key first! Click the 🔑 button.', 'error', 5000);
    openModal('api-modal');
    throw new Error('No API key');
  }

  // Try Groq first (fast + free)
  if (getGroqKey()) {
    const groqResult = await callGroq(prompt, systemPrompt);
    if (groqResult !== null) return groqResult;
    // null = fallback to Gemini
  }

  // Try Gemini
  if (getGeminiKey()) {
    return await callGemini(prompt, systemPrompt, jsonMode);
  }

  showToast('❌ Please set a Groq or Gemini API key.', 'error', 5000);
  openModal('api-modal');
  throw new Error('No valid API key');
}

// ── TOAST NOTIFICATIONS ──────────────────────────────────
function showToast(msg, type = 'info', duration = 3500) {
  let wrap = document.getElementById('toast-wrap');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.id = 'toast-wrap';
    wrap.className = 'toast-wrap';
    document.body.appendChild(wrap);
  }
  const t = document.createElement('div');
  const icons = { success: '✅', error: '❌', info: '💡' };
  t.className = `toast toast-${type}`;
  t.innerHTML = `<span>${icons[type] || '💡'}</span><span>${msg}</span>`;
  wrap.appendChild(t);
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, duration);
}

// ── SPEECH SYNTHESIS ─────────────────────────────────────
let currentUtterance = null;

function speak(text, onStart, onEnd) {
  if (!window.speechSynthesis) return;
  stopSpeaking();

  currentUtterance = new SpeechSynthesisUtterance(text);
  currentUtterance.rate = 0.95;
  currentUtterance.pitch = 1.0;
  currentUtterance.volume = 1;

  // Prefer a clear English voice
  const voices = speechSynthesis.getVoices();
  const preferred = voices.find(v =>
    v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('David') || v.name.includes('Samantha'))
  ) || voices.find(v => v.lang.startsWith('en')) || null;
  if (preferred) currentUtterance.voice = preferred;

  if (onStart) currentUtterance.onstart = onStart;
  if (onEnd)   currentUtterance.onend   = onEnd;
  currentUtterance.onerror = () => onEnd && onEnd();

  speechSynthesis.speak(currentUtterance);
}

function stopSpeaking() {
  if (window.speechSynthesis) speechSynthesis.cancel();
  currentUtterance = null;
}

function isSpeaking() {
  return window.speechSynthesis?.speaking || false;
}

// ── SPEECH RECOGNITION ───────────────────────────────────
let recognition = null;

function createRecognition(onResult, onEnd, onError) {
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRec) return null;

  const rec = new SpeechRec();
  rec.continuous = true;
  rec.interimResults = true;
  rec.lang = 'en-US';

  let finalTranscript = '';

  rec.onresult = (e) => {
    let interim = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const t = e.results[i][0].transcript;
      if (e.results[i].isFinal) finalTranscript += t + ' ';
      else interim = t;
    }
    onResult && onResult(finalTranscript.trim(), interim);
  };

  rec.onend = () => {
    onEnd && onEnd(finalTranscript.trim());
    finalTranscript = '';
  };
  rec.onerror = (e) => {
    onError && onError(e.error);
    finalTranscript = '';
  };

  return rec;
}

// ── PDF TEXT EXTRACTION ──────────────────────────────────
async function extractPdfText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const typedArray = new Uint8Array(e.target.result);
        const pdf = await pdfjsLib.getDocument(typedArray).promise;
        let text = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map(item => item.str).join(' ') + '\n';
        }
        resolve(text.trim());
      } catch(err) { reject(err); }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

// ── MODAL HELPERS ────────────────────────────────────────
function openModal(id) { document.getElementById(id)?.classList.add('open'); }
function closeModal(id) { document.getElementById(id)?.classList.remove('open'); }

// ── API KEY MODAL (Groq only) ────────────────────────────
function initApiKeyModal() {
  const overlay = document.getElementById('api-modal');
  if (!overlay) return;

  const modal = overlay.querySelector('.modal');
  if (modal && !modal.querySelector('#groq-key-input')) {
    modal.innerHTML = `
      <div class="modal-icon">🔑</div>
      <h2 class="modal-title">Set Your Groq API Key</h2>
      <p class="modal-desc">Groq is <strong>100% free</strong> and fast. Get your key in 1 minute — no credit card needed.</p>

      <div style="background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.25);border-radius:12px;padding:16px;margin-bottom:18px;">
        <div style="font-weight:700;font-size:14px;color:var(--green);margin-bottom:8px;">⚡ Groq API Key (Free)</div>
        <div style="font-size:12px;color:var(--text-secondary);margin-bottom:12px;line-height:1.7;">
          1️⃣ Go to <a href="https://console.groq.com" target="_blank" style="color:var(--purple-light);font-weight:600;">console.groq.com</a><br>
          2️⃣ Sign up free → Click <strong>API Keys</strong> → <strong>Create API Key</strong><br>
          3️⃣ Copy the key (starts with <code>gsk_</code>) → paste below
        </div>
        <div style="display:flex;gap:8px;">
          <input type="password" id="groq-key-input" class="form-input" placeholder="gsk_..." style="flex:1;">
          <button id="groq-key-toggle" style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-md);padding:0 14px;cursor:pointer;font-size:18px;">👁️</button>
        </div>
      </div>

      <div class="modal-actions">
        <button id="api-key-save" class="btn btn-primary w-full">Save Keys 🔒</button>
      </div>
      <div id="api-key-status" class="hidden" style="text-align:center;margin-top:10px;font-size:13px;color:var(--green);">✅ Key saved!</div>
    `;
  }

  const groqInput = document.getElementById('groq-key-input');
  const saveBtn   = document.getElementById('api-key-save');

  // Pre-fill if key exists
  if (groqInput && getGroqKey()) groqInput.value = getGroqKey();

  // Toggle visibility
  document.getElementById('groq-key-toggle')?.addEventListener('click', () => {
    if (!groqInput) return;
    groqInput.type = groqInput.type === 'password' ? 'text' : 'password';
  });

  saveBtn?.addEventListener('click', () => {
    const gk = groqInput?.value?.trim() || '';
    if (!gk) { showToast('Please paste your Groq API key', 'error'); return; }
    if (!gk.startsWith('gsk_')) { showToast('Groq keys must start with gsk_ — please check your key', 'error'); return; }
    saveGroqKey(gk);
    closeModal('api-modal');
    showToast('⚡ Groq key saved! You\'re ready to go! 🎉', 'success');
  });

  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal('api-modal'); });
}

// ── NAVBAR ───────────────────────────────────────────────
function initNavbar() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');

  hamburger?.addEventListener('click', () => navLinks?.classList.toggle('mob-open'));
  navLinks?.querySelectorAll('.nav-link').forEach(link =>
    link.addEventListener('click', () => navLinks.classList.remove('mob-open'))
  );

  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) link.classList.add('active');
  });

  document.querySelectorAll('.open-api-modal').forEach(btn =>
    btn.addEventListener('click', () => openModal('api-modal'))
  );

  if (hasApiKey()) {
    document.querySelectorAll('.api-key-status').forEach(el => el.classList.remove('hidden'));
    // Update navbar button to show key is set
    document.querySelectorAll('.nav-api-btn').forEach(btn => {
      btn.style.background = 'rgba(16,185,129,0.15)';
      btn.style.borderColor = 'rgba(16,185,129,0.4)';
    });
  }
}

// ── UTILITY ──────────────────────────────────────────────
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function sanitize(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function getScoreClass(score) {
  if (score >= 8) return 'excellent';
  if (score >= 6) return 'good';
  if (score >= 4) return 'average';
  return 'poor';
}

function getScoreEmoji(score) {
  if (score >= 8) return '🌟';
  if (score >= 6) return '👍';
  if (score >= 4) return '📈';
  return '💪';
}

// ── THEME TOGGLE ─────────────────────────────────────────
const THEME_KEY = 'cb_theme';
function getTheme()       { return localStorage.getItem(THEME_KEY) || 'dark'; }
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
}
function toggleTheme() {
  const next = getTheme() === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  showToast(next === 'light' ? '☀️ Light mode on!' : '🌙 Dark mode on!', 'info', 1800);
}
function initTheme() {
  applyTheme(getTheme());
  document.querySelectorAll('.theme-toggle-btn').forEach(btn =>
    btn.addEventListener('click', toggleTheme)
  );
}

// ── DOM READY ────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavbar();
  initApiKeyModal();
  initGlobalChat();
  if (!hasApiKey()) {
    setTimeout(() => {
      if (!localStorage.getItem('cb_onboarded')) {
        openModal('api-modal');
        localStorage.setItem('cb_onboarded', '1');
      }
    }, 1200);
  }
});

// ── GLOBAL FLOATING CHAT (every page) ────────────────────
function initGlobalChat() {
  // interview.html already has its own chat panel
  if (window.location.pathname.includes('interview')) return;

  const style = document.createElement('style');
  style.textContent = `
    @keyframes gcSpin { to { transform: rotate(360deg); } }
    #gc-bubble {
      position:fixed;bottom:24px;right:24px;z-index:900;
      width:54px;height:54px;border-radius:50%;border:none;cursor:pointer;
      background:linear-gradient(135deg,#7c3aed,#2563eb);
      box-shadow:0 4px 20px rgba(124,58,237,0.5);
      font-size:22px;display:flex;align-items:center;justify-content:center;
      transition:transform 0.2s,box-shadow 0.2s;
    }
    #gc-bubble:hover{transform:scale(1.12);box-shadow:0 8px 32px rgba(124,58,237,0.6);}
    #gc-panel {
      position:fixed;bottom:88px;right:24px;z-index:900;
      width:340px;max-height:480px;border-radius:20px;
      background:var(--bg-secondary);border:1px solid var(--border);
      box-shadow:0 16px 60px rgba(0,0,0,0.45);display:none;flex-direction:column;overflow:hidden;
    }
    #gc-panel.gc-open{display:flex;}
    .gc-head{padding:14px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;background:linear-gradient(135deg,rgba(124,58,237,0.15),rgba(37,99,235,0.1));}
    .gc-msgs{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;}
    .gc-msg{max-width:86%;padding:9px 13px;border-radius:12px;font-size:13px;line-height:1.6;white-space:pre-wrap;}
    .gc-msg.user{background:linear-gradient(135deg,#7c3aed,#2563eb);color:#fff;align-self:flex-end;border-radius:12px 12px 2px 12px;}
    .gc-msg.ai{background:var(--bg-card);color:var(--text-primary);border:1px solid var(--border);align-self:flex-start;border-radius:12px 12px 12px 2px;}
    .gc-input-row{padding:10px;border-top:1px solid var(--border);display:flex;gap:8px;}
    .gc-input-row input{flex:1;padding:9px 13px;border-radius:10px;font-size:13px;background:var(--bg-card);border:1.5px solid var(--border);color:var(--text-primary);}
    .gc-input-row input:focus{outline:none;border-color:#7c3aed;}
    .gc-send{width:38px;height:38px;border:none;border-radius:10px;cursor:pointer;background:linear-gradient(135deg,#7c3aed,#2563eb);color:#fff;font-size:15px;display:flex;align-items:center;justify-content:center;}
    @media(max-width:480px){#gc-panel{width:calc(100vw - 32px);right:16px;}}
  `;
  document.head.appendChild(style);

  document.body.insertAdjacentHTML('beforeend', `
    <button id="gc-bubble" onclick="gcToggle()" title="Ask AI">💬</button>
    <div id="gc-panel">
      <div class="gc-head">
        <div>
          <div style="font-size:13px;font-weight:700;color:var(--text-primary)">💬 Career AI Assistant</div>
          <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">Ask anything — interview, resume, career</div>
        </div>
        <button onclick="gcToggle()" style="background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:17px;">✕</button>
      </div>
      <div class="gc-msgs" id="gc-msgs">
        <div class="gc-msg ai">👋 Hi! I'm your AI career coach. Ask me anything:
• How to answer a tough interview question
• Resume writing tips
• Which skills to learn next
• Salary negotiation tactics
• Which companies to target</div>
      </div>
      <div class="gc-input-row">
        <input type="text" id="gc-input" placeholder="Type your career doubt...">
        <button class="gc-send" onclick="gcSend()">➤</button>
      </div>
    </div>
  `);

  document.getElementById('gc-input')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') gcSend();
  });
}

function gcToggle() {
  const panel = document.getElementById('gc-panel');
  if (!panel) return;
  panel.classList.toggle('gc-open');
  if (panel.classList.contains('gc-open')) {
    document.getElementById('gc-input')?.focus();
    const msgs = document.getElementById('gc-msgs');
    if (msgs) msgs.scrollTop = msgs.scrollHeight;
  }
}

async function gcSend() {
  const input = document.getElementById('gc-input');
  const msgs  = document.getElementById('gc-msgs');
  const text  = input?.value?.trim();
  if (!text || !msgs) return;

  if (!hasApiKey()) {
    showToast('Set your API key first!', 'error');
    openModal('api-modal'); return;
  }

  input.value = '';

  const uDiv = document.createElement('div');
  uDiv.className = 'gc-msg user';
  uDiv.textContent = text;
  msgs.appendChild(uDiv);

  const lDiv = document.createElement('div');
  lDiv.className = 'gc-msg ai';
  lDiv.innerHTML = '<span style="display:inline-block;width:12px;height:12px;border:2px solid rgba(124,58,237,0.3);border-top-color:#7c3aed;border-radius:50%;animation:gcSpin 0.8s linear infinite;vertical-align:middle;"></span> Thinking...';
  msgs.appendChild(lDiv);
  msgs.scrollTop = msgs.scrollHeight;

  try {
    const answer = await callAI(
      `You are an expert career coach and interview preparation specialist. Answer this question concisely and helpfully:\n\n"${text}"\n\nBe practical, specific, actionable. Under 150 words.`
    );
    lDiv.textContent = answer;
  } catch(e) {
    lDiv.textContent = '❌ Could not answer. Check your API key.';
  }
  msgs.scrollTop = msgs.scrollHeight;
}
