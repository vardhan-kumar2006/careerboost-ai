// ===== CAREERBOOST AI - ROADMAP PRACTICE JS =====

let currentRound = 1;
let practiceQAs = {}; // Store custom generated Q&As by round index

const roundNames = {
  1: "Online Application + Resume Screening",
  2: "Aptitude / Online Assessment Test",
  3: "Technical Interview — Round 1",
  4: "Technical Interview — Round 2 (System Design)",
  5: "Managerial / Behavioral Round",
  6: "HR Round — Offer Negotiation"
};

const roundDescriptions = {
  1: "Practice screening questions and learn the core requirements of resume parsing software (ATS) and screeners.",
  2: "Test your mental math, logical reasoning, and basic computer science/DSA fundamentals.",
  3: "Practice coding logic, core programming language concepts, data structures, and algorithms.",
  4: "Solve system architectural problems, database design challenges, and scalability questions.",
  5: "Study standard behavioral questions using the STAR framework to showcase leadership and fit.",
  6: "Learn to handle tricky HR policy discussions, cultural compatibility questions, and negotiate salary offers."
};

const defaultQuestions = {
  1: [
    {
      q: "What is an ATS (Applicant Tracking System) and how does it rank resumes?",
      a: "An ATS is software used by recruiters to collect, parse, and screen resumes. It works by scanning the text of your resume for specific keywords, skills, job titles, and educational requirements that match the job description. Resumes are ranked based on keyword frequency, relevance, and semantic match. To rank highly, customize your resume for every job, use exact phrasing from the posting, and avoid text inside tables/graphics which ATS can't read."
    },
    {
      q: "How should I structure the 'Experience' section to maximize impact?",
      a: "Use the action-verb + task + metric (Google X-Y-Z) formula. Instead of writing 'Responsible for writing code,' write 'Designed and implemented a caching layer in Node.js using Redis, reducing API response times by 45%.' Bullet points should always start with strong action verbs (Developed, Optimized, Engineered) and quantify results with percentages, time saved, or revenue generated."
    },
    {
      q: "Is it better to send a resume in PDF or Word format?",
      a: "PDF is generally best because it preserves formatting across all devices and platforms. Modern ATS systems can parse PDFs easily as long as the text is copyable (not scanned as an image). However, if a job portal specifically requests a .docx format, use Word. Always ensure your PDF is generated directly from text rather than being a scanned image."
    },
    {
      q: "How do keywords from a job description affect resume screening, and how should they be integrated?",
      a: "Keywords represent the core requirements (e.g., 'React', 'Agile', 'Unit Testing'). Recruiters filter candidates based on keyword matching. To integrate them naturally, weave them into your experience descriptions and skills list exactly as they appear in the job posting, avoiding keyword stuffing which recruiters detect easily."
    },
    {
      q: "What is the role of a cover letter in the screening process today?",
      a: "While some companies use automation and bypass cover letters, many recruiters still read them to assess communication skills and cultural fit. A good cover letter should not repeat your resume; it should tell a cohesive story about why you are passionate about the role and how your unique experience solves the company's specific problems."
    },
    {
      q: "Should I include personal projects or open-source contributions on my resume, and where?",
      a: "Absolutely, especially for junior and mid-level roles. Create a dedicated 'Projects' section. Include the project name, technologies used, a link to the GitHub repository, and 2-3 bullet points describing the problem solved, your implementation, and any quantified outcomes."
    },
    {
      q: "What are the most common formatting errors that cause resumes to get rejected by ATS?",
      a: "Common errors include: putting key contact information in the header/footer (which some ATS cannot parse), using columns or text boxes (which disrupt reading order), using custom icon fonts for bullet points, and using non-standard section titles like 'Things I Like' instead of 'Skills'."
    },
    {
      q: "How far back should my professional history go on my resume?",
      a: "As a rule of thumb, limit your resume to the last 10-15 years of relevant experience. Focus heavily on your most recent roles. For older positions, you can summarize them in a brief section or omit them if they do not add value to the target role."
    },
    {
      q: "How can I pass the initial 10-second human recruiter screening test?",
      a: "Human screeners scan resumes in an F-shaped pattern. Ensure your name, target job title, contact details, and a clear 'Summary' or 'Core Skills' section are at the very top. Use bold text for key achievements, metrics, and job titles so they stand out immediately."
    },
    {
      q: "Should I customize my resume for every single job application, and what is the fastest way to do so?",
      a: "Yes, customization dramatically increases callback rates. The fastest way is to maintain a master resume containing all projects/experiences. When applying to a specific role, save a copy and quickly swap out irrelevant bullet points or highlight matching technologies to match the job description."
    }
  ],
  2: [
    {
      q: "A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?",
      a: "1. Convert the speed from km/hr to m/s: Speed = 60 * (5/18) = 50/3 m/s.\n2. Length of the train = Speed * Time = (50/3) * 9 = 150 meters.\nTherefore, the length of the train is 150 meters."
    },
    {
      q: "Find the missing number in the sequence: 4, 9, 19, 39, 79, ?",
      a: "The pattern in the sequence is that each number is multiplied by 2 and then 1 is added: \n- 4 * 2 + 1 = 9\n- 9 * 2 + 1 = 19\n- 19 * 2 + 1 = 39\n- 39 * 2 + 1 = 79\n- 79 * 2 + 1 = 159\nSo, the next number is 159."
    },
    {
      q: "What is the time complexity of searching in a balanced Binary Search Tree (BST) versus an unsorted array?",
      a: "In a balanced BST (like an AVL or Red-Black tree), the search time complexity is O(log n) because the search space is halved at each step. In an unsorted array, we must perform a linear search, which has a time complexity of O(n) in the worst case as we might need to check every element."
    },
    {
      q: "A card is drawn from a pack of 52 cards. What is the probability that it is a queen or a heart?",
      a: "1. Total outcomes = 52.\n2. Number of Queens = 4. Number of Hearts = 13.\n3. The Queen of Hearts is counted in both. So, number of favorable cards = 4 + 13 - 1 = 16.\n4. Probability = 16 / 52 = 4 / 13.\nTherefore, the probability is 4/13."
    },
    {
      q: "If 5 men or 9 women can do a piece of work in 19 days, then in how many days will 3 men and 6 women do the same work?",
      a: "1. Work capability: 5 Men = 9 Women => 1 Man = 9/5 Women.\n2. 3 Men + 6 Women = 3*(9/5) + 6 = 57/5 Women.\n3. Using formula M1*D1 = M2*D2:\n   9 Women * 19 Days = (57/5 Women) * D2\n   D2 = (9 * 19 * 5) / 57 = 855 / 57 = 15 Days.\nTherefore, they will finish the work in 15 days."
    },
    {
      q: "What is the difference between stable and unstable sorting algorithms, and name one of each.",
      a: "A stable sort preserves the relative order of items with identical keys (e.g., Merge Sort). An unstable sort does not guarantee preserving their relative order (e.g., Quick Sort). Stability is important when sorting objects by multiple criteria sequentially."
    },
    {
      q: "Explain the concept of Dynamic Programming and how it differs from Divide and Conquer.",
      a: "Divide and Conquer solves sub-problems independently, even if they are identical, which can lead to redundant work (e.g., standard recursion for Fibonacci). Dynamic Programming solves each sub-problem once and stores the result (memoization/tabulation) to avoid duplicate calculations, making it far faster for overlapping sub-problems."
    },
    {
      q: "How does a Hash Map handle collisions under the hood?",
      a: "A Hash Map handles collisions primarily via two methods:\n1. Chaining: Each bucket holds a linked list or tree of entries. Colliding entries are appended to the bucket list.\n2. Open Addressing: The map searches for alternative empty buckets using strategies like linear or quadratic probing."
    },
    {
      q: "A clock shows 3:15. What is the angle between the hour and minute hands?",
      a: "1. At 3:00, the hour hand is at 90 degrees. In 15 minutes, the hour hand moves: 15 * 0.5 degrees = 7.5 degrees. So hour hand angle = 90 + 7.5 = 97.5 degrees.\n2. At 15 minutes, the minute hand is exactly at 90 degrees.\n3. Angle difference = 97.5 - 90 = 7.5 degrees.\nTherefore, the angle is 7.5 degrees."
    },
    {
      q: "What is a Memory Leak, and how does garbage collection work in languages like Java or JavaScript?",
      a: "A memory leak occurs when objects that are no longer needed remain referenced in memory, preventing the system from reclaiming their space. Garbage collection automatically runs in the background, identifying unreferenced objects using reachability algorithms (like Mark-and-Sweep) and freeing their allocated memory."
    }
  ],
  3: [
    {
      q: "What is the difference between Synchronous and Asynchronous programming?",
      a: "Synchronous programming executes operations sequentially, blocking the execution thread until the current task completes before moving to the next. Asynchronous programming allows tasks to run concurrently or in the background; the main thread initiates the operation and continues executing other code, handling the result via callbacks, promises, or async/await once the task completes. This is vital for I/O operations like network requests."
    },
    {
      q: "Explain Object-Oriented Programming (OOP) concepts: Encapsulation, Inheritance, Polymorphism, Abstraction.",
      a: "- Encapsulation: Bundling data (variables) and methods (functions) inside a class while restricting direct access (using private/protected visibility).\n- Inheritance: Allowing a new class (subclass) to inherit attributes and methods from an existing class (superclass).\n- Polymorphism: The ability of different classes to respond to the same method call in unique ways (method overriding/overloading).\n- Abstraction: Hiding internal implementation details and showing only the essential features of an object."
    },
    {
      q: "What is the difference between inner join, left join, and right join in SQL?",
      a: "- INNER JOIN: Returns only the rows where there is a match in both tables.\n- LEFT JOIN (or LEFT OUTER JOIN): Returns all rows from the left table, plus the matched rows from the right table. If there is no match, it returns NULL values for the right table columns.\n- RIGHT JOIN: Returns all rows from the right table, plus the matched rows from the left table. If there is no match, NULL values are returned for the left table columns."
    },
    {
      q: "What is a RESTful API and what are the main HTTP methods used?",
      a: "A RESTful API is an architectural style for web services that uses HTTP requests to manage data. The main HTTP methods are:\n- GET: Retrieve a resource.\n- POST: Create a new resource.\n- PUT: Update an existing resource completely.\n- PATCH: Modify part of a resource.\n- DELETE: Remove a resource."
    },
    {
      q: "Explain the differences between var, let, and const in JavaScript.",
      a: "- var: Function-scoped, can be redeclared and reassigned, and is hoisted with a default value of undefined.\n- let: Block-scoped, cannot be redeclared but can be reassigned, and is hoisted but remains uninitialized (temporal dead zone).\n- const: Block-scoped, cannot be redeclared or reassigned (immutable reference), and must be initialized at declaration."
    },
    {
      q: "What is a deadlock in Operating Systems, and what are the four necessary conditions for it to occur?",
      a: "A deadlock occurs when threads are blocked because each holds a resource and waits for another resource held by another thread. The four Coffman conditions are:\n1. Mutual Exclusion: At least one resource must be held in non-shareable mode.\n2. Hold and Wait: A thread must hold resources and wait for others.\n3. No Preemption: Resources cannot be forcibly taken from a thread.\n4. Circular Wait: A closed chain of threads exists where each waits for a resource held by the next."
    },
    {
      q: "What are Indexes in databases, and how do they speed up queries at the cost of writes?",
      a: "An index is a data structure (often a B-Tree or Hash Table) that stores key values pointing to corresponding rows. It allows the database engine to find rows rapidly without scanning the whole table (O(log n) vs O(n)). However, every insert, update, and delete operation requires updating the indexes as well, which slows down write operations."
    },
    {
      q: "Explain the difference between a process and a thread.",
      a: "A process is an independent execution unit with its own dedicated memory space allocated by the OS. A thread is a lightweight sub-unit of execution within a process. Multiple threads share the same process memory and resources, making context switching faster but requiring synchronization to avoid data corruption."
    },
    {
      q: "What is Git rebase versus Git merge, and when should you use each?",
      a: "- Git Merge: Combines branches by creating a new 'merge commit', preserving the exact history of both branches. Use this for shared public branches to maintain historical accuracy.\n- Git Rebase: Moves the base of your branch to a new starting point, rewriting history to create a linear sequence. Use this on private local branches to clean up commits before pushing."
    },
    {
      q: "What are the key differences between SQL (Relational) and NoSQL (Non-Relational) databases?",
      a: "- SQL: Relational structure, strict schema, tables/rows, ACID compliant, scales vertically. Best for transactional apps with structured relationships.\n- NoSQL: Document, Key-Value, or Graph structure, dynamic schema, JSON-like records, BASE consistency model, scales horizontally. Best for unstructured data and massive horizontal scales."
    }
  ],
  4: [
    {
      q: "How would you design a URL Shortening service like bit.ly?",
      a: "Key components:\n1. API: POST /api/v1/shorten (accepts long URL, returns short URL) and GET /{short_code} (redirects to long URL).\n2. Storage: A database storing mapping (short_code -> long_url). A NoSQL key-value store (e.g. MongoDB/DynamoDB) is ideal for high scalability, or relational DB with indexing on short_code.\n3. Unique Code Generation: Use Base62 encoding (a-z, A-Z, 0-9) of an auto-incrementing ID or a distributed key generator (like Snowflake) to generate 6-7 character strings.\n4. Caching: Redis cache for hot redirects to minimize DB reads.\n5. Redirection: Return HTTP 301 (Permanent Redirect) for cacheability."
    },
    {
      q: "What is horizontal versus vertical scaling, and how do database replicas help?",
      a: "- Vertical Scaling: Upgrading the existing server's hardware (adding more CPU, RAM, or SSD storage). It has a hard physical ceiling and causes single points of failure.\n- Horizontal Scaling: Adding more servers to your infrastructure pool and distributing traffic via a load balancer. It scales almost infinitely.\n- Database Replicas: Copying the main database to read-only replica servers. Write operations go to the primary database, while read operations are distributed across the replicas. This reduces load on the primary DB and speeds up read-heavy applications."
    },
    {
      q: "What is a CDN (Content Delivery Network) and when should it be used?",
      a: "A CDN is a distributed network of proxy servers deployed across multiple geographical locations. It caches static assets (images, CSS, JS, videos) close to users' physical locations (Edge servers). It should be used to reduce latency, decrease bandwidth costs on the origin server, improve load times, and offer protection against traffic spikes and DDoS attacks."
    },
    {
      q: "How do you design a rate limiter for an API, and what algorithms can be used?",
      a: "A rate limiter limits the number of requests a user can make within a time frame. Algorithms include:\n1. Token Bucket: Tokens added to bucket at rate R; requests consume a token. Handles bursts.\n2. Leaking Bucket: Queue holds requests, processes at constant rate. Smooths out traffic.\n3. Fixed Window Counter: Simple counter reset at interval end. Vulnerable to spikes at edges.\n4. Sliding Window Log/Counter: Precise window tracking."
    },
    {
      q: "What is cache invalidation, and what are the common caching strategies (Write-through, Write-back, Cache-aside)?",
      a: "Cache invalidation is keeping cache data consistent with the database. Strategies:\n- Write-through: Data is written to cache and DB simultaneously. Consistent but slow writes.\n- Write-back (Write-behind): Data written to cache first; DB updated asynchronously. High performance, risk of data loss on power failure.\n- Cache-aside (Lazy loading): App checks cache first; if miss, reads from DB and writes to cache. Simple, efficient."
    },
    {
      q: "Explain the CAP Theorem and its implications for distributed systems.",
      a: "The CAP Theorem states a distributed database can only satisfy two of three properties:\n- Consistency (C): Every read receives the most recent write or an error.\n- Availability (A): Every non-failing node returns a response (without guarantee of latest data).\n- Partition Tolerance (P): System operates despite network partition failures.\nSince physical partitions (P) are inevitable, distributed systems must trade off Consistency (CP systems) vs Availability (AP systems)."
    },
    {
      q: "How does load balancing work, and what are common load balancing algorithms?",
      a: "A load balancer acts as a reverse proxy, distributing incoming traffic across multiple servers. Algorithms include:\n- Round Robin: Distribute sequentially.\n- Weighted Round Robin: Account for server capacities.\n- Least Connections: Direct to server with active handles.\n- IP Hash: Server selection based on client IP to maintain sticky sessions."
    },
    {
      q: "How would you design a notification system that handles email, SMS, and push notifications at scale?",
      a: "1. API Gateway: Receives notification requests.\n2. Workers & Queue: Queue requests (using Kafka/RabbitMQ) and process asynchronously to prevent bottlenecks.\n3. Third-party integrations: Connect to Twilio (SMS), SendGrid (Email), APNS/FCM (Push).\n4. User Settings Service: Check communication preferences.\n5. Cache: Store retry/failure logs and deduplicate requests."
    },
    {
      q: "What is a message queue (like RabbitMQ or Kafka) and when do you need one in your architecture?",
      a: "A message queue is an asynchronous service-to-service communication system. You need one to decouple heavy write tasks from web threads (e.g., processing video uploads), route tasks to multiple worker systems, handle traffic spikes by buffering requests, and ensure message delivery reliability via retries."
    },
    {
      q: "How do you secure data in transit and data at rest in a large-scale system?",
      a: "- In Transit: Force HTTPS using TLS protocols, manage SSL certificates, encrypt internal traffic between microservices, and secure API gateways.\n- At Rest: Encrypt databases, filesystems, and caches using AES-256, keep cryptographic keys secure in key management services (KMS), and enforce strict access control (IAM)."
    }
  ],
  5: [
    {
      q: "Tell me about a time you faced a conflict in a project team and how you resolved it.",
      a: "Use STAR:\n- Situation: During a university project, two team members disagreed on using MongoDB vs SQL, halting progress.\n- Task: As the coordinator, I needed to resolve this to meet our design deadline.\n- Action: I scheduled a brief meeting where each presented their technical arguments. I noted down the trade-offs (scalability vs strict schema/ACID). I suggested we outline our actual project requirements first: our data structure was relational, so SQL was a safer bet. We agreed and moved forward.\n- Result: We completed the project on time and both teammates appreciated the objective, structured resolution."
    },
    {
      q: "What is your greatest weakness and how are you working to overcome it?",
      a: "Select a real, professional weakness that is non-essential to the core job and show active improvement: 'My greatest weakness is that I sometimes struggle to delegate tasks in team projects because I want to ensure everything is done perfectly. However, I realized this leads to bottlenecking and burnout. Recently, I've started using project boards (like Trello) to explicitly assign tasks and schedule check-ins. This has helped me trust my teammates and improved team speed and collaboration.'"
    },
    {
      q: "How do you handle tight deadlines or sudden changes in requirements?",
      a: "Explain your process: 1. Stay calm and assess the change. 2. Prioritize: categorize requirements into 'must-haves' and 'nice-to-haves'. 3. Communicate: speak with stakeholders or team leads about how the deadline will be affected or what must-have features will be delivered. 4. Execute: plan tasks in smaller chunks. Give an example from your past where you successfully managed this process."
    },
    {
      q: "Tell me about a time you made a mistake at work or on a project. How did you handle it?",
      a: "- Situation: In a project, I pushed code that broke the build for others.\n- Task: Restore the main branch immediately and correct my mistake.\n- Action: I notified the team, reverted the commit, and debugged locally. I found a missing import statement. I wrote a unit test to cover it, double-checked locally, and re-pushed.\n- Result: Restored build in under 15 minutes. Set up a local pre-commit hook to prevent future errors."
    },
    {
      q: "How do you handle working with a difficult stakeholder or teammate?",
      a: "Focus on active listening, empathy, and objective parameters: 'I seek to understand their perspective. Often, frustration stems from a lack of clarity or competing priorities. I hold a 1-on-1 meeting, listen to their concerns, align on project goals, and document everything to keep parameters objective and clear.'"
    },
    {
      q: "Describe a situation where you had to learn a new technology quickly to solve a problem.",
      a: "- Situation: A project required building a GraphQL service, but I had only used REST.\n- Task: Learn GraphQL and deliver the integration in 1 week.\n- Action: I spent the weekend reading documentation, built a small sandbox application, and followed official tutorials. I completed the task on time.\n- Result: Delivered features on schedule, and our client enjoyed a 30% reduction in query payloads."
    },
    {
      q: "Tell me about a time you took the lead on a project or initiative.",
      a: "- Situation: Our deployment process was manual and prone to human errors.\n- Task: Standardize and automate it.\n- Action: I researched GitHub Actions, set up a CI/CD pipeline, and created automated linting and unit testing workflows.\n- Result: Deployment time decreased from 40 minutes to under 5 minutes with zero deployment failures."
    },
    {
      q: "How do you prioritize tasks when you have multiple competing deadlines?",
      a: "Explain prioritization metrics: 'I use the Eisenhower Matrix (Urgent vs Important). I break down my tasks, identify dependencies, communicate with team members about bottlenecks, and focus on delivering high-impact components first.'"
    },
    {
      q: "Describe a time when you disagreed with a manager's decision and how you handled the situation.",
      a: "Demonstrate respect and analytical thinking: 'I schedule a 1-on-1 meeting, present alternative solutions backed by data (e.g., load test results), listen to their broader business constraints, and ultimately respect their final decision while doing my best to implement it successfully.'"
    },
    {
      q: "Where do you see yourself in five years professionally?",
      a: "Align with professional growth: 'In 5 years, I aim to grow into a senior technical engineer or system architect. I want to build deep expertise in cloud architectures, lead complex integrations, and mentor junior developers.'"
    }
  ],
  6: [
    {
      q: "Why should we hire you for this position?",
      a: "Align your answer with the company's needs: 'You should hire me because I not only have the technical foundation in Java/Spring Boot required for this backend role, but I also have a proven track record of optimizing systems—as seen in my project where I improved query times by 30%. I'm a fast learner, deeply interested in your product's domain, and thrive in collaborative team environments. I'm ready to contribute to your engineering goals immediately.'"
    },
    {
      q: "What are your salary expectations?",
      a: "State a range backed by research, while remaining flexible: 'Based on my research of market rates for this role in this location, and considering my skills and experience, I am looking for a salary in the range of 6,0,000 to 8,0,000 INR per year. However, I am open to discussing the entire compensation package, including benefits, performance bonuses, and growth opportunities, as the role and fit are my top priorities.'"
    },
    {
      q: "Do you have any questions for us?",
      a: "Always ask questions to show interest and engagement: 1. 'What does success look like in this role in the first 90 days?' 2. 'What are the biggest challenges the team is currently facing?' 3. 'What is the team's typical development process (e.g. Agile/Scrum) and release cycle?' 4. 'Can you tell me more about the company's plans for expansion or new product lines?'"
    },
    {
      q: "Why are you looking to leave your current job (or why have you been job hunting)?",
      a: "Keep it positive and growth-oriented: 'I've learned a lot in my current role, but I feel ready for a new challenge. I'm looking for a position where I can work with larger architectures, cloud systems, and collaborate with a larger engineering team, which aligns perfectly with this vacancy.'"
    },
    {
      q: "How do you handle a counter-offer from your current employer?",
      a: "Be professional: 'While a counter-offer can be flattering, the reasons I decided to seek new challenges are usually growth-related, not just financial. Therefore, I respectfully decline counter-offers to commit fully to my new career path.'"
    },
    {
      q: "What is your notice period, and are you willing to relocate or work in a hybrid/onsite model?",
      a: "Give clear timelines: 'My notice period is 30 days. Yes, I am fully willing to relocate for this position and happy to work in a hybrid or onsite setting as required.'"
    },
    {
      q: "What are your thoughts on working overtime or during weekends when needed?",
      a: "Be collaborative yet professional: 'I understand that critical production issues or deadlines can arise. I am happy to support the team during these times. However, I also believe in standardizing processes to prevent overtime from becoming the norm.'"
    },
    {
      q: "If we offer you a lower salary than you requested, how would you respond?",
      a: "Handle professionally: 'I would appreciate the offer, and ask if we could review the comprehensive package details (benefits, performance bonuses). If needed, I would request a review in 6 months based on my milestones and achievements.'"
    },
    {
      q: "How do you handle multiple job offers at the same time?",
      a: "Keep communications transparent: 'I communicate honestly with recruiters, letting them know I have other active offers. I evaluate them based on growth alignment, team environment, and fit, rather than just salary.'"
    },
    {
      q: "What is your understanding of our company culture and core values?",
      a: "Show you did your homework: 'I know you prioritize innovation, open collaboration, and rapid delivery. This matches my personal approach of standardizing code, automating deployments, and maintaining transparency in team operations.'"
    }
  ]
};

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  loadSavedPracticeQAs();
});

function loadSavedPracticeQAs() {
  try {
    const saved = localStorage.getItem("cb_practice_qas");
    if (saved) {
      practiceQAs = JSON.parse(saved);
    }
  } catch(e) {
    console.error("Failed to load saved practice QAs:", e);
  }
}

function savePracticeQAs() {
  try {
    localStorage.setItem("cb_practice_qas", JSON.stringify(practiceQAs));
  } catch(e) {
    console.error("Failed to save practice QAs:", e);
  }
}

// Start practicing a round
function startPractice(roundNum) {
  currentRound = roundNum;
  
  // Show section
  const section = document.getElementById("practice-section");
  if (section) {
    section.style.display = "block";
  }
  
  // Reset tabs to study mode
  switchPracticeMode('study');
  
  // Update titles/metadata
  const badge = document.getElementById("practice-round-badge");
  const title = document.getElementById("practice-round-title");
  const desc = document.getElementById("practice-round-desc");
  
  if (badge) badge.textContent = `📝 Round ${roundNum} Practice`;
  if (title) title.textContent = roundNames[roundNum];
  if (desc) desc.textContent = roundDescriptions[roundNum];
  
  // Render questions
  renderQuestions();
  
  // Smooth scroll to practice section
  setTimeout(() => {
    section?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 100);
}

// Toggle Q&A accordion display
function togglePracticeAnswer(index) {
  const body = document.getElementById(`practice-body-${index}`);
  const toggleBtn = document.getElementById(`practice-toggle-${index}`);
  if (body && toggleBtn) {
    const isOpen = body.classList.contains("open");
    if (isOpen) {
      body.classList.remove("open");
      toggleBtn.classList.remove("open");
    } else {
      body.classList.add("open");
      toggleBtn.classList.add("open");
    }
  }
}

// Render questions list
function renderQuestions() {
  const container = document.getElementById("practice-questions-list");
  if (!container) return;
  
  const qas = practiceQAs[currentRound] || defaultQuestions[currentRound] || [];
  
  if (qas.length === 0) {
    container.innerHTML = `<div style="text-align:center;color:var(--text-muted);padding:20px;">No questions loaded. Click "Generate New Questions" to load some!</div>`;
    return;
  }
  
  container.innerHTML = qas.map((qa, index) => {
    const isLearnedKey = `cb_learned_${currentRound}_${index}`;
    const isLearned = localStorage.getItem(isLearnedKey) === 'true';
    
    return `
      <div class="qa-practice-card" id="qa-card-${index}">
        <div class="qa-practice-header" onclick="togglePracticeAnswer(${index})">
          <div style="display: flex; align-items: flex-start; gap: 12px; flex: 1;">
            <div style="margin-top: 2px;">
              <input 
                type="checkbox" 
                id="checkbox-learned-${index}" 
                onclick="event.stopPropagation(); toggleLearnedState(${index}, this)"
                ${isLearned ? 'checked' : ''}
                style="width: 18px; height: 18px; cursor: pointer; accent-color: var(--purple);"
              >
            </div>
            <span class="qa-practice-q" id="q-text-${index}">${qa.q}</span>
          </div>
          <button class="qa-practice-toggle" id="practice-toggle-${index}">▼</button>
        </div>
        <div class="qa-practice-body" id="practice-body-${index}">
          <div class="qa-practice-answer-label">💡 Expert Guide Answer</div>
          <div class="qa-practice-answer">${qa.a.replace(/\n/g, '<br>')}</div>
          
          <div style="margin-top: 14px; display: flex; justify-content: flex-end;">
            <button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); markAsCompleted(${index})" style="font-size: 11px; padding: 4px 8px;">
              ${isLearned ? '✔️ Learned!' : '📖 Mark as Learned'}
            </button>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

// Toggle checkbox learned state
function toggleLearnedState(index, checkbox) {
  const isLearnedKey = `cb_learned_${currentRound}_${index}`;
  localStorage.setItem(isLearnedKey, checkbox.checked);
  
  const card = document.getElementById(`qa-card-${index}`);
  if (card) {
    if (checkbox.checked) {
      card.style.background = 'rgba(16, 185, 129, 0.04)';
      card.style.borderColor = 'rgba(16, 185, 129, 0.25)';
      showToast('📖 Marked as learned! Keep it up! 🚀', 'success', 2000);
    } else {
      card.style.background = 'var(--bg-card)';
      card.style.borderColor = 'var(--border)';
    }
  }
}

// Mark as completed button
function markAsCompleted(index) {
  const checkbox = document.getElementById(`checkbox-learned-${index}`);
  if (checkbox) {
    checkbox.checked = !checkbox.checked;
    toggleLearnedState(index, checkbox);
  }
}

// Dynamic AI Question Generation
async function generateNewPracticeQuestions() {
  if (!hasApiKey()) {
    showToast('Please set your API key first! Click the 🔑 button.', 'error', 5000);
    openModal('api-modal');
    return;
  }
  
  const genBtn = document.getElementById("generate-new-practice-btn");
  const loading = document.getElementById("practice-loading");
  const qList = document.getElementById("practice-questions-list");
  
  if (genBtn) genBtn.disabled = true;
  if (loading) loading.style.display = "block";
  if (qList) qList.style.display = "none";
  
  const activeRole = localStorage.getItem('cb_interview_role') || 'Software Developer or Software Tester';
  
  const prompts = {
    1: `Generate exactly 10 highly realistic, professional screening and ATS (Applicant Tracking System) questions and answers specifically tailored to a candidate preparing for a ${activeRole} position. Explain concepts, resume parsing criteria, and ATS optimization details.
Return ONLY a raw JSON array. Format: [{"q":"Question?","a":"Detailed Answer"}]. No code blocks, no markdown, no other text.`,
    2: `Generate exactly 10 high-quality quantitative aptitude, logical reasoning, and basic coding/computer science aptitude questions and answers for a ${activeRole} Online Assessment test. Include step-by-step mathematical logic or code explanation in answers.
Return ONLY a raw JSON array. Format: [{"q":"Question?","a":"Detailed Answer"}]. No code blocks, no markdown, no other text.`,
    3: `Generate exactly 10 technical coding, programming logic, data structures, algorithms, testing fundamentals, or database questions and answers for a ${activeRole} first technical round. Include code solutions or conceptual explainers where appropriate.
Return ONLY a raw JSON array. Format: [{"q":"Question?","a":"Detailed Answer"}]. No code blocks, no markdown, no other text.`,
    4: `Generate exactly 10 advanced system design, database schemas, APIs, code testing strategy, scaling, or architecture design questions and answers for a ${activeRole} senior technical round.
Return ONLY a raw JSON array. Format: [{"q":"Question?","a":"Detailed Answer"}]. No code blocks, no markdown, no other text.`,
    5: `Generate exactly 10 behavioral, managerial, and team collaboration questions and answers for a ${activeRole} candidate. Ensure the answers demonstrate conflict resolution, leadership, and follow the STAR framework (Situation, Task, Action, Result).
Return ONLY a raw JSON array. Format: [{"q":"Question?","a":"Detailed Answer"}]. No code blocks, no markdown, no other text.`,
    6: `Generate exactly 10 HR, cultural fit, team alignment, salary negotiation, and onboarding questions and answers for a ${activeRole} candidate. Explain strategies for negotiation in answers.
Return ONLY a raw JSON array. Format: [{"q":"Question?","a":"Detailed Answer"}]. No code blocks, no markdown, no other text.`
  };
  
  try {
    const prompt = prompts[currentRound];
    const raw = await callAI(prompt);
    const parsed = parsePracticeResponse(raw);
    
    // Reset learned states for new questions
    for (let i = 0; i < 15; i++) {
      localStorage.removeItem(`cb_learned_${currentRound}_${i}`);
    }
    
    practiceQAs[currentRound] = parsed;
    savePracticeQAs();
    
    renderQuestions();
    showToast('✨ Dynamic practice questions generated successfully!', 'success');
  } catch(err) {
    console.error("AI Practice generation failed:", err);
    showToast('❌ Failed to generate questions: ' + (err.message || 'Check your key'), 'error', 5000);
  } finally {
    if (genBtn) genBtn.disabled = false;
    if (loading) loading.style.display = "none";
    if (qList) qList.style.display = "flex";
  }
}

// Robust parsing utility
function parsePracticeResponse(raw) {
  if (!raw) throw new Error('Empty response from AI');
  let text = raw.trim();
  text = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '');
  const arrayMatch = text.match(/\[[\s\S]*\]/);
  if (arrayMatch) {
    try {
      const parsed = JSON.parse(arrayMatch[0]);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(o => ({
          q: String(o.q || '').trim(),
          a: String(o.a || '').trim()
        })).filter(o => o.q && o.a);
      }
    } catch(e) {
      try {
        const fixed = arrayMatch[0]
          .replace(/,\s*]/g, ']')
          .replace(/,\s*}/g, '}')
          .replace(/[\u0000-\u001F]/g, ' ');
        const parsed = JSON.parse(fixed);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(o => ({
            q: String(o.q || '').trim(),
            a: String(o.a || '').trim()
          })).filter(o => o.q && o.a);
        }
      } catch(e2) {}
    }
  }
  
  // Fallback regex matching objects if JSON parsing fails completely
  const objMatches = [...text.matchAll(/\{[^{}]*"q"\s*:\s*"[^"]+[^{}]*\}/g)];
  if (objMatches.length > 0) {
    try {
      return objMatches.map(m => JSON.parse(m[0])).filter(o => o.q && o.a);
    } catch(e) {}
  }
  
  throw new Error('AI response was not in a valid JSON format. Please try again.');
}

// ===== ROADMAP INTERACTIVE QUIZ LOGIC =====
let currentPracticeMode = 'study';
let roadmapQuizQuestions = {}; // Store quiz arrays mapped by round index
let roadmapUserAnswers = [];   // Stores user answers for current quiz
let roadmapCurrentQuizIndex = 0;

function switchPracticeMode(mode) {
  currentPracticeMode = mode;
  
  const tabStudy = document.getElementById('roadmap-tab-study');
  const tabQuiz = document.getElementById('roadmap-tab-quiz');
  const studyContainer = document.getElementById('study-mode-container');
  const quizContainer = document.getElementById('quiz-mode-container');
  
  if (mode === 'study') {
    tabStudy?.classList.add('active');
    tabQuiz?.classList.remove('active');
    if (studyContainer) studyContainer.style.display = 'block';
    if (quizContainer) quizContainer.style.display = 'none';
  } else {
    tabStudy?.classList.remove('active');
    tabQuiz?.classList.add('active');
    if (studyContainer) studyContainer.style.display = 'none';
    if (quizContainer) quizContainer.style.display = 'block';
    startRoadmapQuiz();
  }
}

async function startRoadmapQuiz() {
  const loading = document.getElementById('roadmap-quiz-loading');
  const activeArea = document.getElementById('roadmap-quiz-active-area');
  const resultsArea = document.getElementById('roadmap-quiz-results-area');
  
  if (loading) loading.style.display = 'block';
  if (activeArea) activeArea.style.display = 'none';
  if (resultsArea) resultsArea.style.display = 'none';
  
  // Check if quiz already exists
  if (roadmapQuizQuestions[currentRound] && roadmapQuizQuestions[currentRound].length > 0) {
    initRoadmapQuizRun();
    return;
  }
  
  // Otherwise generate quiz
  if (!hasApiKey()) {
    showToast('Please set your API key first! Click the 🔑 button.', 'error', 5000);
    openModal('api-modal');
    switchPracticeMode('study');
    return;
  }
  
  const activeRole = localStorage.getItem('cb_interview_role') || 'Software Developer or Software Tester';
  const qas = practiceQAs[currentRound] || defaultQuestions[currentRound] || [];
  
  try {
    // Generate in two batches of 10 questions to prevent token limit truncation
    const midIndex = Math.ceil(qas.length / 2);
    const qas1 = qas.slice(0, midIndex);
    const qas2 = qas.slice(midIndex);

    const batch1 = await generateRoadmapQuizBatch(activeRole, qas1, 10, 1);
    const batch2 = await generateRoadmapQuizBatch(activeRole, qas2, 10, 2);

    roadmapQuizQuestions[currentRound] = [...batch1, ...batch2];
    initRoadmapQuizRun();
  } catch (err) {
    console.error("Roadmap quiz generation failed:", err);
    showToast('❌ Failed to generate quiz: ' + (err.message || 'Check your key'), 'error', 5000);
    switchPracticeMode('study');
  }
}

async function generateRoadmapQuizBatch(role, qasSlice, count, batchNum) {
  const roundName = roundNames[currentRound];
  const roundDesc = roundDescriptions[currentRound];
  
  const prompt = `Based on the following topics and study Q&As for a ${role} preparing for Round ${currentRound} (${roundName}) of interviews:
Round Description: ${roundDesc}
This is Batch ${batchNum} of the quiz.

Generate a comprehensive quiz of exactly ${count} questions to test their knowledge.
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

Reference study material (Batch ${batchNum}):
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

function initRoadmapQuizRun() {
  const questions = roadmapQuizQuestions[currentRound];
  roadmapUserAnswers = questions.map(q => {
    if (q.type === 'short_answer') {
      return { text: '', graded: 'pending' };
    }
    return '';
  });
  roadmapCurrentQuizIndex = 0;

  document.getElementById('roadmap-quiz-loading').style.display = 'none';
  document.getElementById('roadmap-quiz-active-area').style.display = 'block';
  document.getElementById('roadmap-quiz-results-area').style.display = 'none';

  renderRoadmapQuizQuestion();
}

function renderRoadmapQuizQuestion() {
  const container = document.getElementById('roadmap-quiz-question-card');
  if (!container) return;

  const q = roadmapQuizQuestions[currentRound][roadmapCurrentQuizIndex];
  const total = roadmapQuizQuestions[currentRound].length;

  // Update progress bar
  const pct = Math.round((roadmapCurrentQuizIndex / total) * 100);
  const fill = document.getElementById('roadmap-quiz-progress-fill');
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
      <span style="font-size:12px;color:var(--text-muted);font-weight:800;letter-spacing:1px;text-transform:uppercase;">Question ${roadmapCurrentQuizIndex + 1} of ${total}</span>
      ${badgeHTML}
    </div>
    <div class="quiz-question-title" style="font-size:16px;margin-bottom:18px;">${localSanitize(q.q)}</div>
  `;

  // Render inputs based on type
  let inputHTML = '';
  if (q.type === 'mcq') {
    inputHTML = '<div class="quiz-options-grid">';
    const letters = ['A', 'B', 'C', 'D'];
    q.options.forEach((opt, idx) => {
      const letter = letters[idx] || letters[0];
      const isSelected = roadmapUserAnswers[roadmapCurrentQuizIndex] === letter;
      inputHTML += `
        <button class="quiz-option-btn ${isSelected ? 'selected' : ''}" onclick="selectRoadmapQuizOption('${letter}')" style="padding:12px 16px;font-size:13px;">
          <div class="quiz-option-letter" style="width:24px;height:24px;font-size:11px;">${letter}</div>
          <div>${localSanitize(opt)}</div>
        </button>
      `;
    });
    inputHTML += '</div>';
  } else if (q.type === 'fill_blank') {
    const val = roadmapUserAnswers[roadmapCurrentQuizIndex] || '';
    inputHTML = `
      <input type="text" class="quiz-blank-input" placeholder="Type your answer here..." value="${localSanitize(val)}" oninput="saveRoadmapQuizTextInput(this.value)" style="padding:12px 16px;font-size:14px;margin-bottom:12px;">
    `;
  } else if (q.type === 'short_answer') {
    const val = roadmapUserAnswers[roadmapCurrentQuizIndex]?.text || '';
    inputHTML = `
      <textarea class="quiz-short-textarea" placeholder="Type your answer here (1-2 sentences)..." oninput="saveRoadmapQuizShortAnswer(this.value)" style="padding:12px 16px;font-size:13px;height:80px;margin-bottom:12px;"></textarea>
    `;
  }

  // Render navigation footer
  const isFirst = roadmapCurrentQuizIndex === 0;
  const isLast = roadmapCurrentQuizIndex === total - 1;

  let footerHTML = `
    <div class="quiz-divider" style="margin-top:14px;margin-bottom:14px;height:1px;background:var(--border);"></div>
    <div class="quiz-nav-row">
      <button class="btn btn-outline btn-sm" onclick="prevRoadmapQuizQuestion()" ${isFirst ? 'disabled' : ''}>← Previous</button>
      <span class="quiz-progress-text">${roadmapCurrentQuizIndex + 1} / ${total}</span>
      ${isLast
        ? `<button class="btn btn-primary btn-sm" onclick="submitRoadmapQuiz()" style="background:linear-gradient(135deg,var(--green),var(--blue));border-color:transparent;">Submit Quiz ➔</button>`
        : `<button class="btn btn-primary btn-sm" onclick="nextRoadmapQuizQuestion()">Next →</button>`
      }
    </div>
  `;

  container.innerHTML = questionHTML + inputHTML + footerHTML;

  // Re-fill textarea/input value since innerHTML replaces it
  if (q.type === 'fill_blank') {
    container.querySelector('input')?.focus();
  } else if (q.type === 'short_answer') {
    const textarea = container.querySelector('textarea');
    if (textarea) {
      textarea.value = roadmapUserAnswers[roadmapCurrentQuizIndex]?.text || '';
      textarea.focus();
    }
  }
}

function selectRoadmapQuizOption(letter) {
  roadmapUserAnswers[roadmapCurrentQuizIndex] = letter;
  renderRoadmapQuizQuestion();
}

function saveRoadmapQuizTextInput(val) {
  roadmapUserAnswers[roadmapCurrentQuizIndex] = val;
}

function saveRoadmapQuizShortAnswer(val) {
  if (!roadmapUserAnswers[roadmapCurrentQuizIndex]) {
    roadmapUserAnswers[roadmapCurrentQuizIndex] = { text: '', graded: 'pending' };
  }
  roadmapUserAnswers[roadmapCurrentQuizIndex].text = val;
}

function nextRoadmapQuizQuestion() {
  if (roadmapCurrentQuizIndex < roadmapQuizQuestions[currentRound].length - 1) {
    roadmapCurrentQuizIndex++;
    renderRoadmapQuizQuestion();
  }
}

function prevRoadmapQuizQuestion() {
  if (roadmapCurrentQuizIndex > 0) {
    roadmapCurrentQuizIndex--;
    renderRoadmapQuizQuestion();
  }
}

function submitRoadmapQuiz() {
  document.getElementById('roadmap-quiz-active-area').style.display = 'none';
  document.getElementById('roadmap-quiz-results-area').style.display = 'block';

  // Smooth scroll
  document.getElementById('practice-section').scrollIntoView({ behavior: 'smooth', block: 'start' });

  renderRoadmapQuizResults();
}

function renderRoadmapQuizResults() {
  const container = document.getElementById('roadmap-quiz-review-list');
  if (!container) return;

  const questions = roadmapQuizQuestions[currentRound];
  let score = 0;
  let reviewCardsHTML = '';

  questions.forEach((q, i) => {
    let isCorrect = false;
    let userAnsText = '';
    let correctAnsText = '';
    let badgeHTML = '';

    if (q.type === 'mcq') {
      const uLetter = roadmapUserAnswers[i] || '';
      userAnsText = `Your Answer: <strong>Option ${uLetter}</strong>`;
      
      const correctOptionString = q.options.find(o => o.startsWith(q.correct + ')')) || q.correct;
      correctAnsText = `Correct Answer: <strong>${localSanitize(correctOptionString)}</strong>`;
      
      isCorrect = uLetter.trim().toUpperCase() === q.correct.trim().toUpperCase();
      if (isCorrect) score++;
      
      badgeHTML = isCorrect 
        ? `<span class="quiz-review-badge correct">Correct</span>` 
        : `<span class="quiz-review-badge incorrect">Incorrect</span>`;
    } else if (q.type === 'fill_blank') {
      const uVal = (roadmapUserAnswers[i] || '').trim();
      userAnsText = `Your Answer: "<em>${localSanitize(uVal || 'Empty')}</em>"`;
      correctAnsText = `Correct Answer: "<strong>${localSanitize(q.correct)}</strong>"`;
      
      isCorrect = uVal.toLowerCase() === q.correct.trim().toLowerCase();
      if (isCorrect) score++;
      
      badgeHTML = isCorrect 
        ? `<span class="quiz-review-badge correct">Correct</span>` 
        : `<span class="quiz-review-badge incorrect">Incorrect</span>`;
    } else if (q.type === 'short_answer') {
      const uVal = (roadmapUserAnswers[i]?.text || '').trim();
      userAnsText = `Your Answer: "<em>${localSanitize(uVal || 'Empty')}</em>"`;
      correctAnsText = `Expert Answer: <strong>${localSanitize(q.correct)}</strong>`;
      
      const isGraded = roadmapUserAnswers[i]?.graded || 'pending';
      if (isGraded === 'correct') {
        isCorrect = true;
        score++;
        badgeHTML = `<span class="quiz-review-badge correct" id="roadmap-review-badge-${i}">Correct (Self-Graded)</span>`;
      } else if (isGraded === 'incorrect') {
        isCorrect = false;
        badgeHTML = `<span class="quiz-review-badge incorrect" id="roadmap-review-badge-${i}">Incorrect (Self-Graded)</span>`;
      } else {
        isCorrect = false;
        badgeHTML = `<span class="quiz-review-badge" id="roadmap-review-badge-${i}" style="background:rgba(255,255,255,0.08);color:var(--text-muted)">Pending Self-Grade</span>`;
      }
    }

    const emoji = q.type === 'mcq' ? '🔧' : q.type === 'fill_blank' ? '✏️' : '✍️';
    const typeLabel = q.type === 'mcq' ? 'MCQ' : q.type === 'fill_blank' ? 'Fill in Blank' : 'Short Answer';

    reviewCardsHTML += `
      <div class="quiz-review-card" style="padding: 16px; margin-bottom: 12px; border-radius: 12px;">
        <div class="quiz-review-header" style="margin-bottom: 8px;">
          <span class="quiz-review-num" style="font-size: 11px;">${emoji} ${typeLabel} — Question ${i + 1}</span>
          ${badgeHTML}
        </div>
        <div class="quiz-review-q" style="font-size: 14px; margin-bottom: 10px;">${localSanitize(q.q)}</div>
        
        <div class="quiz-review-answer-box ${q.type !== 'short_answer' ? (isCorrect ? 'correct' : 'incorrect') : (roadmapUserAnswers[i]?.graded === 'correct' ? 'correct' : (roadmapUserAnswers[i]?.graded === 'incorrect' ? 'incorrect' : ''))}" id="roadmap-review-answer-box-${i}" style="padding: 10px; font-size: 12.5px;">
          <div style="margin-bottom: 4px;">${userAnsText}</div>
          <div>${correctAnsText}</div>
        </div>

        ${q.type === 'short_answer' ? `
          <div class="self-grade-row" id="roadmap-self-grade-${i}" style="padding: 10px 14px; margin-top: 10px;">
            <span class="self-grade-text" style="font-size: 11.5px;">Self-Grade this short answer:</span>
            <div class="self-grade-btns">
              <button class="self-grade-btn correct-btn ${roadmapUserAnswers[i]?.graded === 'correct' ? 'active' : ''}" onclick="gradeRoadmapShortAnswer(${i}, 'correct')">✔️ Correct</button>
              <button class="self-grade-btn incorrect-btn ${roadmapUserAnswers[i]?.graded === 'incorrect' ? 'active' : ''}" onclick="gradeRoadmapShortAnswer(${i}, 'incorrect')">❌ Incorrect</button>
            </div>
          </div>
        ` : ''}

        <div class="quiz-review-explanation" style="font-size: 12.5px; margin-top: 8px; padding-top: 8px;">
          <div style="font-weight:700;font-size:10px;text-transform:uppercase;color:var(--cyan);margin-bottom:2px;">Explanation:</div>
          <div>${localSanitize(q.explanation)}</div>
        </div>
      </div>
    `;
  });

  container.innerHTML = reviewCardsHTML;

  // Render the dashboard scorecard
  const pct = Math.round((score / questions.length) * 100);
  const scoreEmoji = pct >= 80 ? '🌟' : (pct >= 60 ? '👍' : (pct >= 40 ? '📈' : '💪'));

  const summary = document.getElementById('roadmap-quiz-results-summary');
  if (summary) {
    summary.innerHTML = `
      <div class="quiz-results-badge" style="font-size: 36px; margin-bottom: 10px;">${scoreEmoji}</div>
      <div class="quiz-results-score" id="roadmap-quiz-results-score" style="font-size: 28px;">Score: <strong>${score}</strong> / ${questions.length}</div>
      <div class="quiz-results-percentage" id="roadmap-quiz-results-percentage" style="font-size: 15px; margin-bottom: 12px;">${pct}% Accuracy</div>
      <div class="quiz-results-msg" id="roadmap-quiz-results-msg" style="font-size: 13px; max-width: 440px; margin-bottom: 16px;">
        ${pct >= 80 ? 'Exceptional! You have a solid grasp of this round\'s concepts. Keep pushing forward! 🚀' : 
          (pct >= 60 ? 'Great effort! You clearly understand the core topics. Fine-tune details to hit 100%! 👍' : 
          'Review the study material and try again. Practice makes perfect in interview prep! 💪')}
      </div>
    `;
  }
}

function gradeRoadmapShortAnswer(qIdx, gradeState) {
  if (roadmapUserAnswers[qIdx]) {
    roadmapUserAnswers[qIdx].graded = gradeState;
  }

  // Highlight active buttons
  const selfGradeRow = document.getElementById(`roadmap-self-grade-${qIdx}`);
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

  recalculateRoadmapScore();
}

function recalculateRoadmapScore() {
  const questions = roadmapQuizQuestions[currentRound];
  let score = 0;
  questions.forEach((q, i) => {
    if (q.type === 'mcq') {
      const uLetter = roadmapUserAnswers[i] || '';
      const isCorrect = uLetter.trim().toUpperCase() === q.correct.trim().toUpperCase();
      if (isCorrect) score++;
    } else if (q.type === 'fill_blank') {
      const uVal = (roadmapUserAnswers[i] || '').trim();
      const isCorrect = uVal.toLowerCase() === q.correct.trim().toLowerCase();
      if (isCorrect) score++;
    } else if (q.type === 'short_answer') {
      if (roadmapUserAnswers[i] && roadmapUserAnswers[i].graded === 'correct') {
        score++;
      }
    }
  });

  const pct = Math.round((score / questions.length) * 100);

  const scoreEl = document.getElementById('roadmap-quiz-results-score');
  const pctEl = document.getElementById('roadmap-quiz-results-percentage');

  if (scoreEl) scoreEl.innerHTML = `Score: <strong>${score}</strong> / ${questions.length}`;
  if (pctEl) pctEl.textContent = `${pct}% Accuracy`;

  // Dynamically update correct/incorrect badges and cards
  questions.forEach((q, i) => {
    if (q.type === 'short_answer') {
      const badge = document.getElementById(`roadmap-review-badge-${i}`);
      const answerBox = document.getElementById(`roadmap-review-answer-box-${i}`);
      if (badge && answerBox) {
        if (roadmapUserAnswers[i] && roadmapUserAnswers[i].graded === 'correct') {
          badge.className = 'quiz-review-badge correct';
          badge.textContent = 'Correct (Self-Graded)';
          answerBox.className = 'quiz-review-answer-box correct';
        } else if (roadmapUserAnswers[i] && roadmapUserAnswers[i].graded === 'incorrect') {
          badge.className = 'quiz-review-badge incorrect';
          badge.textContent = 'Incorrect (Self-Graded)';
          answerBox.className = 'quiz-review-answer-box incorrect';
        }
      }
    }
  });
}

function restartRoadmapQuiz() {
  roadmapQuizQuestions[currentRound] = [];
  startRoadmapQuiz();
}

function localSanitize(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
