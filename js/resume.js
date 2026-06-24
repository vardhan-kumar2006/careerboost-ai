// ===== CAREERBOOST AI - RESUME BUILDER JS (Multi-Template) =====

let techSkills = [];
let softSkills = [];
let eduCount   = 1;
let expCount   = 0;
let projCount  = 1;
let selectedTemplate = 'modern';
let generatedHTML    = '';

// ── FIELD VALIDATORS ─────────────────────────────────────
function showFieldHint(hintId, msg, isError) {
  const el = document.getElementById(hintId);
  if (!el) return;
  el.style.display = msg ? 'block' : 'none';
  el.textContent   = msg;
  el.style.color   = isError ? '#ef4444' : '#10b981';
}

function validatePhone(input) {
  const digits = input.value.replace(/\D/g, '');
  input.value = digits;
  if (!digits) { showFieldHint('r-phone-hint', '', false); return; }
  if (digits.length < 10) {
    showFieldHint('r-phone-hint', `${digits.length}/10 — needs ${10 - digits.length} more digits`, true);
  } else {
    showFieldHint('r-phone-hint', '✅ Valid phone number', false);
  }
}

function validateEmail(input) {
  const val = input.value.trim();
  if (!val) { showFieldHint('r-email-hint', '', false); return; }
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  showFieldHint('r-email-hint', ok ? '✅ Valid email' : '❌ Enter a valid email (e.g. john@gmail.com)', !ok);
}

function validateLinkedIn(input) {
  const val = input.value.trim();
  if (!val) { showFieldHint('r-linkedin-hint', '', false); return; }
  if (!val.includes('/') && val.length > 2) {
    input.value = 'linkedin.com/in/' + val;
    showFieldHint('r-linkedin-hint', '✅ Auto-fixed to linkedin.com/in/' + val, false);
    return;
  }
  const ok = /linkedin\.com\/in\//i.test(val);
  showFieldHint('r-linkedin-hint', ok ? '✅ Valid LinkedIn URL' : '❌ Format: linkedin.com/in/yourname', !ok);
}

function validateGitHub(input) {
  const val = input.value.trim();
  if (!val) { showFieldHint('r-github-hint', '', false); return; }
  if (!val.includes('.') && !val.includes('/') && val.length > 2) {
    input.value = 'github.com/' + val;
    showFieldHint('r-github-hint', '✅ Auto-fixed to github.com/' + val, false);
    return;
  }
  const ok = /github\.com\//i.test(val) || /^https?:\/\//i.test(val);
  showFieldHint('r-github-hint', ok ? '✅ Valid URL' : '❌ Format: github.com/yourname or https://yoursite.com', !ok);
}

// ── TEMPLATE SELECTOR ────────────────────────────────────
const TEMPLATES = {
  modern:    { name: 'Modern',   desc: 'Purple gradient', thumb: 'linear-gradient(135deg,#7c3aed,#2563eb)' },
  classic:   { name: 'Classic',  desc: 'Blue & white',    thumb: 'linear-gradient(135deg,#1e3a8a,#2563eb)' },
  minimal:   { name: 'Minimal',  desc: 'Clean & simple',  thumb: 'linear-gradient(135deg,#111827,#374151)' },
  creative:  { name: 'Creative', desc: 'Teal & bold',     thumb: 'linear-gradient(135deg,#0d9488,#06b6d4)' },
  executive: { name: 'Executive', desc: 'Classic Navy corporate', thumb: 'linear-gradient(135deg,#0f172a,#475569)' },
  devtech:   { name: 'DevTech Dark', desc: 'Neon developer dark', thumb: 'linear-gradient(135deg,#1e293b,#10b981)' },
};

function initTemplateSelector() {
  const wrap = document.getElementById('template-selector');
  if (!wrap) return;
  wrap.innerHTML = Object.entries(TEMPLATES).map(([key, t]) => `
    <div class="template-card ${key === selectedTemplate ? 'selected' : ''}" onclick="selectTemplate('${key}')" id="tpl-${key}">
      <div class="template-thumb" style="background:${t.thumb};"></div>
      <div class="template-name">${t.name}</div>
      <div class="template-desc">${t.desc}</div>
    </div>`).join('');
}

function selectTemplate(key) {
  selectedTemplate = key;
  document.querySelectorAll('.template-card').forEach(c => c.classList.remove('selected'));
  document.getElementById(`tpl-${key}`)?.classList.add('selected');
  // Re-render if already generated
  if (generatedHTML) {
    const lastData = window._lastResumeData;
    if (lastData) renderResume(lastData);
  }
  showToast(`${TEMPLATES[key].name} template selected`, 'info', 1500);
}

// ── TAG INPUTS ───────────────────────────────────────────
function initTagInputs() {
  setupTagInput('tech-skill-input', 'tech-skills-wrap', techSkills);
  setupTagInput('soft-skill-input', 'soft-skills-wrap', softSkills);
}

function setupTagInput(inputId, wrapId, arr) {
  const input = document.getElementById(inputId);
  const wrap  = document.getElementById(wrapId);
  if (!input || !wrap) return;
  input.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ',') && input.value.trim()) {
      e.preventDefault();
      const val = input.value.trim().replace(/,$/, '');
      if (val && !arr.includes(val)) { arr.push(val); renderTags(wrap, arr, input); }
      input.value = '';
    } else if (e.key === 'Backspace' && !input.value && arr.length) {
      arr.pop(); renderTags(wrap, arr, input);
    }
  });
}

function renderTags(wrap, arr, input) {
  wrap.querySelectorAll('.tag-chip').forEach(c => c.remove());
  arr.forEach((tag, i) => {
    const chip = document.createElement('span');
    chip.className = 'tag-chip';
    chip.innerHTML = `${sanitize(tag)} <button onclick="removeTag(this)" data-idx="${i}" type="button">×</button>`;
    wrap.insertBefore(chip, input);
  });
}

function removeTag(btn) {
  const idx  = parseInt(btn.dataset.idx);
  const wrap = btn.closest('.tags-wrap');
  if (wrap.id === 'tech-skills-wrap') techSkills.splice(idx, 1);
  else softSkills.splice(idx, 1);
  const input = wrap.querySelector('.tag-input-field');
  const arr   = wrap.id === 'tech-skills-wrap' ? techSkills : softSkills;
  renderTags(wrap, arr, input);
}

// ── DYNAMIC SECTIONS ─────────────────────────────────────
function addEdu() {
  const list = document.getElementById('edu-list');
  const id   = `edu-${eduCount}`;
  const div  = document.createElement('div');
  div.className = 'sub-card'; div.id = id;
  div.innerHTML = `
    <button class="sub-card-remove" onclick="removeItem('edu',${eduCount})" title="Remove">×</button>
    <div class="form-grid-2">
      <div class="form-group"><label class="form-label">Degree / Course</label><input type="text" class="form-input edu-degree" placeholder="B.Tech Computer Science"></div>
      <div class="form-group"><label class="form-label">University / School</label><input type="text" class="form-input edu-school" placeholder="JNTU Hyderabad"></div>
    </div>
    <div class="form-grid-2">
      <div class="form-group"><label class="form-label">Year</label><input type="text" class="form-input edu-year" placeholder="2021 – 2025"></div>
      <div class="form-group"><label class="form-label">CGPA / Percentage</label><input type="text" class="form-input edu-gpa" placeholder="8.5 / 10"></div>
    </div>`;
  list.appendChild(div); eduCount++;
}

function addExp() {
  const list = document.getElementById('exp-list');
  const id   = `exp-${expCount}`;
  const div  = document.createElement('div');
  div.className = 'sub-card'; div.id = id;
  div.innerHTML = `
    <button class="sub-card-remove" onclick="removeItem('exp',${expCount})" title="Remove">×</button>
    <div class="form-grid-2">
      <div class="form-group"><label class="form-label">Company</label><input type="text" class="form-input exp-company" placeholder="Google, TCS..."></div>
      <div class="form-group"><label class="form-label">Role</label><input type="text" class="form-input exp-role" placeholder="Software Engineer Intern"></div>
    </div>
    <div class="form-grid-2">
      <div class="form-group"><label class="form-label">Duration</label><input type="text" class="form-input exp-duration" placeholder="Jun 2024 – Aug 2024"></div>
      <div class="form-group"><label class="form-label">Location</label><input type="text" class="form-input exp-location" placeholder="Remote / Hyderabad"></div>
    </div>
    <div class="form-group">
      <div class="sub-card-header">
        <label class="form-label" style="margin:0;">Key responsibilities / achievements</label>
        <button class="btn-ai-action" id="tailor-btn-exp-${expCount}" onclick="tailorBullets('exp', ${expCount})" type="button">⚡ AI Tailor Bullet Points</button>
      </div>
      <textarea class="form-textarea exp-desc" rows="3" placeholder="• Built REST APIs using Node.js&#10;• Improved performance by 40%"></textarea>
    </div>`;
  list.appendChild(div); expCount++;
}

function addProj() {
  const list = document.getElementById('proj-list');
  const id   = `proj-${projCount}`;
  const div  = document.createElement('div');
  div.className = 'sub-card'; div.id = id;
  div.innerHTML = `
    <button class="sub-card-remove" onclick="removeItem('proj',${projCount})" title="Remove">×</button>
    <div class="form-group"><label class="form-label">Project Name</label><input type="text" class="form-input proj-name" placeholder="CareerBoost AI"></div>
    <div class="form-grid-2">
      <div class="form-group"><label class="form-label">Tech Stack</label><input type="text" class="form-input proj-tech" placeholder="React, Firebase, Node.js"></div>
      <div class="form-group"><label class="form-label">Link (optional)</label><input type="text" class="form-input proj-link" placeholder="github.com/..."></div>
    </div>
    <div class="form-group">
      <div class="sub-card-header">
        <label class="form-label" style="margin:0;">Description</label>
        <button class="btn-ai-action" id="tailor-btn-proj-${projCount}" onclick="tailorBullets('proj', ${projCount})" type="button">⚡ AI Tailor Bullet Points</button>
      </div>
      <textarea class="form-textarea proj-desc" rows="2" placeholder="What it does and why it matters..."></textarea>
    </div>`;
  list.appendChild(div); projCount++;
}

function removeItem(type, idx) { document.getElementById(`${type}-${idx}`)?.remove(); }

// ── COLLECT FORM DATA ────────────────────────────────────
function collectData() {
  const val = (id) => (document.getElementById(id)?.value || '').trim();
  const education  = [...document.querySelectorAll('#edu-list .sub-card')].map(c => ({
    degree: c.querySelector('.edu-degree')?.value?.trim() || '',
    school: c.querySelector('.edu-school')?.value?.trim() || '',
    year:   c.querySelector('.edu-year')?.value?.trim()   || '',
    gpa:    c.querySelector('.edu-gpa')?.value?.trim()    || ''
  })).filter(e => e.degree || e.school);

  const experience = [...document.querySelectorAll('#exp-list .sub-card')].map(c => ({
    company:  c.querySelector('.exp-company')?.value?.trim()  || '',
    role:     c.querySelector('.exp-role')?.value?.trim()     || '',
    duration: c.querySelector('.exp-duration')?.value?.trim() || '',
    location: c.querySelector('.exp-location')?.value?.trim() || '',
    desc:     c.querySelector('.exp-desc')?.value?.trim()     || ''
  })).filter(e => e.company || e.role);

  const projects = [...document.querySelectorAll('#proj-list .sub-card')].map(c => ({
    name: c.querySelector('.proj-name')?.value?.trim() || '',
    tech: c.querySelector('.proj-tech')?.value?.trim() || '',
    link: c.querySelector('.proj-link')?.value?.trim() || '',
    desc: c.querySelector('.proj-desc')?.value?.trim() || ''
  })).filter(p => p.name);

  return {
    name: val('r-name'), title: val('r-title'),
    email: val('r-email'), phone: val('r-phone'),
    linkedin: val('r-linkedin'), github: val('r-github'),
    location: val('r-location'), summary: val('r-summary'),
    achievements: val('r-achievements'),
    education, experience, projects,
    techSkills: [...techSkills], softSkills: [...softSkills]
  };
}

// ── GENERATE RESUME ──────────────────────────────────────
async function generateResume() {
  if (!hasApiKey()) { openModal('api-modal'); return; }
  const data = collectData();
  if (!data.name)  { showToast('Please enter your full name', 'error'); return; }
  if (!data.title) { showToast('Please enter your target job title', 'error'); return; }

  const btn = document.getElementById('generate-resume-btn');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> AI crafting your resume...';

  try {
    let enhanced = { ...data };

    // Auto-generate summary if blank
    if (!data.summary) {
      const p = `Write a compelling 3-sentence professional summary for a ${data.title}.
Education: ${data.education.map(e => e.degree + ' from ' + e.school).join(', ') || 'Not specified'}
Skills: ${[...data.techSkills, ...data.softSkills].slice(0,10).join(', ') || 'Not specified'}
Projects: ${data.projects.map(p => p.name).join(', ') || 'Not specified'}
Start with the person's identity. Be specific. No fluff.`;
      try { enhanced.summary = await callAI(p); } catch(e) {}
    }

    // Enhance short project descriptions
    for (let i = 0; i < enhanced.projects.length; i++) {
      const p = enhanced.projects[i];
      if (p.desc && p.desc.length < 60) {
        try {
          const ep = `Enhance this project description for a resume (3 bullet points, action verbs, measurable impact). Project: "${p.name}", Tech: ${p.tech}, Description: "${p.desc}". Output only bullet points, one per line starting with •`;
          enhanced.projects[i].desc = await callAI(ep);
          await sleep(200);
        } catch(e) {}
      }
    }

    // Enhance short experience descriptions
    for (let i = 0; i < enhanced.experience.length; i++) {
      const exp = enhanced.experience[i];
      if (exp.desc && exp.desc.length < 60) {
        try {
          const ep = `Enhance this work experience for a resume (2-3 bullet points, strong action verbs, quantify impact). Role: ${exp.role} at ${exp.company}. Description: "${exp.desc}". Output only bullet points starting with •`;
          enhanced.experience[i].desc = await callAI(ep);
          await sleep(200);
        } catch(e) {}
      }
    }

    window._lastResumeData = enhanced;
    renderResume(enhanced);
    showToast('🎉 Resume generated! Choose a template below.', 'success');
    document.getElementById('download-btn').disabled = false;

  } catch(e) {
    showToast('AI enhancement failed. Generating with your data...', 'info');
    window._lastResumeData = data;
    renderResume(data);
    document.getElementById('download-btn').disabled = false;
  } finally {
    btn.disabled = false;
    btn.innerHTML = '✨ Generate AI Resume';
  }
}

// ── BULLET PARSER ─────────────────────────────────────────
function parseBullets(text) {
  return text.split('\n').filter(l => l.trim()).map(l =>
    `<li>${sanitize(l.replace(/^[•\-\*]\s*/, ''))}</li>`
  ).join('');
}

// ── TEMPLATE RENDERERS ───────────────────────────────────

// TEMPLATE 1: Modern (two-column, purple gradient)
function renderModern(d) {
  const allSkills = [...d.techSkills, ...d.softSkills];
  const contact = [d.email, d.phone, d.location, d.linkedin, d.github].filter(Boolean);
  return `
<div style="font-family:'Inter',sans-serif;max-width:800px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 30px rgba(0,0,0,0.12);">
  <!-- Header -->
  <div style="background:linear-gradient(135deg,#7c3aed,#2563eb);color:white;padding:32px;">
    <div style="font-size:28px;font-weight:800;letter-spacing:-0.5px;">${sanitize(d.name)}</div>
    <div style="font-size:15px;opacity:0.85;margin-top:4px;font-weight:500;">${sanitize(d.title)}</div>
    <div style="display:flex;flex-wrap:wrap;gap:16px;margin-top:14px;">
      ${contact.map(c => `<span style="font-size:12px;opacity:0.85;">📍 ${sanitize(c)}</span>`).join('')}
    </div>
  </div>
  <!-- Body: two columns -->
  <div style="display:grid;grid-template-columns:1fr 280px;gap:0;">
    <!-- Left column -->
    <div style="padding:24px;border-right:1px solid #e5e7eb;">
      ${d.summary ? `<div style="margin-bottom:22px;"><div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#7c3aed;border-bottom:2px solid #7c3aed;padding-bottom:5px;margin-bottom:10px;">Professional Summary</div><div style="font-size:13px;line-height:1.7;color:#374151;">${sanitize(d.summary)}</div></div>` : ''}
      ${d.experience.length ? `<div style="margin-bottom:22px;"><div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#7c3aed;border-bottom:2px solid #7c3aed;padding-bottom:5px;margin-bottom:10px;">Work Experience</div>${d.experience.map(e=>`<div style="margin-bottom:14px;"><div style="display:flex;justify-content:space-between;"><strong style="font-size:13px;color:#111827;">${e.role}</strong><span style="font-size:11px;color:#6b7280;">${e.duration}</span></div><div style="font-size:12px;color:#7c3aed;margin-bottom:5px;">${e.company}${e.location?' · '+e.location:''}</div><ul style="margin:0;padding-left:16px;font-size:12px;color:#374151;line-height:1.7;">${parseBullets(e.desc)}</ul></div>`).join('')}</div>` : ''}
      ${d.projects.length ? `<div style="margin-bottom:22px;"><div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#7c3aed;border-bottom:2px solid #7c3aed;padding-bottom:5px;margin-bottom:10px;">Projects</div>${d.projects.map(p=>`<div style="margin-bottom:14px;"><div style="display:flex;justify-content:space-between;align-items:center;"><strong style="font-size:13px;color:#111827;">${p.name}</strong>${p.link?`<a href="${p.link}" style="font-size:11px;color:#7c3aed;">${sanitize(p.link)}</a>`:''}</div><div style="font-size:11px;color:#6b7280;margin-bottom:5px;">Tech: ${sanitize(p.tech)}</div><ul style="margin:0;padding-left:16px;font-size:12px;color:#374151;line-height:1.7;">${parseBullets(p.desc)}</ul></div>`).join('')}</div>` : ''}
    </div>
    <!-- Right column -->
    <div style="padding:24px;background:#fafafa;">
      ${d.education.length ? `<div style="margin-bottom:22px;"><div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#7c3aed;border-bottom:2px solid #7c3aed;padding-bottom:5px;margin-bottom:10px;">Education</div>${d.education.map(e=>`<div style="margin-bottom:12px;"><div style="font-size:13px;font-weight:700;color:#111827;">${e.degree}</div><div style="font-size:12px;color:#374151;">${e.school}</div><div style="font-size:11px;color:#6b7280;">${e.year}${e.gpa?' · '+e.gpa:''}</div></div>`).join('')}</div>` : ''}
      ${allSkills.length ? `<div style="margin-bottom:22px;"><div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#7c3aed;border-bottom:2px solid #7c3aed;padding-bottom:5px;margin-bottom:10px;">Skills</div><div style="display:flex;flex-wrap:wrap;gap:6px;">${allSkills.map(s=>`<span style="background:#f3f0ff;color:#7c3aed;padding:3px 10px;border-radius:4px;font-size:11px;font-weight:600;">${sanitize(s)}</span>`).join('')}</div></div>` : ''}
      ${d.achievements ? `<div><div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#7c3aed;border-bottom:2px solid #7c3aed;padding-bottom:5px;margin-bottom:10px;">Achievements</div><ul style="margin:0;padding-left:14px;font-size:12px;color:#374151;line-height:1.7;">${parseBullets(d.achievements)}</ul></div>` : ''}
    </div>
  </div>
</div>`;
}

// TEMPLATE 2: Classic (blue bar, traditional)
function renderClassic(d) {
  const allSkills = [...d.techSkills, ...d.softSkills];
  const contact = [d.email, d.phone, d.location, d.linkedin, d.github].filter(Boolean);
  const section = (title, content) => `
    <div style="margin-bottom:20px;">
      <div style="background:#1e3a8a;color:white;padding:6px 14px;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:2px;border-radius:4px;margin-bottom:10px;">${title}</div>
      ${content}
    </div>`;
  return `
<div style="font-family:Georgia,serif;max-width:800px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1);">
  <div style="background:#1e3a8a;color:white;padding:30px 28px;text-align:center;">
    <div style="font-size:30px;font-weight:700;letter-spacing:1px;">${sanitize(d.name).toUpperCase()}</div>
    <div style="font-size:14px;opacity:0.8;margin-top:6px;font-style:italic;">${sanitize(d.title)}</div>
    <div style="margin-top:12px;font-size:12px;opacity:0.75;">${contact.join(' | ')}</div>
  </div>
  <div style="padding:24px 28px;">
    ${d.summary ? section('Profile', `<p style="font-size:13px;line-height:1.7;color:#374151;margin:0;">${sanitize(d.summary)}</p>`) : ''}
    ${d.experience.length ? section('Work Experience', d.experience.map(e=>`<div style="margin-bottom:14px;"><div style="display:flex;justify-content:space-between;"><strong style="font-size:13px;color:#1e3a8a;">${e.role} — ${e.company}</strong><span style="font-size:12px;color:#6b7280;">${e.duration}</span></div><ul style="margin:6px 0;padding-left:18px;font-size:12px;color:#374151;line-height:1.7;">${parseBullets(e.desc)}</ul></div>`).join('')) : ''}
    ${d.education.length ? section('Education', d.education.map(e=>`<div style="display:flex;justify-content:space-between;margin-bottom:8px;"><div><strong style="font-size:13px;color:#1e3a8a;">${e.degree}</strong><div style="font-size:12px;color:#374151;">${e.school}</div></div><div style="font-size:12px;color:#6b7280;text-align:right;">${e.year}<br>${e.gpa}</div></div>`).join('')) : ''}
    ${d.projects.length ? section('Projects', d.projects.map(p=>`<div style="margin-bottom:12px;"><strong style="font-size:13px;color:#1e3a8a;">${p.name}</strong> <span style="font-size:11px;color:#6b7280;">[${sanitize(p.tech)}]</span><ul style="margin:5px 0;padding-left:18px;font-size:12px;color:#374151;line-height:1.7;">${parseBullets(p.desc)}</ul></div>`).join('')) : ''}
    ${allSkills.length ? section('Skills', `<div style="font-size:13px;color:#374151;">${allSkills.join(' • ')}</div>`) : ''}
    ${d.achievements ? section('Achievements & Certifications', `<ul style="margin:0;padding-left:18px;font-size:12px;color:#374151;line-height:1.7;">${parseBullets(d.achievements)}</ul>`) : ''}
  </div>
</div>`;
}

// TEMPLATE 3: Minimal (clean typography, black)
function renderMinimal(d) {
  const allSkills = [...d.techSkills, ...d.softSkills];
  const contact = [d.email, d.phone, d.location, d.linkedin, d.github].filter(Boolean);
  const section = (title, content) => `
    <div style="margin-bottom:24px;padding-top:24px;border-top:1px solid #e5e7eb;">
      <div style="font-size:12px;font-weight:800;letter-spacing:3px;text-transform:uppercase;color:#111827;margin-bottom:14px;">${title}</div>
      ${content}
    </div>`;
  return `
<div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:800px;margin:0 auto;background:#fff;border-radius:8px;padding:40px;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
  <div style="margin-bottom:24px;">
    <div style="font-size:32px;font-weight:900;color:#111827;letter-spacing:-1px;">${sanitize(d.name)}</div>
    <div style="font-size:16px;color:#6b7280;margin-top:4px;">${sanitize(d.title)}</div>
    <div style="display:flex;flex-wrap:wrap;gap:16px;margin-top:10px;font-size:12px;color:#9ca3af;">
      ${contact.map(c => `<span>${sanitize(c)}</span>`).join('')}
    </div>
  </div>
  ${d.summary ? section('Summary', `<div style="font-size:13px;color:#374151;line-height:1.8;">${sanitize(d.summary)}</div>`) : ''}
  ${d.experience.length ? section('Experience', d.experience.map(e=>`<div style="margin-bottom:18px;"><div style="display:flex;justify-content:space-between;"><div><span style="font-size:14px;font-weight:700;color:#111827;">${e.role}</span><span style="font-size:13px;color:#6b7280;"> at ${e.company}</span></div><span style="font-size:12px;color:#9ca3af;">${e.duration}</span></div><ul style="margin:8px 0;padding-left:18px;font-size:12px;color:#374151;line-height:1.8;">${parseBullets(e.desc)}</ul></div>`).join('')) : ''}
  ${d.education.length ? section('Education', d.education.map(e=>`<div style="display:flex;justify-content:space-between;margin-bottom:10px;"><div><div style="font-size:13px;font-weight:700;color:#111827;">${e.degree}</div><div style="font-size:12px;color:#6b7280;">${e.school}</div></div><div style="font-size:12px;color:#9ca3af;text-align:right;">${e.year}<br>${e.gpa}</div></div>`).join('')) : ''}
  ${d.projects.length ? section('Projects', d.projects.map(p=>`<div style="margin-bottom:14px;"><div style="font-size:13px;font-weight:700;color:#111827;">${p.name} <span style="font-weight:400;color:#9ca3af;font-size:11px;">— ${sanitize(p.tech)}</span></div><ul style="margin:6px 0;padding-left:18px;font-size:12px;color:#374151;line-height:1.8;">${parseBullets(p.desc)}</ul></div>`).join('')) : ''}
  ${allSkills.length ? section('Skills', `<div style="display:flex;flex-wrap:wrap;gap:8px;">${allSkills.map(s=>`<span style="border:1px solid #e5e7eb;padding:4px 12px;border-radius:4px;font-size:11px;color:#374151;">${sanitize(s)}</span>`).join('')}</div>`) : ''}
  ${d.achievements ? section('Achievements', `<ul style="margin:0;padding-left:18px;font-size:12px;color:#374151;line-height:1.8;">${parseBullets(d.achievements)}</ul>`) : ''}
</div>`;
}

// TEMPLATE 4: Creative (teal accent, bold)
function renderCreative(d) {
  const allSkills = [...d.techSkills, ...d.softSkills];
  const contact  = [d.email, d.phone, d.location, d.linkedin, d.github].filter(Boolean);
  const section  = (emoji, title, content) => `
    <div style="margin-bottom:22px;">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
        <span style="font-size:18px;">${emoji}</span>
        <div style="font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#0d9488;">${title}</div>
        <div style="flex:1;height:2px;background:linear-gradient(90deg,#0d9488,transparent);border-radius:99px;"></div>
      </div>
      ${content}
    </div>`;
  return `
<div style="font-family:'Inter',sans-serif;max-width:800px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.1);">
  <!-- Creative header -->
  <div style="background:linear-gradient(135deg,#0d9488,#06b6d4);color:white;padding:32px 32px 40px;position:relative;overflow:hidden;">
    <div style="position:absolute;top:-20px;right:-20px;width:160px;height:160px;background:rgba(255,255,255,0.1);border-radius:50%;"></div>
    <div style="position:absolute;bottom:-30px;right:60px;width:100px;height:100px;background:rgba(255,255,255,0.08);border-radius:50%;"></div>
    <div style="font-size:30px;font-weight:800;position:relative;">${sanitize(d.name)}</div>
    <div style="font-size:15px;opacity:0.85;margin-top:5px;position:relative;font-weight:500;">${sanitize(d.title)}</div>
    <div style="display:flex;flex-wrap:wrap;gap:12px;margin-top:16px;position:relative;">
      ${contact.map(c => `<span style="background:rgba(255,255,255,0.15);padding:4px 12px;border-radius:99px;font-size:11px;">${sanitize(c)}</span>`).join('')}
    </div>
  </div>
  <!-- Skills bar at top -->
  ${allSkills.length ? `<div style="background:#f0fdfa;padding:16px 32px;border-bottom:1px solid #ccfbf1;display:flex;flex-wrap:wrap;gap:8px;">${allSkills.map(s=>`<span style="background:#0d9488;color:white;padding:3px 12px;border-radius:99px;font-size:11px;font-weight:600;">${sanitize(s)}</span>`).join('')}</div>` : ''}
  <!-- Body -->
  <div style="padding:28px 32px;">
    ${d.summary ? section('💼','About Me', `<div style="font-size:13px;line-height:1.7;color:#374151;">${sanitize(d.summary)}</div>`) : ''}
    ${d.experience.length ? section('🏢','Experience', d.experience.map(e=>`<div style="margin-bottom:16px;padding:14px;background:#f0fdfa;border-radius:10px;border-left:4px solid #0d9488;"><div style="display:flex;justify-content:space-between;"><strong style="font-size:13px;color:#0d9488;">${e.role}</strong><span style="font-size:11px;color:#6b7280;background:#fff;padding:2px 8px;border-radius:99px;border:1px solid #e5e7eb;">${e.duration}</span></div><div style="font-size:12px;color:#374151;margin:3px 0;">${e.company}${e.location?' · '+e.location:''}</div><ul style="margin:8px 0;padding-left:16px;font-size:12px;color:#374151;line-height:1.7;">${parseBullets(e.desc)}</ul></div>`).join('')) : ''}
    ${d.projects.length ? section('🚀','Projects', d.projects.map(p=>`<div style="margin-bottom:14px;padding:12px;background:#f0fdfa;border-radius:8px;"><div style="display:flex;justify-content:space-between;align-items:center;"><strong style="font-size:13px;color:#0d9488;">${p.name}</strong>${p.link?`<a href="${p.link}" style="font-size:11px;color:#0d9488;text-decoration:none;">${sanitize(p.link)}</a>`:''}</div><div style="font-size:11px;color:#6b7280;margin:3px 0;">🛠 ${sanitize(p.tech)}</div><ul style="margin:6px 0;padding-left:16px;font-size:12px;color:#374151;line-height:1.7;">${parseBullets(p.desc)}</ul></div>`).join('')) : ''}
    ${d.education.length ? section('🎓','Education', d.education.map(e=>`<div style="display:flex;justify-content:space-between;margin-bottom:12px;padding:10px;background:#f0fdfa;border-radius:8px;"><div><strong style="font-size:13px;color:#0d9488;">${e.degree}</strong><div style="font-size:12px;color:#374151;">${e.school}</div></div><div style="text-align:right;font-size:12px;color:#6b7280;">${e.year}<br>${e.gpa}</div></div>`).join('')) : ''}
    ${d.achievements ? section('🏆','Achievements', `<ul style="margin:0;padding-left:16px;font-size:12px;color:#374151;line-height:1.7;">${parseBullets(d.achievements)}</ul>`) : ''}
  </div>
</div>`;
}

// ── RENDER RESUME ────────────────────────────────────────
function renderResume(d) {
  let html = '';
  switch(selectedTemplate) {
    case 'modern':    html = renderModern(d);    break;
    case 'classic':   html = renderClassic(d);   break;
    case 'minimal':   html = renderMinimal(d);   break;
    case 'creative':  html = renderCreative(d);  break;
    case 'executive': html = renderExecutive(d); break;
    case 'devtech':   html = renderDevTech(d);   break;
    default:          html = renderModern(d);
  }

  generatedHTML = html;

  const output = document.getElementById('resume-output');
  const container = document.getElementById('resume-preview-container');
  const empty = document.getElementById('preview-empty');

  if (output) output.innerHTML = html;
  container?.classList.remove('hidden');
  empty?.classList.add('hidden');

  if (window.innerWidth < 900) container?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── DOWNLOAD PDF ─────────────────────────────────────────
async function downloadResume() {
  if (!generatedHTML) { showToast('Generate your resume first', 'error'); return; }
  const btn = document.getElementById('download-btn');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Preparing PDF...';

  try {
    const printWindow = window.open('', '_blank');
    const name = document.getElementById('r-name')?.value || 'My Resume';
    printWindow.document.write(`<!DOCTYPE html>
<html><head><title>${sanitize(name)} — Resume</title><meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'Inter',sans-serif; background:#fff; }
  @media print { body { -webkit-print-color-adjust:exact; print-color-adjust:exact; } }
</style></head>
<body>${generatedHTML}</body></html>`);
    printWindow.document.close();
    setTimeout(() => { printWindow.print(); showToast('💾 Save as PDF using the print dialog!', 'success'); }, 700);
  } catch(e) {
    showToast('Could not open print dialog. Try right-clicking the preview.', 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '⬇️ Download PDF';
  }
}

// TEMPLATE 5: Executive (Royal Navy accent, Georgia/Times font, elegant centered header)
function renderExecutive(d) {
  const allSkills = [...d.techSkills, ...d.softSkills];
  const contact = [d.email, d.phone, d.location, d.linkedin, d.github].filter(Boolean);
  const section = (title, content) => `
    <div style="margin-bottom: 22px;">
      <div style="font-family: Georgia, serif; font-size: 13px; font-weight: bold; text-transform: uppercase; color: #1e3a8a; border-bottom: 1.5px solid #1e3a8a; padding-bottom: 4px; margin-bottom: 10px; letter-spacing: 1.5px;">${title}</div>
      ${content}
    </div>`;
  return `
<div style="font-family: Georgia, 'Times New Roman', serif; max-width: 800px; margin: 0 auto; background: #fff; border-radius: 8px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); color: #1f2937;">
  <!-- Centered Header -->
  <div style="text-align: center; margin-bottom: 28px;">
    <h1 style="font-size: 28px; font-weight: normal; color: #1e3a8a; margin: 0 0 6px 0; letter-spacing: 1px; text-transform: uppercase;">${sanitize(d.name)}</h1>
    <div style="font-size: 14px; font-style: italic; color: #4b5563; margin-bottom: 10px;">${sanitize(d.title)}</div>
    <div style="font-size: 12px; color: #4b5563; display: flex; justify-content: center; flex-wrap: wrap; gap: 8px 12px;">
      ${contact.map(c => `<span>${sanitize(c)}</span>`).join('<span style="color:#d1d5db;"> | </span>')}
    </div>
  </div>

  ${d.summary ? section('Professional Summary', `<p style="font-size: 13.5px; line-height: 1.6; color: #374151; margin: 0; text-align: justify;">${sanitize(d.summary)}</p>`) : ''}

  ${d.experience.length ? section('Professional Experience', d.experience.map(e => `
    <div style="margin-bottom: 16px;">
      <div style="display: flex; justify-content: space-between; align-items: baseline; font-size: 13.5px; margin-bottom: 3px;">
        <strong style="color: #111827; font-weight: bold;">${e.role}</strong>
        <span style="color: #4b5563; font-style: italic; font-size: 12.5px;">${e.duration}</span>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: baseline; font-size: 12.5px; color: #1e3a8a; margin-bottom: 6px; font-style: italic;">
        <span>${e.company}</span>
        ${e.location ? `<span>${e.location}</span>` : ''}
      </div>
      <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #374151; line-height: 1.6; text-align: justify;">
        ${parseBullets(e.desc)}
      </ul>
    </div>
  `).join('')) : ''}

  ${d.projects.length ? section('Key Projects', d.projects.map(p => `
    <div style="margin-bottom: 14px;">
      <div style="display: flex; justify-content: space-between; align-items: baseline; font-size: 13.5px; margin-bottom: 3px;">
        <strong style="color: #111827; font-weight: bold;">${p.name}</strong>
        ${p.link ? `<a href="${p.link}" style="color: #1e3a8a; font-size: 12px; text-decoration: none;">${sanitize(p.link)}</a>` : ''}
      </div>
      <div style="font-size: 12px; color: #4b5563; margin-bottom: 6px; font-style: italic;">Tech Stack: ${sanitize(p.tech)}</div>
      <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #374151; line-height: 1.6; text-align: justify;">
        ${parseBullets(p.desc)}
      </ul>
    </div>
  `).join('')) : ''}

  ${d.education.length ? section('Education', d.education.map(e => `
    <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 10px; font-size: 13.5px;">
      <div>
        <strong style="color: #111827; font-weight: bold;">${e.degree}</strong>
        <div style="color: #4b5563; font-size: 13px;">${e.school}</div>
      </div>
      <div style="text-align: right;">
        <span style="color: #4b5563; font-size: 12.5px; font-style: italic;">${e.year}</span>
        ${e.gpa ? `<div style="color: #4b5563; font-size: 12.5px;">GPA: ${e.gpa}</div>` : ''}
      </div>
    </div>
  `).join('')) : ''}

  ${allSkills.length ? section('Key Expertise', `
    <div style="font-size: 13px; color: #374151; line-height: 1.6; text-align: justify;">
      <strong>Skills:</strong> ${allSkills.join(', ')}
    </div>
  `) : ''}

  ${d.achievements ? section('Achievements & Certifications', `<ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #374151; line-height: 1.6;">${parseBullets(d.achievements)}</ul>`) : ''}
</div>`;
}

// TEMPLATE 6: DevTech Dark (Dark developer layout: slate-gray background, neon green chips, monospaced font accents)
function renderDevTech(d) {
  const allSkills = [...d.techSkills, ...d.softSkills];
  const contact = [d.email, d.phone, d.location, d.linkedin, d.github].filter(Boolean);
  const section = (title, content) => `
    <div style="margin-bottom: 24px; border-top: 1px solid #334155; padding-top: 18px;">
      <div style="font-family: monospace; font-size: 12px; font-weight: bold; color: #10b981; margin-bottom: 12px; letter-spacing: 2px; text-transform: uppercase;">&gt; ${title}</div>
      ${content}
    </div>`;
  return `
<div style="font-family: 'Inter', sans-serif; max-width: 800px; margin: 0 auto; background: #0f172a; color: #f8fafc; border-radius: 12px; padding: 40px; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4); border: 1px solid #1e293b;">
  <!-- Header Column Layout -->
  <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; margin-bottom: 24px; flex-wrap: wrap;">
    <div>
      <h1 style="font-family: monospace; font-size: 32px; font-weight: 800; color: #f8fafc; margin: 0 0 4px 0; letter-spacing: -1px;">${sanitize(d.name)}</h1>
      <div style="font-family: monospace; font-size: 15px; color: #10b981; font-weight: 600;">$ npm run target --role="${sanitize(d.title)}"</div>
    </div>
    <div style="font-family: monospace; font-size: 11px; color: #94a3b8; line-height: 1.6; text-align: right; min-width: 200px;">
      ${contact.map(c => `<div><span style="color:#10b981;">//</span> ${sanitize(c)}</div>`).join('')}
    </div>
  </div>

  ${d.summary ? section('ABOUT_ME', `<p style="font-size: 13px; line-height: 1.7; color: #cbd5e1; margin: 0; text-align: justify;">${sanitize(d.summary)}</p>`) : ''}

  ${d.experience.length ? section('EXPERIENCE_LOG', d.experience.map(e => `
    <div style="margin-bottom: 16px;">
      <div style="display: flex; justify-content: space-between; align-items: baseline; font-size: 13.5px; margin-bottom: 4px;">
        <strong style="font-family: monospace; color: #f8fafc; font-size: 14px;">${e.role} @ <span style="color: #10b981;">${e.company}</span></strong>
        <span style="font-family: monospace; color: #94a3b8; font-size: 11px;">[${e.duration}]</span>
      </div>
      ${e.location ? `<div style="font-family: monospace; font-size: 11px; color: #64748b; margin-bottom: 6px;">Location: ${e.location}</div>` : ''}
      <ul style="margin: 0; padding-left: 18px; font-size: 12.5px; color: #cbd5e1; line-height: 1.7;">
        ${parseBullets(e.desc)}
      </ul>
    </div>
  `).join('')) : ''}

  ${d.projects.length ? section('PROTOTYPES_LAUNCHED', d.projects.map(p => `
    <div style="margin-bottom: 16px;">
      <div style="display: flex; justify-content: space-between; align-items: baseline; font-size: 13.5px; margin-bottom: 4px;">
        <strong style="font-family: monospace; color: #f8fafc; font-size: 14px;">${p.name}</strong>
        ${p.link ? `<a href="${p.link}" style="font-family: monospace; color: #10b981; font-size: 11px; text-decoration: underline;">src_url</a>` : ''}
      </div>
      <div style="font-family: monospace; font-size: 11px; color: #94a3b8; margin-bottom: 6px;">[Stack: ${sanitize(p.tech)}]</div>
      <ul style="margin: 0; padding-left: 18px; font-size: 12.5px; color: #cbd5e1; line-height: 1.7;">
        ${parseBullets(p.desc)}
      </ul>
    </div>
  `).join('')) : ''}

  ${d.education.length ? section('EDUCATION_HISTORY', d.education.map(e => `
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; font-size: 13.5px;">
      <div>
        <strong style="font-family: monospace; color: #f8fafc;">${e.degree}</strong>
        <div style="font-family: monospace; color: #94a3b8; font-size: 12px;">${e.school}</div>
      </div>
      <div style="text-align: right; font-family: monospace; font-size: 11px; color: #94a3b8;">
        <div>${e.year}</div>
        ${e.gpa ? `<div style="color: #10b981;">GPA: ${e.gpa}</div>` : ''}
      </div>
    </div>
  `).join('')) : ''}

  ${allSkills.length ? section('CORE_COMPETENCIES', `
    <div style="display: flex; flex-wrap: wrap; gap: 8px;">
      ${allSkills.map(s => `<span style="font-family: monospace; background: #1e293b; color: #10b981; border: 1px solid #334155; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 600;">${sanitize(s)}</span>`).join('')}
    </div>
  `) : ''}

  ${d.achievements ? section('HONORS_AND_AWARDS', `<ul style="margin: 0; padding-left: 18px; font-size: 12.5px; color: #cbd5e1; line-height: 1.7;">${parseBullets(d.achievements)}</ul>`) : ''}
</div>`;
}

// ── TAB SWITCHING ────────────────────────────────────────
function switchResumeTab(tabName) {
  const tabEditor = document.getElementById('resume-tab-editor');
  const tabAts = document.getElementById('resume-tab-ats');
  const formEditor = document.getElementById('resume-editor-form');
  const panelAts = document.getElementById('resume-ats-panel');

  if (tabName === 'editor') {
    tabEditor?.classList.add('active');
    tabAts?.classList.remove('active');
    if (formEditor) formEditor.style.display = 'block';
    if (panelAts) panelAts.style.display = 'none';
  } else if (tabName === 'ats') {
    tabEditor?.classList.remove('active');
    tabAts?.classList.add('active');
    if (formEditor) formEditor.style.display = 'none';
    if (panelAts) panelAts.style.display = 'block';
  }
}

// ── ATS OPTIMIZER ────────────────────────────────────────
async function analyzeATS() {
  if (!hasApiKey()) { openModal('api-modal'); return; }
  const jobDesc = document.getElementById('ats-job-desc')?.value?.trim();
  if (!jobDesc) { showToast('⚠️ Please paste a Job Description first!', 'error'); return; }

  const data = collectData();
  if (!data.name) { showToast('Please enter your full name', 'error'); return; }
  if (!data.title) { showToast('Please enter your target job title', 'error'); return; }

  const btn = document.getElementById('ats-analyze-btn');
  const originalHTML = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> AI analyzing match score...';

  const systemPrompt = `You are an expert applicant tracking system (ATS) analyzer and career adviser. Analyze the provided resume details against the target job description.
Return a JSON object with the following fields:
{
  "score": 75,
  "matchLevel": "Good Match",
  "matchingKeywords": ["Keyword1", "Keyword2"],
  "missingKeywords": ["Keyword3", "Keyword4"],
  "feedback": "Step-by-step formatting and keyword suggestions. Keep it readable with bullet points."
}
"matchLevel" should be: "Poor Match" (<50), "Average Match" (50-69), "Good Match" (70-85), "Excellent Match" (>85).
Return ONLY this JSON object. Do not include markdown code block formatting or any other text before/after the JSON.`;

  const userPrompt = `Target Job Description:
${jobDesc}

Resume Data:
${JSON.stringify(data)}`;

  try {
    let resText = await callAI(userPrompt, systemPrompt, true);
    resText = resText.trim();
    if (resText.startsWith('```')) {
      resText = resText.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
    }
    const result = JSON.parse(resText);

    // Update Progress Ring
    const ringFill = document.getElementById('ats-ring-fill');
    const scoreText = document.getElementById('ats-score-text');
    const matchLevel = document.getElementById('ats-match-level');

    if (ringFill) {
      const score = Math.min(100, Math.max(0, parseInt(result.score) || 0));
      const offset = 251.2 - (251.2 * score) / 100;
      ringFill.style.strokeDashoffset = offset;
    }
    if (scoreText) scoreText.textContent = `${result.score}%`;
    if (matchLevel) matchLevel.textContent = result.matchLevel || 'Match Checked';

    // Render keyword lists
    const matchGrid = document.getElementById('ats-match-grid');
    const missingGrid = document.getElementById('ats-missing-grid');

    if (matchGrid) {
      matchGrid.innerHTML = (result.matchingKeywords || []).map(k => `
        <span class="keyword-badge match">
          <span>✅</span> ${sanitize(k)}
        </span>
      `).join('') || '<div style="font-size:12px;color:var(--text-muted);">No matching keywords found.</div>';
    }

    if (missingGrid) {
      missingGrid.innerHTML = (result.missingKeywords || []).map(k => `
        <span class="keyword-badge missing">
          <span>⚠️</span> ${sanitize(k)}
        </span>
      `).join('') || '<div style="font-size:12px;color:var(--text-muted);">No missing keywords! You are a perfect match.</div>';
    }

    // Render optimization roadmap
    const feedbackText = document.getElementById('ats-feedback-text');
    if (feedbackText) {
      feedbackText.innerHTML = formatMarkdown(result.feedback || '');
    }

    // Show result card
    const resultCard = document.getElementById('ats-result-card');
    if (resultCard) resultCard.style.display = 'block';

    showToast('🎉 ATS Analysis Complete!', 'success');
  } catch (err) {
    console.error(err);
    showToast('❌ ATS analysis failed. Please verify your API key and try again.', 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalHTML;
  }
}

// ── BULLET OPTIMIZER ─────────────────────────────────────
async function tailorBullets(type, idx) {
  if (!hasApiKey()) { openModal('api-modal'); return; }
  const jobDesc = document.getElementById('ats-job-desc')?.value?.trim();
  if (!jobDesc) {
    showToast('⚠️ Please paste a Job Description in the ATS Optimizer tab first!', 'error');
    switchResumeTab('ats');
    document.getElementById('ats-job-desc')?.focus();
    return;
  }

  let txt = null;
  let cardContext = '';

  if (type === 'exp') {
    const card = document.getElementById(`exp-${idx}`);
    txt = card?.querySelector('.exp-desc');
    const company = card?.querySelector('.exp-company')?.value || '';
    const role = card?.querySelector('.exp-role')?.value || '';
    cardContext = `Role: ${role} at ${company}`;
  } else if (type === 'proj') {
    const card = document.getElementById(`proj-${idx}`);
    txt = card?.querySelector('.proj-desc');
    const name = card?.querySelector('.proj-name')?.value || '';
    const tech = card?.querySelector('.proj-tech')?.value || '';
    cardContext = `Project: ${name} (Tech Stack: ${tech})`;
  }

  if (!txt) { showToast('Could not locate description text field.', 'error'); return; }
  const currentDesc = txt.value.trim();

  const btn = document.getElementById(`tailor-btn-${type}-${idx}`);
  const originalHTML = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner" style="width:10px;height:10px;border-width:1.5px;margin-right:4px;"></span> Tailoring...';

  const prompt = `You are an expert resume writer. Tailor the description bullets for the following ${type === 'exp' ? 'work experience' : 'project'} to match the target job requirements.
Context: ${cardContext}
Current description: "${currentDesc}"

Target Job Description:
${jobDesc}

Rewrite this description into 2 to 3 high-impact resume bullet points.
Rules:
- Start each bullet point with a strong action verb.
- Incorporate matching keywords and skills from the target Job Description.
- Quantify achievements and impact with realistic metrics or percentages.
- Output ONLY the bullet points, one per line, starting with •. Do not include introductory or explanatory text.`;

  try {
    const tailoredText = await callAI(prompt);
    txt.value = tailoredText.trim();
    
    // Refresh preview if already generated
    if (generatedHTML) {
      const updatedData = collectData();
      window._lastResumeData = updatedData;
      renderResume(updatedData);
    }
    
    showToast('✨ Bullet points tailored successfully!', 'success');
  } catch (err) {
    console.error(err);
    showToast('❌ Failed to tailor bullet points. Check API key.', 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalHTML;
  }
}

// Helper to convert simple markdown to HTML
function formatMarkdown(text) {
  return sanitize(text)
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^-\s+(.*)$/gm, '• $1');
}

// ── INIT ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initTagInputs();
  initTemplateSelector();
});
