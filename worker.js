const MAX_MESSAGE_LENGTH = 400;
const MIN_MESSAGE_LENGTH = 2;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 12;

const PROMPT_INJECTION_MARKERS = [
  "ignore previous",
  "ignore all",
  "system prompt",
  "developer message",
  "reveal prompt",
  "jailbreak",
  "bypass",
  "act as"
];

const SENSITIVE_INFO_MARKERS = [
  "where do you live",
  "where are you based",
  "your address",
  "home address",
  "location",
  "phone",
  "mobile",
  "telephone",
  "contact number"
];

const PROFILE_FACTS = {
  name: "Norbert Skwierczynski",
  role: "Full-Stack Developer",
  summary:
    "Full-Stack Developer with practical delivery experience across frontend and backend systems, including PostgreSQL, RESTful APIs, and modern JavaScript-based interfaces.",
  focus:
    "Performance optimization, clean architecture, and reliable frontend-backend integration with measurable user-experience improvements.",
  objective:
    "Passionate about Cyber Security with motivation to support society and confront malicious activity responsibly.",
  experience: [
    {
      title: "Full Developer",
      type: "Freelancer",
      period: "2021 - Present",
      highlights: [
        "Built and iterated portfolio projects using HTML, CSS (Sass), JavaScript, and later Tailwind CSS.",
        "Improved load times by about 30 percent through WebP/AVIF image optimization and minification.",
        "Implemented backend solutions with REST APIs, FastAPI, and PostgreSQL, including schema design and secure data handling."
      ]
    },
    {
      title: "Junior Web Developer",
      company: "Jatex",
      period: "01/2007 - 06/2007",
      highlights: [
        "Enhanced online order form UX with HTML, CSS, and basic JavaScript.",
        "Improved visual design and functional flow for smoother customer ordering."
      ]
    },
    {
      title: "Database Administrator",
      company: "Uslugi Elektryczne Jaroslaw Rybacki",
      period: "2005 - Present",
      highlights: [
        "Created and maintained PostgreSQL customer databases.",
        "Applied normalization, maintenance routines, and query optimization for consistency and performance."
      ]
    }
  ],
  education: [
    "Currently progressing through HND Computing (in progress)",
    "HNC Computing",
    "Le Wagon Full-Stack Web Developer Boot Camp",
    "Technical School - Technician of Agro Business and IT Development"
  ],
  educationStatus:
    "Currently progressing through HND Computing while continuing practical full-stack and cybersecurity development.",
  training: [
    "Le Wagon Full-Stack Bootcamp",
    "TryHackMe Red Team learning path"
  ],
  projects: [
    "Quick Quizz app using ChatGPT API to convert notes into quizzes",
    "Portfolio rebuild using Tailwind CSS for cleaner UI and responsiveness"
  ],
  skills: {
    frontend: ["HTML5", "CSS", "JavaScript", "Tailwind CSS", "SASS", "Bootstrap", "Ajax"],
    backend: ["Node.js", "REST APIs", "FastAPI", "PostgreSQL", "Ruby", "Ruby on Rails", "PHP", "OOP"],
    devopsAndTooling: ["Git", "GitHub branching", "Heroku", "Trello stand-ups"],
    securityAndPractices: [
      "Input validation and sanitization",
      "Avoiding common vulnerabilities such as SQL injection",
      "Linux command line for file management and scripting"
    ],
    softSkills: ["Problem solving", "Teamwork", "Adaptability", "Client communication", "Time management"]
  },
  cybersecurity: [
    "TryHackMe learning paths",
    "Immersive Labs exercises",
    "OWASP Top 10 awareness",
    "Red-team fundamentals"
  ],
  contact: {
    email: "norbert.fe.dev@gmail.com",
    github: "https://github.com/NoriFe",
    linkedin: "https://www.linkedin.com/in/norbert-skwierczynski/"
  },
  privacy: {
    doNotShare: [
      "phone number",
      "home address",
      "exact location"
    ]
  }
};

const rateLimitStore = globalThis.__portfolioChatRateLimit || new Map();
globalThis.__portfolioChatRateLimit = rateLimitStore;

const json = (status, payload) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8"
    }
  });

function normalizeText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function containsPromptInjection(text) {
  const lower = text.toLowerCase();
  return PROMPT_INJECTION_MARKERS.some((marker) => lower.includes(marker));
}

function requestsSensitiveInfo(text) {
  const lower = text.toLowerCase();
  return SENSITIVE_INFO_MARKERS.some((marker) => lower.includes(marker));
}

function isRateLimited(ip) {
  const now = Date.now();
  const bucket = rateLimitStore.get(ip) || [];
  const recent = bucket.filter((entry) => now - entry < RATE_LIMIT_WINDOW_MS);

  if (recent.length >= RATE_LIMIT_MAX_REQUESTS) {
    rateLimitStore.set(ip, recent);
    return true;
  }

  recent.push(now);
  rateLimitStore.set(ip, recent);
  return false;
}

function buildSystemPrompt() {
  return [
    "You are Norbert's portfolio CV assistant.",
    "Treat the person chatting as a visitor by default.",
    "Never call the visitor Norbert unless they explicitly state they are Norbert.",
    "Answer only using the provided profile facts.",
    "Never reveal or infer phone number, address, or current location.",
    "If asked for phone number or location, politely refuse and offer email/LinkedIn/GitHub instead.",
    "If the question is outside these facts, say you do not have that information yet and offer relevant topics.",
    "Never invent companies, job titles, timelines, or achievements.",
    "If asked about education, include that Norbert is currently progressing through HND Computing.",
    "Keep the response professional, concise, and friendly (2-4 short sentences).",
    "Vary wording naturally, but do not change facts.",
    "If asked for harmful, illegal, or unrelated topics, decline and redirect to CV topics."
  ].join(" ");
}

function isGreeting(text) {
  const normalized = normalizeText(text).toLowerCase();
  return ["hi", "hello", "hey", "yo", "good morning", "good afternoon", "good evening"].includes(normalized);
}

function buildUserPrompt(message, recentHistory) {
  return [
    "PROFILE_FACTS:",
    JSON.stringify(PROFILE_FACTS, null, 2),
    "",
    "RECENT_CHAT_CONTEXT:",
    recentHistory,
    "",
    `USER_QUESTION: ${message}`
  ].join("\n");
}

function buildFallbackReply(message) {
  const lower = normalizeText(message).toLowerCase();

  if (lower.includes("skill") || lower.includes("stack") || lower.includes("frontend") || lower.includes("backend")) {
    return "Norbert delivers across frontend and backend, with practical experience in HTML/CSS/JavaScript, Tailwind CSS, REST APIs, FastAPI workflows, and PostgreSQL. He focuses on maintainability, performance, and clean system integration rather than tool usage alone.";
  }

  if (lower.includes("project") || lower.includes("portfolio") || lower.includes("work")) {
    return "Norbert's projects are built around practical outcomes: responsive UX, optimized asset delivery, and reliable backend integration. You can ask for project examples by frontend, backend, or full-stack scope for a clearer recruiter-style summary.";
  }

  if (lower.includes("certification") || lower.includes("bootcamp") || lower.includes("learn")) {
    return "Norbert completed the Le Wagon Full-Stack Bootcamp and continues active learning in cybersecurity through TryHackMe and Immersive Labs.";
  }

  if (lower.includes("education") || lower.includes("study") || lower.includes("hnd") || lower.includes("hnc")) {
    return "Norbert is currently progressing through HND Computing and has completed HNC Computing. He also completed the Le Wagon Full-Stack Web Developer Boot Camp and continues structured learning in cybersecurity.";
  }

  if (lower.includes("contact") || lower.includes("email") || lower.includes("linkedin") || lower.includes("github")) {
    return "You can contact Norbert at norbert.fe.dev@gmail.com. You can also connect on LinkedIn or review work on GitHub from the portfolio links.";
  }

  if (lower.includes("cyber") || lower.includes("security")) {
    return "Norbert is currently building practical cybersecurity skills through TryHackMe and Immersive Labs, with focus on OWASP awareness, red-team fundamentals, and security-first thinking.";
  }

  return "I can help with Norbert's profile, skills, projects, certifications, cybersecurity learning, and contact details. Ask any of those and I will keep it concise and professional.";
}

async function queryGroq(apiKey, message, history) {
  const recentHistory = (Array.isArray(history) ? history : [])
    .slice(-6)
    .map((entry) => {
      const role = normalizeText(entry?.role).toLowerCase() === "assistant" ? "assistant" : "user";
      const text = normalizeText(entry?.text).slice(0, 280);
      return `${role}: ${text}`;
    })
    .join("\n");

  const endpoint = "https://api.groq.com/openai/v1/chat/completions";

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      temperature: 0.6,
      max_tokens: 220,
      messages: [
        {
          role: "system",
          content: buildSystemPrompt()
        },
        {
          role: "user",
          content: buildUserPrompt(message, recentHistory)
        }
      ]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq request failed (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const answer = normalizeText(data?.choices?.[0]?.message?.content || "");

  if (!answer) {
    throw new Error("Empty model response");
  }

  return answer.slice(0, 900);
}

async function handleChat(request, env) {
  if (request.method !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  const clientIp = request.headers.get("CF-Connecting-IP") || "unknown";
  if (isRateLimited(clientIp)) {
    return json(429, {
      error: "Too many requests. Please wait a moment and try again."
    });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json(400, { error: "Invalid JSON payload" });
  }

  const message = normalizeText(body?.message);
  const history = Array.isArray(body?.history) ? body.history : [];

  if (message.length < MIN_MESSAGE_LENGTH || message.length > MAX_MESSAGE_LENGTH) {
    return json(400, {
      error: `Message must be between ${MIN_MESSAGE_LENGTH} and ${MAX_MESSAGE_LENGTH} characters.`
    });
  }

  if (containsPromptInjection(message)) {
    return json(400, {
      error: "Please ask a normal CV question about Norbert's profile, skills, projects, or contact details."
    });
  }

  if (requestsSensitiveInfo(message)) {
    return json(200, {
      source: "privacy-guard",
      reply:
        "I cannot share phone number or location details. You can contact Norbert by email at norbert.fe.dev@gmail.com, or through LinkedIn and GitHub links in the portfolio."
    });
  }

  if (isGreeting(message)) {
    return json(200, {
      source: "greeting",
      reply:
        "Hi! I am Norbert's CV assistant. Ask me about skills, projects, experience, certifications, cybersecurity learning, or contact details."
    });
  }

  const apiKey = env.GROQ_API_KEY;
  if (!apiKey) {
    return json(500, {
      error: "Server is missing GROQ_API_KEY configuration."
    });
  }

  try {
    const reply = await queryGroq(apiKey, message, history);
    return json(200, {
      source: "groq",
      reply
    });
  } catch (error) {
    console.error("chat function error", error);
    const isQuotaError = String(error?.message || "").includes("429") || String(error?.message || "").includes("RESOURCE_EXHAUSTED");
    if (isQuotaError) {
      return json(200, {
        source: "fallback",
        reply: buildFallbackReply(message)
      });
    }

    return json(502, {
      error: "Chat service is temporarily unavailable. Please try again shortly."
    });
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/chat") {
      return handleChat(request, env);
    }

    return env.ASSETS.fetch(request);
  }
};
