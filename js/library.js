// ===== CAREERBOOST AI - ANSWER LIBRARY JS =====

const QA_DATA = [
  // ─── BEHAVIORAL ─────────────────────────────────────────────────────────────
  {
    cat: 'behavioral',
    q: 'Tell me about yourself.',
    a: `Start with your current status (student/fresher), then your education and key skills, then your most relevant project or internship, and end with why you're excited about this role.

Example: "I'm a final-year B.Tech Computer Science student at JNTU Hyderabad. Over the past two years, I've built strong skills in React, Node.js, and MongoDB by working on 5+ projects, including a real-time chat app and a student portal. Last semester, I completed an internship at a startup where I built REST APIs that reduced response time by 30%. I'm particularly excited about this role because it aligns perfectly with my interest in building scalable web applications."`,
    tip: 'Keep it under 90 seconds. Always end with why THIS company/role excites you.'
  },
  {
    cat: 'behavioral',
    q: 'What is your greatest weakness?',
    a: `Choose a real weakness — but one you're actively improving. Never say "I work too hard" (interviewers see through it).

Example: "I've historically struggled with public speaking and presenting my work to large groups. I know communication is crucial in tech roles, so over the past 6 months I've been actively working on it — I joined my college's debate club, started recording myself presenting to improve, and volunteered to present our project at a department seminar. I've noticed significant improvement, though I know I still have room to grow."`,
    tip: 'The weakness → action plan → measurable improvement formula is gold.'
  },
  {
    cat: 'behavioral',
    q: 'Tell me about a time you failed.',
    a: `Use the STAR method: Situation, Task, Action, Result. Be honest — interviewers respect self-awareness.

Example: "In my second year, I led a team project to build a library management system. We underestimated the complexity and I didn't communicate timeline risks to my professor early enough. We submitted an incomplete version. The result was a lower grade, but the learning was massive. I immediately set up weekly check-ins for future projects, broke tasks into smaller milestones, and started using Trello to track progress. Every project since then has been delivered on time."`,
    tip: 'Always end with what you LEARNED and what changed — that\'s what they\'re evaluating.'
  },
  {
    cat: 'behavioral',
    q: 'Why do you want to work at this company?',
    a: `Research the company before the interview and mention something SPECIFIC.

Example: "I've been following your company's work for over a year, particularly the work your team did on [specific product/feature]. What excites me most is your engineering culture — the blog posts from your team show a strong emphasis on code quality and developer experience, which aligns with how I approach my own projects. Beyond the technical culture, your mission of [company mission] genuinely resonates with me. I want to grow in an environment that moves fast, values learning, and has real user impact."`,
    tip: 'Generic answers are interview killers. Spend 20 minutes researching before every interview.'
  },
  {
    cat: 'behavioral',
    q: 'Where do you see yourself in 5 years?',
    a: `Show ambition but align with the company's growth opportunities.

Example: "In 5 years, I see myself as a senior engineer who has mastered both the technical and collaborative aspects of software development. I want to have shipped features used by thousands of users, mentored junior developers, and deepened my expertise in system design and architecture. I'm drawn to companies like yours because the growth path seems clear — strong engineers here go on to lead teams and products. That's exactly the trajectory I'm aiming for."`,
    tip: 'Don\'t say "I want your job" — but do show leadership ambition after 3-5 years.'
  },
  {
    cat: 'behavioral',
    q: 'Describe a time you worked in a difficult team.',
    a: `Show conflict resolution skills without badmouthing teammates.

Example: "During a group project, there was significant disagreement between two team members about the tech stack, which was slowing us down. As the informal team lead, I set up a structured meeting where each person presented their approach with pros and cons. We ended up choosing a hybrid solution that leveraged both ideas. I learned that conflict isn't about winning — it's about finding the solution that serves the project best. After that session, our team dynamic improved significantly and we delivered ahead of schedule."`,
    tip: 'Focus on YOUR actions and what YOU did to resolve it — not on blaming others.'
  },
  {
    cat: 'behavioral',
    q: 'What motivates you?',
    a: `Be authentic — connect motivation to the role.

Example: "Honestly, what drives me most is that feeling when something I built solves a real problem for real people. When I built a study timer app for my college friends, seeing them actually use it daily was incredibly motivating. I also love the continuous learning aspect of software development — there's always something new to learn, which keeps me genuinely engaged. The challenge of turning a complex problem into elegant, working code is something I find genuinely exciting every day."`,
    tip: 'Avoid "money" or "job security" as primary motivators — even if true.'
  },
  {
    cat: 'behavioral',
    q: 'How do you handle stress and pressure?',
    a: `Show that you have systems and self-awareness, not that you never get stressed.

Example: "I've learned that pressure is inevitable in software development — deadlines slip, bugs appear, requirements change. My approach is to break overwhelming problems into small, concrete tasks and tackle them one at a time. When I'm stressed about a deadline, I do a quick priority audit: what absolutely must be done, what can be simplified, and what can wait. Exercise also really helps me reset — a 20-minute walk usually gives me clarity I couldn't find staring at a screen. I've also found that being transparent with teammates about blockers early prevents small problems from becoming big ones."`,
    tip: 'Give a specific system or strategy, not just "I stay calm."'
  },

  // ─── HR ─────────────────────────────────────────────────────────────────────
  {
    cat: 'hr',
    q: 'What are your salary expectations?',
    a: `Research the market rate first. Don't anchor too low or too high.

Example: "Based on my research of current market rates for this role in [city], and considering my skills in [key skills] and the projects I've worked on, I'm looking at a range of [X to Y]. That said, I'm flexible and more focused on the overall opportunity — the learning, growth potential, and the work itself are very important to me. I'm confident we can find a number that works for both of us."`,
    tip: 'Always give a range, not a single number. The lower end should be your actual minimum.'
  },
  {
    cat: 'hr',
    q: 'Are you comfortable with relocation?',
    a: `Be honest — but show flexibility and enthusiasm for the role.

Example: "Yes, I'm open to relocation. I've actually been researching [city] and it seems like an exciting place to be, especially for the tech industry. I'd want to plan the logistics thoughtfully — things like housing and settling in — but those are manageable. What I care most about is joining the right team and contributing meaningfully, and I'm willing to make the move for that."`,
    tip: 'If you\'re NOT open to relocation, say so clearly but professionally — it saves everyone time.'
  },
  {
    cat: 'hr',
    q: 'How soon can you join?',
    a: `Be specific and realistic. Don't say "immediately" if that's not true.

Example: "I can join within [X weeks] of receiving the offer. I'd need some time to wrap up my current commitments and sort out the logistics of the transition. I want to start on the right foot — fully available and prepared to contribute from day one. Is there a specific joining date that works for the team?"`,
    tip: 'Always ask about THEIR preferred joining date — shows you\'re thinking about their needs.'
  },
  {
    cat: 'hr',
    q: 'Do you have any questions for us?',
    a: `ALWAYS have questions. This is a conversation, not an interrogation. It shows genuine interest.

Questions that work well:
• "What does success look like for someone in this role after the first 90 days?"
• "What does the day-to-day of this role look like?"
• "What's the team culture like, and how does the team typically collaborate?"
• "What are the biggest challenges the team is currently facing?"
• "What are the opportunities for growth and learning here?"
• "What do you personally enjoy most about working here?"`,
    tip: 'Prepare 4-5 questions so you still have some if a few get answered during the interview.'
  },
  {
    cat: 'hr',
    q: 'Why should we hire you?',
    a: `This is your 60-second sales pitch. Be confident and specific.

Example: "There are three things I believe I bring to this role that are particularly relevant. First, I have hands-on experience with the exact tech stack you use — I've built production-level projects using React and Node.js. Second, I'm genuinely passionate about this problem space — I've spent time using your product and have specific ideas about where I'd contribute. Third, I'm a fast learner who adapts quickly — in my last internship, I picked up a new framework in two weeks and delivered a feature that week. I'm confident I can contribute meaningfully from day one."`,
    tip: '3 specific, evidence-backed reasons > generic enthusiasm.'
  },

  // ─── TECHNICAL ──────────────────────────────────────────────────────────────
  {
    cat: 'technical',
    q: 'Explain the difference between SQL and NoSQL databases.',
    a: `SQL databases (like MySQL, PostgreSQL) are relational — data is stored in tables with rows and columns, and relationships are enforced with foreign keys. They're ACID compliant (Atomic, Consistent, Isolated, Durable) and great for structured data with complex queries.

NoSQL databases (like MongoDB, DynamoDB, Redis) are non-relational. They store data as documents, key-value pairs, graphs, or wide-columns. They're horizontally scalable and great for unstructured or rapidly changing data.

When to choose:
• SQL → financial data, user auth, anything needing complex joins and transactions
• NoSQL → real-time feeds, IoT data, catalogs, anything needing massive scale or flexible schema

The modern trend is "polyglot persistence" — using both in the same system for different use cases.`,
    tip: 'Always follow up with: "Which would you prefer for this use case and why?" — shows systems thinking.'
  },
  {
    cat: 'technical',
    q: 'What is REST API and what are its principles?',
    a: `REST (Representational State Transfer) is an architectural style for building APIs over HTTP.

Core principles (constraints):
1. **Stateless** — each request contains all info needed; server doesn't store client state between requests
2. **Client-Server** — frontend and backend are separate concerns
3. **Uniform Interface** — consistent, predictable endpoints (GET /users, POST /users, etc.)
4. **Cacheable** — responses can be cached to improve performance
5. **Layered System** — client doesn't know if it's talking directly to the server or a proxy/CDN

HTTP methods in REST:
• GET → read data (safe, idempotent)
• POST → create new resource
• PUT/PATCH → update existing resource
• DELETE → remove resource

Status codes matter: 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Server Error.`,
    tip: 'Know the difference between PUT (full replace) and PATCH (partial update).'
  },
  {
    cat: 'technical',
    q: 'What is the difference between == and === in JavaScript?',
    a: `This is one of JavaScript's most common gotchas.

**== (Loose equality)**: Compares values after type coercion (converting types to match).
\`\`\`
5 == "5"   // true (string "5" coerced to number 5)
0 == false // true (false coerced to 0)
null == undefined // true
\`\`\`

**=== (Strict equality)**: Compares both value AND type. No coercion.
\`\`\`
5 === "5"   // false (different types)
0 === false // false (number vs boolean)
null === undefined // false
\`\`\`

**Best practice**: Always use === in production code. It's predictable and avoids subtle bugs. The only common exception is \`x == null\` which checks for both null AND undefined.`,
    tip: 'Also know Object.is() — it\'s like === but correctly handles NaN and -0.'
  },
  {
    cat: 'technical',
    q: 'Explain the concept of time complexity and Big O notation.',
    a: `Time complexity measures how the runtime of an algorithm grows relative to input size. Big O notation expresses the worst-case scenario.

Common complexities (from best to worst):
• **O(1)** — Constant. Same time regardless of input. Example: array[0]
• **O(log n)** — Logarithmic. Halves the problem each step. Example: binary search
• **O(n)** — Linear. One operation per input element. Example: loop through array
• **O(n log n)** — Linearithmic. Example: merge sort, quicksort
• **O(n²)** — Quadratic. Nested loops. Example: bubble sort
• **O(2ⁿ)** — Exponential. Doubles each step. Example: naive Fibonacci recursion

Real example: Finding a word in a dictionary:
• Flip to random pages: O(n)
• Binary search by alphabet: O(log n)
• Direct index lookup: O(1)`,
    tip: 'When analyzing your code in interviews, always state the time AND space complexity.'
  },
  {
    cat: 'technical',
    q: 'What is the difference between a process and a thread?',
    a: `A **process** is an independent program in execution. It has its own memory space (heap, stack, code) and system resources. Processes are isolated — one crashing doesn't directly affect another.

A **thread** is a unit of execution within a process. Multiple threads share the same memory space and resources of their parent process.

Key differences:
| | Process | Thread |
|---|---|---|
| Memory | Separate | Shared |
| Communication | IPC (expensive) | Shared memory (fast) |
| Creation cost | High | Low |
| Crash impact | Isolated | Can crash whole process |

In modern development:
• **Node.js** is single-threaded but handles concurrency with its event loop
• **Python** has the GIL limiting true thread parallelism
• **Java** and **Go** excel at multi-threading`,
    tip: 'Follow up with how JavaScript handles concurrency without threads (event loop + callback queue).'
  },
  {
    cat: 'technical',
    q: 'What is Object-Oriented Programming? Explain its four pillars.',
    a: `OOP is a programming paradigm that organizes code around objects (real-world entities with data + behavior).

**Four pillars:**

1. **Encapsulation** — Bundling data and methods that operate on that data into one unit (class), and restricting direct access to some components. Example: a BankAccount class exposes deposit() and withdraw() but hides the balance variable.

2. **Abstraction** — Hiding complex implementation details and exposing only essential features. Example: you call car.drive() without knowing how the engine works internally.

3. **Inheritance** — A class can inherit properties and methods from another class, promoting code reuse. Example: Dog extends Animal, inheriting eat() and sleep() while adding bark().

4. **Polymorphism** — The ability to use a single interface for different data types. Example: the same draw() method works differently for Circle, Square, and Triangle objects.`,
    tip: 'Always give a concrete, relatable example for each pillar — not just definitions.'
  },

  // ─── CODING ─────────────────────────────────────────────────────────────────
  {
    cat: 'coding',
    q: 'What are the differences between an array and a linked list?',
    a: `**Array:**
• Stores elements in contiguous memory locations
• O(1) random access by index
• O(n) insertion/deletion (shifting elements)
• Fixed size (static) or dynamic resizing (with overhead)
• Better cache performance due to memory locality

**Linked List:**
• Nodes stored anywhere in memory, connected by pointers
• O(n) access (must traverse from head)
• O(1) insertion/deletion at known position
• Dynamic size — grows/shrinks easily
• Extra memory for pointers

**When to use:**
• Array → when you need fast random access and size is known
• Linked List → when you need frequent insertions/deletions especially at front/middle
• Most modern languages use dynamic arrays (Python list, Java ArrayList) as the default

Analogy: Array = cinema seats (numbered, fixed, easy to find). Linked List = treasure hunt (each clue points to the next location).`,
    tip: 'Be prepared to implement both from scratch and solve problems like "reverse a linked list."'
  },
  {
    cat: 'coding',
    q: 'Explain recursion and when to use it.',
    a: `Recursion is when a function calls itself to solve a smaller version of the same problem, until a base case (stopping condition) is reached.

**Classic example — Factorial:**
\`\`\`javascript
function factorial(n) {
  if (n <= 1) return 1;  // base case
  return n * factorial(n - 1);  // recursive case
}
factorial(5) = 5 * 4 * 3 * 2 * 1 = 120
\`\`\`

**When recursion shines:**
• Tree/graph traversal (DFS)
• Divide and conquer (merge sort, quicksort)
• Problems with naturally recursive structure (file system, JSON parsing)
• Backtracking (sudoku solver, maze)

**Downsides:**
• Stack overflow risk for deep recursion
• Can be slower than iterative due to function call overhead
• Harder to debug

**Key rule:** Every recursive function MUST have a base case, or it runs forever.`,
    tip: 'Always identify: 1) Base case, 2) Recursive case, 3) How each call moves toward the base case.'
  },
  {
    cat: 'coding',
    q: 'What is dynamic programming?',
    a: `Dynamic programming (DP) is an optimization technique that solves complex problems by breaking them into overlapping subproblems and storing results to avoid recomputation.

**When to use DP:**
1. The problem has **overlapping subproblems** (same subproblem solved multiple times)
2. The problem has **optimal substructure** (optimal solution built from optimal solutions of subproblems)

**Classic example — Fibonacci:**
Naive recursion: O(2ⁿ) — recalculates same values many times

With memoization (top-down DP):
\`\`\`javascript
const memo = {};
function fib(n) {
  if (n <= 1) return n;
  if (memo[n]) return memo[n];
  memo[n] = fib(n-1) + fib(n-2);
  return memo[n];
}
// Now O(n) time!
\`\`\`

**Famous DP problems:**
• Longest Common Subsequence
• 0/1 Knapsack
• Coin Change
• Edit Distance
• Matrix Chain Multiplication`,
    tip: 'Interviewers love asking: "Can you optimize this recursive solution with DP?" Always look for overlapping subproblems.'
  },
  {
    cat: 'coding',
    q: 'Explain the difference between stack and queue.',
    a: `Both are linear data structures but with different access patterns.

**Stack — LIFO (Last In, First Out)**
• Think: stack of plates. Last plate placed is first to be removed.
• Operations: push (add to top), pop (remove from top), peek (view top)
• O(1) for push, pop, peek
• Use cases: undo/redo, function call stack, bracket matching, DFS

**Queue — FIFO (First In, First Out)**
• Think: line at a ticket counter. First person in is first to be served.
• Operations: enqueue (add to rear), dequeue (remove from front)
• O(1) for both with proper implementation (using linked list or circular array)
• Use cases: BFS, task scheduling, print queue, event processing

**Real example in programming:**
• Stack → JavaScript call stack (how function calls are tracked)
• Queue → Node.js event queue (async callbacks waiting to run)`,
    tip: 'Be ready to implement both with arrays and linked lists. Common interview: "implement a queue using two stacks."'
  },

  // ─── SITUATIONAL ────────────────────────────────────────────────────────────
  {
    cat: 'situational',
    q: 'If you discovered a critical bug just before a production release, what would you do?',
    a: `This tests your judgment, communication skills, and priorities under pressure.

My approach:
1. **Assess severity immediately** — How critical is it? Data loss? Security hole? Minor UI glitch? The severity determines urgency.

2. **Don't push alone — communicate first** — Alert the team lead/manager immediately. No hero moves in production. "I found a bug in [component]. Here's what it does. Here are the options."

3. **Present options, not just problems:**
   - Fix it now (how long will it take?)
   - Delay the release
   - Deploy with a feature flag disabled
   - Deploy and hotfix immediately after

4. **Document it** — Log the bug, affected systems, and the decision made regardless of path.

5. **Post-mortem mindset** — After resolution, understand how to prevent it (better testing, CI/CD checks, code review process).

The worst thing you can do is either push anyway and hope nobody notices, or freeze without communicating.`,
    tip: 'Shows you understand: communication > heroics. Always bring options to your manager, not just problems.'
  },
  {
    cat: 'situational',
    q: 'How would you handle disagreeing with your manager\'s technical decision?',
    a: `This tests professional maturity and communication.

My approach:

1. **Make sure I fully understand their reasoning first** — Ask clarifying questions before pushing back. "Help me understand the reasoning behind this approach?"

2. **Prepare my case with data** — I'd document my concerns with specifics: performance implications, maintainability risks, alternatives considered.

3. **Have the conversation privately** — Never challenge authority in front of the team. Request a 1:1.

4. **Present it as a discussion, not a debate** — "I have some concerns I'd like to walk you through. Would you be open to taking 15 minutes to look at this together?"

5. **Accept the decision gracefully** — If they hear me out and still proceed, I execute the decision 100%. Decisions are made at different levels of context. I may not have all the information.

6. **Document my concerns** — So if issues arise later, there's a record, and learning can happen.

The goal is influence through ideas, not position.`,
    tip: 'This question is really about "are you easy to work with while still being a strong thinker?" Show both.'
  },
  {
    cat: 'situational',
    q: 'How do you prioritize tasks when you have multiple urgent deadlines?',
    a: `My approach:

1. **List everything out** — Brain dump all tasks with their actual deadlines and dependencies.

2. **Evaluate by impact and urgency** — I use a simple 2×2: urgent+important (do first), important+not urgent (schedule), urgent+not important (delegate if possible), neither (drop or defer).

3. **Communicate proactively** — If I genuinely can't hit all deadlines with quality, I tell stakeholders early. "I'm working on X and Y. Both are due Friday. If I maintain quality on both, I may need an extra day on Y. Is that acceptable, or should we reprioritize?"

4. **Break tasks into milestones** — Instead of "finish the feature", I set checkpoints: API done by Tuesday, UI by Wednesday, testing by Thursday.

5. **Protect deep work time** — High-cognitive tasks need focused blocks. I batch meetings and communication into specific windows.

The worst outcome is working hard in silence and delivering nothing or poor quality. Communication is the real priority management skill.`,
    tip: 'Mentioning a real tool you use (Notion, Trello, even pen & paper) makes this more credible.'
  },
  {
    cat: 'situational',
    q: 'What would you do if you were given a task you\'ve never done before?',
    a: `This tests learning agility and resourcefulness.

My approach:

1. **Clarify requirements first** — Before googling anything, make sure I understand exactly what "done" looks like. What's the output? What's the deadline? What constraints exist?

2. **Break it down** — Even unfamiliar problems have familiar components. I decompose the task into pieces I can reason about individually.

3. **Research systematically** — Official documentation first, then trusted community resources (Stack Overflow, GitHub issues). I don't just copy-paste — I read to understand.

4. **Build a small proof of concept** — For technical tasks, I'll spend an hour building a minimal prototype before writing production code. Fail fast.

5. **Ask targeted questions** — If I'm stuck after genuine effort, I'll ask for help but with a specific, well-formed question: "I've tried X and Y. I'm stuck at Z. Do you have any pointers?"

6. **Document as I go** — For future me and future teammates.

I genuinely enjoy unfamiliar challenges. They're how I grow the fastest.`,
    tip: 'This question is often asked to freshers specifically. The honest answer shows initiative and coachability.'
  }
];

let activeFilter = 'all';
let activeSearch = '';

// ── RENDER ───────────────────────────────────────────────
function renderLibrary() {
  const list = document.getElementById('qa-list');
  if (!list) return;

  const filtered = QA_DATA.filter(item => {
    const catMatch = activeFilter === 'all' || item.cat === activeFilter;
    const searchMatch = !activeSearch ||
      item.q.toLowerCase().includes(activeSearch) ||
      item.a.toLowerCase().includes(activeSearch);
    return catMatch && searchMatch;
  });

  document.getElementById('q-count').textContent = `Showing ${filtered.length} question${filtered.length !== 1 ? 's' : ''}`;

  if (!filtered.length) {
    list.innerHTML = '<div style="text-align:center;padding:60px;color:var(--text-muted);"><div style="font-size:48px;margin-bottom:16px;">🔍</div><div>No questions found. Try a different search or filter.</div></div>';
    return;
  }

  list.innerHTML = filtered.map((item, i) => {
    const catLabels = { behavioral: '🧠 Behavioral', technical: '💻 Technical', hr: '🤝 HR Round', coding: '⌨️ Coding', situational: '💼 Situational' };
    const answerFormatted = item.a.replace(/\n/g, '<br>').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/`([^`]+)`/g, '<code style="background:rgba(124,58,237,0.1);padding:2px 6px;border-radius:4px;font-family:monospace;font-size:13px;color:var(--purple-light);">$1</code>');

    return `<div class="card qa-item" id="qa-${i}" onclick="toggleQA(${i})">
      <div class="qa-header">
        <div class="qa-question">${sanitize(item.q)}</div>
        <div class="qa-meta">
          <span class="qa-cat">${catLabels[item.cat] || item.cat}</span>
          <span class="qa-toggle">▼</span>
        </div>
      </div>
      <div class="qa-answer">
        ${answerFormatted}
        ${item.tip ? `<div class="qa-tip"><strong>💡 Pro Tip:</strong> ${sanitize(item.tip)}</div>` : ''}
        <div style="margin-top:14px;display:flex;gap:10px;flex-wrap:wrap;">
          <button class="btn btn-outline btn-sm" onclick="speakAnswer(event, ${i})">🔊 Hear It Spoken</button>
          <button class="btn btn-secondary btn-sm" onclick="aiPersonalize(event, ${i})">✨ Personalize with AI</button>
        </div>
        <div id="personalized-${i}" class="hidden" style="margin-top:14px;">
          <div class="best-answer-box">
            <div class="best-answer-label">✨ Personalized for You</div>
            <div class="best-answer-text" id="personalized-text-${i}">Loading...</div>
          </div>
        </div>
      </div>
    </div>`;
  }).join('');
}

function toggleQA(idx) {
  const el = document.getElementById(`qa-${idx}`);
  el?.classList.toggle('open');
}

function setFilter(cat) {
  activeFilter = cat;
  document.querySelectorAll('.filter-chip').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.cat === cat);
  });
  renderLibrary();
}

function filterQuestions() {
  activeSearch = document.getElementById('lib-search')?.value?.toLowerCase() || '';
  renderLibrary();
}

// ── SPEAK ANSWER ─────────────────────────────────────────
function speakAnswer(e, idx) {
  e.stopPropagation();
  const item = QA_DATA.filter(i => {
    const catMatch = activeFilter === 'all' || i.cat === activeFilter;
    const searchMatch = !activeSearch || i.q.toLowerCase().includes(activeSearch) || i.a.toLowerCase().includes(activeSearch);
    return catMatch && searchMatch;
  })[idx];
  if (!item) return;
  speak(item.a);
  showToast('🔊 Speaking the answer...', 'info');
}

// ── PERSONALIZE WITH AI ──────────────────────────────────
async function aiPersonalize(e, idx) {
  e.stopPropagation();
  if (!hasApiKey()) { openModal('api-modal'); return; }

  const filtered = QA_DATA.filter(i => {
    const catMatch = activeFilter === 'all' || i.cat === activeFilter;
    const searchMatch = !activeSearch || i.q.toLowerCase().includes(activeSearch) || i.a.toLowerCase().includes(activeSearch);
    return catMatch && searchMatch;
  });
  const item = filtered[idx];
  if (!item) return;

  const outputDiv = document.getElementById(`personalized-${idx}`);
  const textDiv = document.getElementById(`personalized-text-${idx}`);
  outputDiv?.classList.remove('hidden');
  if (textDiv) textDiv.textContent = '⏳ Personalizing...';

  try {
    const userContext = localStorage.getItem('cb_user_context') || 'a computer science student applying for a software engineering internship';
    const prompt = `Personalize this interview answer for ${userContext}.

Original Question: "${item.q}"
Original Answer: "${item.a}"

Make it more natural, conversational, and tailored to a student/fresher context. Keep the same key points but make it sound like the person is speaking from their own genuine experience. 120-180 words.`;

    const result = await callGemini(prompt);
    if (textDiv) textDiv.textContent = result;
  } catch(e) {
    if (textDiv) textDiv.textContent = 'Failed to personalize. Please check your API key.';
  }
}

// ── AI GEN AREA ──────────────────────────────────────────
function toggleAiGen() {
  const area = document.getElementById('ai-gen-area');
  area?.classList.toggle('hidden');
}

async function generateCustomAnswer() {
  if (!hasApiKey()) { openModal('api-modal'); return; }

  const q = document.getElementById('custom-q')?.value?.trim();
  const role = document.getElementById('custom-role')?.value?.trim() || 'a student applying for a software engineering role';
  if (!q) { showToast('Please enter a question', 'error'); return; }

  const outputDiv = document.getElementById('custom-answer-output');
  const textDiv = document.getElementById('custom-answer-text');
  outputDiv?.classList.remove('hidden');
  if (textDiv) textDiv.textContent = '✨ Generating your personalized answer...';

  try {
    const prompt = `You are an expert career coach helping ${role}.

Interview Question: "${q}"

Write the BEST possible answer to this question. Make it:
- Natural and conversational (not robotic)
- Specific with relevant examples for a student/fresher
- Uses STAR method if behavioral
- Clear and confident in tone
- 120-180 words

Write the answer directly as if the person is speaking it. No intro lines.`;

    const result = await callGemini(prompt);
    if (textDiv) textDiv.textContent = result;
    showToast('✨ Custom answer generated!', 'success');
  } catch(e) {
    if (textDiv) textDiv.textContent = 'Failed to generate. Please check your API key.';
  }
}

// ── INIT ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderLibrary();
});

// ── TOGGLE GENERATE SECTION ───────────────────────────────
function toggleAIGenSection() {
  const section = document.getElementById('ai-gen-section');
  if (!section) return;
  section.style.display = section.style.display === 'none' ? 'block' : 'none';
}

// ── GENERATE NEW LIBRARY QUESTIONS ───────────────────────
async function generateLibraryQuestions() {
  if (!hasApiKey()) {
    showToast('Please set your API key first!', 'error');
    openModal('api-modal'); return;
  }

  const role   = document.getElementById('lib-role')?.value || 'Software Engineer';
  const btn    = document.getElementById('lib-gen-btn');
  const status = document.getElementById('lib-gen-status');

  if (btn)    btn.disabled          = true;
  if (status) status.style.display  = 'block';

  try {
    const prompt = `Generate 20 unique, ultra-realistic interview Q&A pairs for a ${role} position.
These must be REAL questions top companies (Google, Amazon, Microsoft, TCS, Infosys) actually ask.
Answers must be EXPERT LEVEL: 150-200 words each, specific examples, frameworks, job-ready language.

Return ONLY a raw JSON array, no markdown:
[{"q":"question?","a":"full expert answer.","cat":"behavioral"}]

cat must be one of: behavioral, technical, hr, situational, coding`;

    const raw   = await callAI(prompt);
    let text    = raw.replace(/\`\`\`json/gi, '').replace(/\`\`\`/g, '').trim();
    const match = text.match(/\[[\s\S]*\]/);
    if (!match) throw new Error('Bad format');

    const newQAs = JSON.parse(match[0]).filter(q => q.q && q.a);
    if (!newQAs.length) throw new Error('Empty');

    // Prepend to QA_DATA so new questions show first
    newQAs.reverse().forEach(item => {
      QA_DATA.unshift({ cat: item.cat || 'technical', q: item.q, a: item.a, tip: `Generated for ${role}` });
    });

    renderLibrary();
    setFilter('all');
    showToast(`✅ Added ${newQAs.length} new ${role} questions to the library!`, 'success');

  } catch(e) {
    showToast('❌ Failed to generate. Check your API key and try again.', 'error');
  } finally {
    if (status) status.style.display = 'none';
    if (btn)    btn.disabled         = false;
    const section = document.getElementById('ai-gen-section');
    if (section) section.style.display = 'none';
  }
}
