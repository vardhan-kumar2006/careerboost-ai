// ===== CAREERBOOST AI — INTERVIEW Q&A ENGINE =====

let allQAs       = [];   // Full list of generated Q&As
let filteredQAs  = [];   // After filter/search
let currentFilter = 'all';
let searchQuery   = '';
let resumeText    = '';
let currentRole   = '';
let chatOpen      = false;
let chatHistory   = [];  // [{role:'user'|'ai', text:string}]

// ─── PDF.JS INIT ─────────────────────────────────────────
window.addEventListener('load', () => {
  if (window.pdfjsLib) {
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  }
});

// ─── DOM READY ───────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  // Auto-open API key modal if missing
  if (!hasApiKey()) {
    setTimeout(() => openModal('api-modal'), 700);
  }

  // File input
  const fileInput = document.getElementById('resume-file');
  if (fileInput) {
    fileInput.addEventListener('change', () => {
      const f = fileInput.files && fileInput.files[0];
      if (f) handleResumeFile(f);
    });
  }

  // Drag & drop on upload zone
  const zone = document.getElementById('upload-zone');
  if (zone) {
    zone.addEventListener('dragover',  e => { e.preventDefault(); zone.style.opacity = '0.7'; });
    zone.addEventListener('dragleave', () => { zone.style.opacity = '1'; });
    zone.addEventListener('drop', e => {
      e.preventDefault(); zone.style.opacity = '1';
      const f = e.dataTransfer?.files?.[0];
      if (f) handleResumeFile(f);
    });
  }

  // Chat: press Enter to send
  const chatInput = document.getElementById('chat-input');
  if (chatInput) {
    chatInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendDoubt(); });
  }
});

// ─── HANDLE ROLE DROPDOWN CHANGE ─────────────────────────
function handleRoleChange(select) {
  const customInput = document.getElementById('custom-role');
  if (!customInput) return;
  if (select.value === 'other') {
    customInput.style.display = 'block';
    customInput.focus();
  } else {
    customInput.style.display = 'none';
    customInput.value = '';
  }
}

// ─── GET SELECTED ROLE ────────────────────────────────────
function getRole() {
  const select = document.getElementById('job-role');
  if (!select) return '';
  if (select.value === 'other') {
    const custom = document.getElementById('custom-role')?.value?.trim();
    return custom || '';
  }
  return select.value || '';
}


// ─── HANDLE RESUME FILE ───────────────────────────────────
async function handleResumeFile(file) {
  if (!file.name.toLowerCase().endsWith('.pdf')) {
    showToast('Please select a PDF file', 'error'); return;
  }
  const titleEl = document.getElementById('upload-title');
  if (titleEl) titleEl.textContent = '✅ ' + file.name;
  showToast('Resume loaded! Questions will be personalized to your background.', 'success', 3000);
  try {
    if (window.pdfjsLib) resumeText = await extractPdfText(file);
  } catch(e) { resumeText = ''; }
}

// ─── GENERATE QUESTIONS ───────────────────────────────────
async function generateQuestions() {
  if (!hasApiKey()) {
    showToast('Please set your API key first!', 'error', 4000);
    openModal('api-modal'); return;
  }

  const role  = getRole();
  const count = parseInt(document.getElementById('q-count')?.value || '50');

  if (!role) {
    showToast('Please select a job role!', 'error');
    return;
  }
  if (role === 'other') {
    showToast('Please type your job role in the text box!', 'error');
    return;
  }

  currentRole = role;
  allQAs = [];
  filteredQAs = [];

  // Show loading, hide setup
  document.getElementById('setup-section').style.display  = 'none';
  document.getElementById('loading-section').style.display = 'block';
  document.getElementById('qa-section').style.display      = 'none';

  // Update chat context
  const ctxLabel = document.getElementById('chat-context-label');
  if (ctxLabel) ctxLabel.textContent = `Studying: ${role}`;

  // Update generate button
  const btn = document.getElementById('generate-btn');
  if (btn) btn.disabled = true;

  try {
    // Generate in 2 batches for better reliability and speed
    const half1 = Math.ceil(count / 2);
    const half2 = count - half1;

    setLoadingProgress(10, 'Researching real interview experiences...', `Generating batch 1 of 2 (${half1} questions)`);
    const batch1 = await generateBatch(role, half1, 1, resumeText);
    allQAs = [...batch1];

    setLoadingProgress(55, 'Adding more advanced questions...', `Generating batch 2 of 2 (${half2} questions)`);
    const batch2 = await generateBatch(role, half2, 2, resumeText);
    allQAs = [...allQAs, ...batch2];

    setLoadingProgress(90, 'Finalizing your study guide...', 'Almost done!');
    await sleep(400);

    // Number them properly
    allQAs = allQAs.map((qa, i) => ({ ...qa, num: i + 1 }));

    // Show Q&A section
    document.getElementById('loading-section').style.display = 'none';
    document.getElementById('qa-section').style.display      = 'block';

    updateStats();
    applyFilter();
    renderChatWelcome(role);

  } catch(err) {
    console.error('generateQuestions error:', err);
    document.getElementById('loading-section').style.display = 'none';
    document.getElementById('setup-section').style.display  = 'block';
    if (btn) btn.disabled = false;
    showToast('❌ Failed to generate questions: ' + (err.message || 'Check your API key'), 'error', 6000);
  }
}

// ─── GENERATE ONE BATCH ───────────────────────────────────
async function generateBatch(role, count, batchNum, resumeCtx) {
  const topics = batchNum === 1
    ? 'Focus on: Technical fundamentals, core concepts, tools/technologies, problem-solving, and easy behavioral questions.'
    : 'Focus on: Advanced technical scenarios, system design, leadership behavioral questions, situational judgement, and HR/salary questions.';

  const resumePart = resumeCtx
    ? `\nCandidate Resume Context (use to personalize some questions):\n${resumeCtx.substring(0, 600)}`
    : '';

  const prompt = `Generate exactly ${count} interview Q&A pairs for a ${role} position.
${topics}${resumePart}

CRITICAL: Return ONLY a raw JSON array. No markdown, no code blocks, no explanation. Just the array starting with [ and ending with ].

Format:
[{"q":"question text?","a":"detailed answer text.","category":"Technical","difficulty":"Medium"}]

category must be: Technical, Behavioral, HR, or Situational
difficulty must be: Easy, Medium, or Hard

Generate ${count} items now:`;

  const raw = await callAI(prompt);
  return parseQAResponse(raw, count);
}

// ─── ROBUST JSON PARSER ───────────────────────────────────
function parseQAResponse(raw, expectedCount) {
  if (!raw) throw new Error('Empty response from AI');

  let text = raw.trim();

  // Step 1: Remove markdown code blocks (```json ... ``` or ``` ... ```)
  text = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '');

  // Step 2: Try to find a JSON array with regex
  const arrayMatch = text.match(/\[[\s\S]*\]/);
  if (arrayMatch) {
    try {
      const parsed = JSON.parse(arrayMatch[0]);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return sanitizeQAs(parsed).slice(0, expectedCount);
      }
    } catch(e) {
      // JSON parse failed — try to fix common issues
      try {
        const fixed = arrayMatch[0]
          .replace(/,\s*]/g, ']')        // trailing commas
          .replace(/,\s*}/g, '}')        // trailing commas in objects
          .replace(/[\u0000-\u001F]/g, ' '); // control chars
        const parsed = JSON.parse(fixed);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return sanitizeQAs(parsed).slice(0, expectedCount);
        }
      } catch(e2) {}
    }
  }

  // Step 3: Try to find individual JSON objects and build array manually
  const objMatches = [...text.matchAll(/\{[^{}]*"q"\s*:\s*"[^"]+[^{}]*\}/g)];
  if (objMatches.length > 0) {
    try {
      const items = objMatches.map(m => JSON.parse(m[0])).filter(o => o.q && o.a);
      if (items.length > 0) return sanitizeQAs(items).slice(0, expectedCount);
    } catch(e) {}
  }

  throw new Error('AI response was not in JSON format. Please try again.');
}

// Sanitize and fill missing fields
function sanitizeQAs(arr) {
  const validCategories = ['Technical', 'Behavioral', 'HR', 'Situational'];
  const validDifficulties = ['Easy', 'Medium', 'Hard'];
  return arr
    .filter(qa => qa && qa.q && qa.a)
    .map((qa, i) => ({
      q:          String(qa.q || '').trim(),
      a:          String(qa.a || '').trim(),
      category:   validCategories.includes(qa.category) ? qa.category : 'Technical',
      difficulty: validDifficulties.includes(qa.difficulty) ? qa.difficulty : 'Medium',
    }));
}



// ─── LOADING PROGRESS ─────────────────────────────────────
function setLoadingProgress(pct, msg, countMsg) {
  const bar   = document.getElementById('loading-bar');
  const msgEl = document.getElementById('loading-msg');
  const cntEl = document.getElementById('loading-count');
  if (bar)   bar.style.width    = pct + '%';
  if (msgEl) msgEl.textContent  = msg;
  if (cntEl) cntEl.textContent  = countMsg;
}

// ─── STATS BAR ────────────────────────────────────────────
function updateStats() {
  const counts = { Technical: 0, Behavioral: 0, HR: 0, Situational: 0 };
  allQAs.forEach(qa => { if (counts[qa.category] !== undefined) counts[qa.category]++; });

  const statsEl = document.getElementById('qa-stats');
  if (statsEl) statsEl.innerHTML = `
    <div class="qa-stat">📊 Total: <strong>${allQAs.length}</strong></div>
    <div class="qa-stat">🔧 Technical: <strong>${counts.Technical}</strong></div>
    <div class="qa-stat">🧠 Behavioral: <strong>${counts.Behavioral}</strong></div>
    <div class="qa-stat">👔 HR: <strong>${counts.HR}</strong></div>
    <div class="qa-stat">💡 Situational: <strong>${counts.Situational}</strong></div>
  `;

  const titleEl    = document.getElementById('qa-title');
  const subtitleEl = document.getElementById('qa-subtitle');
  if (titleEl)    titleEl.textContent    = currentRole + ' — Interview Q&A';
  if (subtitleEl) subtitleEl.textContent = `${allQAs.length} realistic questions with expert answers`;
}

// ─── FILTER ───────────────────────────────────────────────
function filterBy(cat, btn) {
  currentFilter = cat;
  document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
  if (btn) btn.classList.add('active');
  applyFilter();
}

function searchQA(query) {
  searchQuery = query.toLowerCase().trim();
  applyFilter();
}

function applyFilter() {
  let list = [...allQAs];

  if (currentFilter !== 'all') {
    list = list.filter(qa => qa.category === currentFilter);
  }
  if (searchQuery) {
    list = list.filter(qa =>
      qa.q.toLowerCase().includes(searchQuery) ||
      qa.a.toLowerCase().includes(searchQuery)
    );
  }

  filteredQAs = list;
  renderQAList(filteredQAs);
}

// ─── RENDER Q&A LIST ──────────────────────────────────────
function renderQAList(list) {
  const container = document.getElementById('qa-list');
  if (!container) return;

  if (list.length === 0) {
    container.innerHTML = `
      <div style="text-align:center;padding:48px 20px;color:var(--text-muted);">
        <div style="font-size:40px;margin-bottom:12px;">🔍</div>
        <div style="font-size:15px;font-weight:600;">No questions match your search</div>
        <div style="font-size:13px;margin-top:6px;">Try different keywords or clear the filter</div>
      </div>`;
    return;
  }

  container.innerHTML = list.map(qa => buildQACard(qa)).join('');
}

function buildQACard(qa) {
  const catClass = {
    Technical:   'badge-tech',
    Behavioral:  'badge-behav',
    HR:          'badge-hr',
    Situational: 'badge-situ'
  }[qa.category] || 'badge-tech';

  const diffClass = {
    Easy:   'badge-easy',
    Medium: 'badge-medium',
    Hard:   'badge-hard'
  }[qa.difficulty] || 'badge-easy';

  const catEmoji = {
    Technical: '🔧', Behavioral: '🧠', HR: '👔', Situational: '💡'
  }[qa.category] || '❓';

  const answerId = `ans-${qa.num}`;

  return `
  <div class="qa-card" id="qa-${qa.num}">
    <div class="qa-card-header">
      <div class="qa-num">${qa.num}</div>
      <div class="qa-badges">
        <span class="badge ${catClass}">${catEmoji} ${qa.category}</span>
        <span class="badge ${diffClass}">${qa.difficulty}</span>
      </div>
    </div>
    <div class="qa-question">${sanitize(qa.q)}</div>
    <div class="qa-divider"></div>
    <!-- Clickable toggle button -->
    <button
      onclick="toggleAnswer('${answerId}', this)"
      style="background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.25);border-radius:8px;padding:8px 14px;cursor:pointer;display:flex;align-items:center;gap:8px;font-size:13px;font-weight:700;color:var(--green);width:100%;text-align:left;"
    >
      <span>✅ Show Expert Answer</span>
      <span style="margin-left:auto;font-size:16px;">▼</span>
    </button>
    <!-- Answer hidden by default, shown on click -->
    <div id="${answerId}" style="display:none;margin-top:12px;padding:14px;background:rgba(16,185,129,0.05);border:1px solid rgba(16,185,129,0.15);border-radius:10px;font-size:14px;line-height:1.75;color:var(--text-primary);">
      ${sanitize(qa.a)}
    </div>
  </div>`;
}

// ─── TOGGLE ANSWER ACCORDION ──────────────────────────────
function toggleAnswer(answerId, btn) {
  const ansDiv = document.getElementById(answerId);
  if (!ansDiv) return;
  const isOpen = ansDiv.style.display !== 'none';

  if (isOpen) {
    ansDiv.style.display = 'none';
    btn.querySelector('span:last-child').textContent = '▼';
    btn.querySelector('span:first-child').textContent = '✅ Show Expert Answer';
  } else {
    ansDiv.style.display = 'block';
    btn.querySelector('span:last-child').textContent = '▲';
    btn.querySelector('span:first-child').textContent = '✅ Hide Expert Answer';
    // Smooth scroll to answer
    ansDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

// ─── RESET ────────────────────────────────────────────────
function resetToSetup() {
  allQAs = []; filteredQAs = []; resumeText = '';
  currentFilter = 'all'; searchQuery = '';

  document.getElementById('qa-section').style.display     = 'none';
  document.getElementById('loading-section').style.display = 'none';
  document.getElementById('setup-section').style.display  = 'block';

  const btn = document.getElementById('generate-btn');
  if (btn) btn.disabled = false;

  const titleEl = document.getElementById('upload-title');
  if (titleEl) titleEl.textContent = 'Drop your resume here';

  const fileInput = document.getElementById('resume-file');
  if (fileInput) fileInput.value = '';

  // Reset filter tabs
  document.querySelectorAll('.filter-tab').forEach((t, i) => {
    t.classList.toggle('active', i === 0);
  });

  const search = document.getElementById('qa-search');
  if (search) search.value = '';
}

// ─── FLOATING DOUBT CHAT ──────────────────────────────────
function toggleChat() {
  chatOpen = !chatOpen;
  const panel = document.getElementById('chat-panel');
  const dot   = document.getElementById('chat-dot');
  if (panel) panel.classList.toggle('open', chatOpen);
  if (dot && chatOpen) dot.style.display = 'none';

  if (chatOpen) {
    const input = document.getElementById('chat-input');
    if (input) setTimeout(() => input.focus(), 100);
    scrollChatToBottom();
  }
}

function renderChatWelcome(role) {
  const dot = document.getElementById('chat-dot');
  if (dot) dot.style.display = 'block';
  addChatMessage('ai', `🎯 Your ${role} Q&A guide is ready! I can help you:\n• Understand any question or concept\n• Get tips on how to answer better\n• Clarify technical topics\n• Practice difficult questions\n\nJust type your doubt below!`);
}

function addChatMessage(role, text) {
  chatHistory.push({ role, text });
  const msgs = document.getElementById('chat-messages');
  if (!msgs) return;

  const div = document.createElement('div');
  div.className = `chat-msg ${role}`;
  div.style.whiteSpace = 'pre-wrap';
  div.textContent = text;
  msgs.appendChild(div);
  scrollChatToBottom();
  return div;
}

function scrollChatToBottom() {
  const msgs = document.getElementById('chat-messages');
  if (msgs) setTimeout(() => msgs.scrollTop = msgs.scrollHeight, 50);
}

async function sendDoubt() {
  const input = document.getElementById('chat-input');
  const text  = input?.value?.trim();
  if (!text) return;

  if (!hasApiKey()) {
    showToast('Please set your API key first!', 'error');
    openModal('api-modal'); return;
  }

  input.value = '';
  addChatMessage('user', text);

  // Loading message
  const msgs   = document.getElementById('chat-messages');
  const loader = document.createElement('div');
  loader.className = 'chat-msg ai loading';
  loader.textContent = '⏳ Thinking...';
  msgs?.appendChild(loader);
  scrollChatToBottom();

  try {
    const context = currentRole
      ? `The user is studying for a ${currentRole} interview. They have been reviewing ${allQAs.length} realistic Q&As.`
      : 'The user is preparing for a job interview.';

    const answer = await callAI(
      `You are a helpful interview coach and career expert. ${context}\n\nUser's doubt: "${text}"\n\nProvide a clear, helpful, concise answer. Be practical and specific. If it's a technical topic, give a brief explanation with an example if possible.`
    );
    loader.remove();
    addChatMessage('ai', answer);
  } catch(e) {
    loader.remove();
    addChatMessage('ai', '❌ Could not get answer. Please check your API key and internet connection.');
  }
}

// ─── UTILITY ─────────────────────────────────────────────
function sanitize(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ===== INTERACTIVE QUIZ FUNCTIONS =====
let quizQuestions = [];
let userAnswers = []; // Store strings (MCQ option letters or typed text) or objects for short answers: { text: "", graded: "pending" | "correct" | "incorrect" }
let currentQuizIndex = 0;

async function startQuiz() {
  if (!allQAs || allQAs.length === 0) {
    showToast('Generate interview questions first before taking the quiz!', 'error');
    return;
  }

  // Toggle sections
  document.getElementById('qa-section').style.display = 'none';
  const quizSection = document.getElementById('quiz-section');
  quizSection.classList.add('visible');

  // Show loading
  document.getElementById('quiz-loading').style.display = 'block';
  document.getElementById('quiz-active-area').style.display = 'none';
  document.getElementById('quiz-results-area').style.display = 'none';

  // Set subtitle
  const subtitle = document.getElementById('quiz-role-subtitle');
  if (subtitle) subtitle.textContent = `Testing knowledge on: ${currentRole}`;

  // Decide question count: 20 if allQAs.length <= 25, otherwise 30
  const count = allQAs.length <= 25 ? 20 : 30;

  try {
    quizQuestions = await generateQuizFromQAs(allQAs, count);
    
    // Initialize user answers
    userAnswers = quizQuestions.map(q => {
      if (q.type === 'short_answer') {
        return { text: '', graded: 'pending' };
      }
      return '';
    });

    currentQuizIndex = 0;

    // Show active area
    document.getElementById('quiz-loading').style.display = 'none';
    document.getElementById('quiz-active-area').style.display = 'block';

    renderQuizQuestion();
  } catch (err) {
    console.error('Quiz generation failed:', err);
    showToast('❌ Failed to generate quiz. Try again.', 'error', 5000);
    exitQuiz();
  }
}

async function generateQuizFromQAs(qas, count) {
  const half1 = Math.ceil(count / 2);
  const half2 = count - half1;

  // Split Q&As context so each batch draws from separate questions
  const midIndex = Math.ceil(qas.length / 2);
  const qas1 = qas.slice(0, midIndex);
  const qas2 = qas.slice(midIndex);

  const batch1 = await generateQuizBatch(qas1, half1, 1);
  const batch2 = await generateQuizBatch(qas2, half2, 2);

  return [...batch1, ...batch2];
}

async function generateQuizBatch(qasSlice, count, batchNum) {
  const prompt = `Based on the following interview preparation Q&As for a ${currentRole} role, generate a quiz of exactly ${count} questions.
This is Batch ${batchNum} of the quiz.

The quiz must contain a mix of:
1. "mcq" (Multiple Choice Questions, exactly 4 options)
2. "fill_blank" (Fill-in-the-blank questions)
3. "short_answer" (Short answer questions, requiring a 1-2 sentence response)

Return ONLY a raw JSON array. No markdown, no code blocks, no explanation. Just the array starting with [ and ending with ].

Format:
[
  {
    "type": "mcq",
    "q": "Question text?",
    "options": ["A) option text", "B) option text", "C) option text", "D) option text"],
    "correct": "B",
    "explanation": "Explanation text..."
  },
  {
    "type": "fill_blank",
    "q": "Fill-in-the-blank question containing a blank represented by _______.",
    "correct": "CorrectKeyphraseOrTerm",
    "explanation": "Explanation text..."
  },
  {
    "type": "short_answer",
    "q": "Short question?",
    "correct": "Detailed expert answer to compare against.",
    "explanation": "Detailed explanation..."
  }
]

IMPORTANT:
- MCQ options MUST always be 4 strings starting with prefix "A) ", "B) ", "C) ", "D) ".
- MCQ "correct" value MUST be a single letter ("A", "B", "C", or "D") matching the correct option.
- Fill-in-the-blank "correct" should be a short key phrase or term (1-4 words).
- Short answer "correct" should be a 1-2 sentence explanation.

Q&A Context (Batch ${batchNum}):
${JSON.stringify(qasSlice.map(qa => ({ q: qa.q, a: qa.a })))}

Generate exactly ${count} quiz questions now:`;

  const raw = await callAI(prompt);
  return parseQuizResponse(raw, count);
}

function parseQuizResponse(raw, expectedCount) {
  if (!raw) throw new Error('Empty response from AI');
  let text = raw.trim();

  // Strip markdown code blocks
  text = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '');

  const arrayMatch = text.match(/\[[\s\S]*\]/);
  if (arrayMatch) {
    try {
      const parsed = JSON.parse(arrayMatch[0]);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return sanitizeQuizQuestions(parsed).slice(0, expectedCount);
      }
    } catch (e) {
      try {
        const fixed = arrayMatch[0]
          .replace(/,\s*]/g, ']')
          .replace(/,\s*}/g, '}')
          .replace(/[\u0000-\u001F]/g, ' ');
        const parsed = JSON.parse(fixed);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return sanitizeQuizQuestions(parsed).slice(0, expectedCount);
        }
      } catch (e2) {}
    }
  }

  throw new Error('AI response was not in a valid JSON array format.');
}

function sanitizeQuizQuestions(arr) {
  const validTypes = ['mcq', 'fill_blank', 'short_answer'];
  return arr
    .filter(q => q && q.q && q.correct)
    .map(q => {
      const type = validTypes.includes(q.type) ? q.type : 'mcq';
      return {
        type: type,
        q: String(q.q).trim(),
        options: Array.isArray(q.options) ? q.options.map(o => String(o).trim()) : [],
        correct: String(q.correct).trim(),
        explanation: String(q.explanation || 'Study the expert answer guide.').trim()
      };
    });
}

function renderQuizQuestion() {
  const container = document.getElementById('quiz-question-card');
  if (!container) return;

  const q = quizQuestions[currentQuizIndex];
  const total = quizQuestions.length;

  // Update progress bar
  const pct = Math.round((currentQuizIndex / total) * 100);
  const fill = document.getElementById('quiz-progress-fill');
  if (fill) fill.style.width = pct + '%';

  // Build badge
  let badgeHTML = '';
  if (q.type === 'mcq') {
    badgeHTML = `<span class="badge badge-tech" style="font-size:10px;margin-bottom:12px;display:inline-block;">🔧 Tick the Correct Answer</span>`;
  } else if (q.type === 'fill_blank') {
    badgeHTML = `<span class="badge badge-behav" style="font-size:10px;margin-bottom:12px;display:inline-block;">✏️ Fill in the Blank</span>`;
  } else {
    badgeHTML = `<span class="badge badge-situ" style="font-size:10px;margin-bottom:12px;display:inline-block;">✍️ Short Answer Q&amp;A</span>`;
  }

  // Render question text
  let questionHTML = `
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;">
      <span style="font-size:12px;color:var(--text-muted);font-weight:800;letter-spacing:1px;text-transform:uppercase;">Question ${currentQuizIndex + 1} of ${total}</span>
      ${badgeHTML}
    </div>
    <div class="quiz-question-title">${sanitize(q.q)}</div>
  `;

  // Render inputs based on type
  let inputHTML = '';
  if (q.type === 'mcq') {
    inputHTML = '<div class="quiz-options-grid">';
    const letters = ['A', 'B', 'C', 'D'];
    q.options.forEach((opt, idx) => {
      const letter = letters[idx] || letters[0];
      const isSelected = userAnswers[currentQuizIndex] === letter;
      inputHTML += `
        <button class="quiz-option-btn ${isSelected ? 'selected' : ''}" onclick="selectQuizOption('${letter}')">
          <div class="quiz-option-letter">${letter}</div>
          <div>${sanitize(opt)}</div>
        </button>
      `;
    });
    inputHTML += '</div>';
  } else if (q.type === 'fill_blank') {
    const val = userAnswers[currentQuizIndex] || '';
    inputHTML = `
      <input type="text" class="quiz-blank-input" placeholder="Type your answer here..." value="${sanitize(val)}" oninput="saveQuizTextInput(this.value)">
    `;
  } else if (q.type === 'short_answer') {
    const val = userAnswers[currentQuizIndex]?.text || '';
    inputHTML = `
      <textarea class="quiz-short-textarea" placeholder="Type your answer here (1-2 sentences)..." oninput="saveQuizShortAnswer(this.value)">${sanitize(val)}</textarea>
    `;
  }

  // Render navigation footer
  const isFirst = currentQuizIndex === 0;
  const isLast = currentQuizIndex === total - 1;

  let footerHTML = `
    <div class="quiz-divider" style="margin-top:20px;margin-bottom:20px;"></div>
    <div class="quiz-nav-row">
      <button class="btn btn-outline btn-sm" onclick="prevQuizQuestion()" ${isFirst ? 'disabled' : ''}>← Previous</button>
      <span class="quiz-progress-text">${currentQuizIndex + 1} / ${total}</span>
      ${isLast
        ? `<button class="btn btn-primary btn-sm" onclick="submitQuiz()" style="background:linear-gradient(135deg,var(--green),var(--blue));border-color:transparent;">Submit Quiz ➔</button>`
        : `<button class="btn btn-primary btn-sm" onclick="nextQuizQuestion()">Next →</button>`
      }
    </div>
  `;

  container.innerHTML = questionHTML + inputHTML + footerHTML;

  // Auto-focus inputs
  if (q.type === 'fill_blank') {
    container.querySelector('input')?.focus();
  } else if (q.type === 'short_answer') {
    container.querySelector('textarea')?.focus();
  }
}

function selectQuizOption(letter) {
  userAnswers[currentQuizIndex] = letter;
  renderQuizQuestion();
}

function saveQuizTextInput(val) {
  userAnswers[currentQuizIndex] = val;
}

function saveQuizShortAnswer(val) {
  if (!userAnswers[currentQuizIndex]) {
    userAnswers[currentQuizIndex] = { text: '', graded: 'pending' };
  }
  userAnswers[currentQuizIndex].text = val;
}

function nextQuizQuestion() {
  if (currentQuizIndex < quizQuestions.length - 1) {
    currentQuizIndex++;
    renderQuizQuestion();
  }
}

function prevQuizQuestion() {
  if (currentQuizIndex > 0) {
    currentQuizIndex--;
    renderQuizQuestion();
  }
}

function submitQuiz() {
  // Hide active quiz
  document.getElementById('quiz-active-area').style.display = 'none';
  document.getElementById('quiz-results-area').style.display = 'block';

  // Smooth scroll to top of section
  document.getElementById('quiz-section').scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Calculate score and render review list
  renderQuizResults();
}

function renderQuizResults() {
  const container = document.getElementById('quiz-review-list');
  if (!container) return;

  let score = 0;
  let reviewCardsHTML = '';

  quizQuestions.forEach((q, i) => {
    let isCorrect = false;
    let userAnsText = '';
    let correctAnsText = '';
    let badgeHTML = '';

    if (q.type === 'mcq') {
      const uLetter = userAnswers[i] || '';
      userAnsText = `Your Answer: <strong>Option ${uLetter}</strong>`;
      
      // Find full text of the correct option
      const correctOptionString = q.options.find(o => o.startsWith(q.correct + ')')) || q.correct;
      correctAnsText = `Correct Answer: <strong>${sanitize(correctOptionString)}</strong>`;
      
      isCorrect = uLetter.trim().toUpperCase() === q.correct.trim().toUpperCase();
      if (isCorrect) score++;
      
      badgeHTML = isCorrect 
        ? `<span class="quiz-review-badge correct">Correct</span>` 
        : `<span class="quiz-review-badge incorrect">Incorrect</span>`;
    } else if (q.type === 'fill_blank') {
      const uVal = (userAnswers[i] || '').trim();
      userAnsText = `Your Answer: "<em>${sanitize(uVal || 'Empty')}</em>"`;
      correctAnsText = `Correct Answer: "<strong>${sanitize(q.correct)}</strong>"`;
      
      isCorrect = uVal.toLowerCase() === q.correct.trim().toLowerCase();
      if (isCorrect) score++;
      
      badgeHTML = isCorrect 
        ? `<span class="quiz-review-badge correct">Correct</span>` 
        : `<span class="quiz-review-badge incorrect">Incorrect</span>`;
    } else if (q.type === 'short_answer') {
      const uVal = (userAnswers[i]?.text || '').trim();
      userAnsText = `Your Answer: "<em>${sanitize(uVal || 'Empty')}</em>"`;
      correctAnsText = `Expert Answer: <strong>${sanitize(q.correct)}</strong>`;
      
      // Short answer uses self-grading
      const isGraded = userAnswers[i]?.graded || 'pending';
      if (isGraded === 'correct') {
        isCorrect = true;
        score++;
        badgeHTML = `<span class="quiz-review-badge correct" id="review-badge-${i}">Correct (Self-Graded)</span>`;
      } else if (isGraded === 'incorrect') {
        isCorrect = false;
        badgeHTML = `<span class="quiz-review-badge incorrect" id="review-badge-${i}">Incorrect (Self-Graded)</span>`;
      } else {
        isCorrect = false;
        badgeHTML = `<span class="quiz-review-badge" id="review-badge-${i}" style="background:rgba(255,255,255,0.08);color:var(--text-muted)">Pending Self-Grade</span>`;
      }
    }

    // Header badge emoji
    const emoji = q.type === 'mcq' ? '🔧' : q.type === 'fill_blank' ? '✏️' : '✍️';
    const typeLabel = q.type === 'mcq' ? 'MCQ' : q.type === 'fill_blank' ? 'Fill in Blank' : 'Short Answer';

    // Build card HTML
    reviewCardsHTML += `
      <div class="quiz-review-card">
        <div class="quiz-review-header">
          <span class="quiz-review-num">${emoji} ${typeLabel} — Question ${i + 1}</span>
          ${badgeHTML}
        </div>
        <div class="quiz-review-q">${sanitize(q.q)}</div>
        
        <div class="quiz-review-answer-box ${q.type !== 'short_answer' ? (isCorrect ? 'correct' : 'incorrect') : (userAnswers[i]?.graded === 'correct' ? 'correct' : (userAnswers[i]?.graded === 'incorrect' ? 'incorrect' : ''))}" id="review-answer-box-${i}">
          <div style="margin-bottom:6px;">${userAnsText}</div>
          <div>${correctAnsText}</div>
        </div>

        ${q.type === 'short_answer' ? `
          <div class="self-grade-row" id="self-grade-${i}">
            <span class="self-grade-text">Self-Grade this short answer:</span>
            <div class="self-grade-btns">
              <button class="self-grade-btn correct-btn ${userAnswers[i]?.graded === 'correct' ? 'active' : ''}" onclick="gradeShortAnswer(${i}, 'correct')">✔️ Correct</button>
              <button class="self-grade-btn incorrect-btn ${userAnswers[i]?.graded === 'incorrect' ? 'active' : ''}" onclick="gradeShortAnswer(${i}, 'incorrect')">❌ Incorrect</button>
            </div>
          </div>
        ` : ''}

        <div class="quiz-review-explanation">
          <div style="font-weight:700;font-size:11px;text-transform:uppercase;color:var(--cyan);margin-bottom:4px;letter-spacing:0.5px;">Explanation:</div>
          <div>${sanitize(q.explanation)}</div>
        </div>
      </div>
    `;
  });

  container.innerHTML = reviewCardsHTML;

  // Render the dashboard scorecard
  const pct = Math.round((score / quizQuestions.length) * 100);
  const scoreClass = pct >= 80 ? 'excellent' : (pct >= 60 ? 'good' : (pct >= 40 ? 'average' : 'poor'));
  const scoreEmoji = pct >= 80 ? '🌟' : (pct >= 60 ? '👍' : (pct >= 40 ? '📈' : '💪'));

  const summary = document.getElementById('quiz-results-summary');
  if (summary) {
    summary.innerHTML = `
      <div class="quiz-results-badge">${scoreEmoji}</div>
      <div class="quiz-results-score" id="quiz-results-score">Score: <strong>${score}</strong> / ${quizQuestions.length}</div>
      <div class="quiz-results-percentage" id="quiz-results-percentage">${pct}% Accuracy</div>
      <div class="quiz-results-msg" id="quiz-results-msg">
        ${pct >= 80 ? 'Incredible! You have excellent memory and recall. You are ready to ace real company rounds! 🚀' : 
          (pct >= 60 ? 'Good job! You remembered most concepts. Review the incorrect ones to reach 100%! 👍' : 
          'Keep studying! Read through the Q&A guide again and retry. Repetition is the mother of learning! 💪')}
      </div>
    `;
  }
}

function gradeShortAnswer(qIdx, gradeState) {
  if (userAnswers[qIdx]) {
    userAnswers[qIdx].graded = gradeState;
  }

  // Highlight active buttons
  const selfGradeRow = document.getElementById(`self-grade-${qIdx}`);
  if (selfGradeRow) {
    selfGradeRow.querySelectorAll('.self-grade-btn').forEach(btn => {
      btn.classList.remove('active');
      if (gradeState === 'correct' && btn.classList.contains('correct-btn')) {
        btn.classList.add('active');
      } else if (gradeState === 'incorrect' && btn.classList.contains('incorrect-btn')) {
        btn.classList.add('active');
      }
    });
  }

  // Recalculate score and refresh scorecard details
  recalculateScore();
}

function recalculateScore() {
  let score = 0;
  quizQuestions.forEach((q, i) => {
    if (q.type === 'mcq') {
      const uLetter = userAnswers[i] || '';
      const isCorrect = uLetter.trim().toUpperCase() === q.correct.trim().toUpperCase();
      if (isCorrect) score++;
    } else if (q.type === 'fill_blank') {
      const uVal = (userAnswers[i] || '').trim();
      const isCorrect = uVal.toLowerCase() === q.correct.trim().toLowerCase();
      if (isCorrect) score++;
    } else if (q.type === 'short_answer') {
      if (userAnswers[i] && userAnswers[i].graded === 'correct') {
        score++;
      }
    }
  });

  const pct = Math.round((score / quizQuestions.length) * 100);
  const scoreClass = pct >= 80 ? 'excellent' : (pct >= 60 ? 'good' : (pct >= 40 ? 'average' : 'poor'));
  const scoreEmoji = pct >= 80 ? '🌟' : (pct >= 60 ? '👍' : (pct >= 40 ? '📈' : '💪'));

  const scoreEl = document.getElementById('quiz-results-score');
  const pctEl = document.getElementById('quiz-results-percentage');
  const msgEl = document.getElementById('quiz-results-msg');

  if (scoreEl) scoreEl.innerHTML = `Score: <strong>${score}</strong> / ${quizQuestions.length}`;
  if (pctEl) pctEl.textContent = `${pct}% Accuracy`;

  // Dynamically update correct/incorrect badges and cards
  quizQuestions.forEach((q, i) => {
    if (q.type === 'short_answer') {
      const badge = document.getElementById(`review-badge-${i}`);
      const answerBox = document.getElementById(`review-answer-box-${i}`);
      if (badge && answerBox) {
        if (userAnswers[i] && userAnswers[i].graded === 'correct') {
          badge.className = 'quiz-review-badge correct';
          badge.textContent = 'Correct (Self-Graded)';
          answerBox.className = 'quiz-review-answer-box correct';
        } else if (userAnswers[i] && userAnswers[i].graded === 'incorrect') {
          badge.className = 'quiz-review-badge incorrect';
          badge.textContent = 'Incorrect (Self-Graded)';
          answerBox.className = 'quiz-review-answer-box incorrect';
        }
      }
    }
  });
}

function restartQuiz() {
  quizQuestions = [];
  startQuiz();
}

function exitQuiz() {
  document.getElementById('quiz-section').classList.remove('visible');
  document.getElementById('qa-section').style.display = 'block';
  
  // Smooth scroll back to Q&A section
  document.getElementById('qa-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
}




