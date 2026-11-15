export type NavSectionId =
  | 'home'
  | 'company'
  | 'capabilities'
  | 'solutions'
  | 'work'
  | 'contact';

export interface NavItem {
  id: NavSectionId;
  label: string;
}

export const PRIMARY_NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'company', label: 'Company' },
  { id: 'capabilities', label: 'Capabilities' },
  { id: 'solutions', label: 'Solutions' },
  { id: 'work', label: 'Work' },
  { id: 'contact', label: 'Contact' },
];

export type ServiceOption =
  | 'Web & App Development'
  | 'AI Automation & Agents'
  | 'AI & Web Security Audit'
  | 'Brand & UI/UX Design';

export interface CapabilityItem {
  id: string;
  index: string;
  code: string;
  title: string;
  brief: string;
  description: string;
  stack: string[];
  metricLabel: string;
  metricValue: string;
  metricCaption: string;
  targetWidth: number;
  serviceOption: ServiceOption;
}

export const CAPABILITIES: CapabilityItem[] = [
  {
    id: 'web',
    index: '01',
    code: 'Web & Mobile',
    title: 'Web & Cross-Platform App Engineering',
    brief:
      '60fps SaaS platforms, institutional portals, and mobile apps engineered for speed, scale, and conversion.',
    description:
      'Custom full-stack applications built with Next.js, React, and TypeScript—featuring real-time dashboards, role-based portals, and zero bloated templates.',
    stack: ['Next.js / React', 'TypeScript', 'Node / FastAPI', 'Mobile Apps'],
    metricLabel: 'Performance & Vitals',
    metricValue: '99 / 100',
    metricCaption: 'Sub-second load times with edge caching & clean UI',
    targetWidth: 98,
    serviceOption: 'Web & App Development',
  },
  {
    id: 'ai',
    index: '02',
    code: 'AI Systems',
    title: 'AI Automation & Autonomous Agents',
    brief:
      'Custom LLM pipelines, intelligent workflow bots, and predictive analytics wired directly into your operations.',
    description:
      'Automate repetitive customer ops, lead qualification, and internal data pipelines with custom AI agents trained on your business logic.',
    stack: ['Custom AI Agents', 'Python', 'RAG Knowledge Bases', 'API Workflows'],
    metricLabel: 'Manual Workload Reduction',
    metricValue: '96.4%',
    metricCaption: '24/7 autonomous execution with human-in-the-loop controls',
    targetWidth: 96,
    serviceOption: 'AI Automation & Agents',
  },
  {
    id: 'security',
    index: '03',
    code: 'Security',
    title: 'AI & Web Security Auditing',
    brief:
      'Vulnerability assessments, OWASP penetration testing, and hardened API security before you scale.',
    description:
      'Deep-dive security audits across web apps, REST/GraphQL endpoints, and AI prompt-injection surfaces—delivered with actionable remediation patches.',
    stack: ['OWASP Top 10', 'API Hardening', 'LLM Red-Teaming', 'Auth & RBAC'],
    metricLabel: 'Security Posture Verified',
    metricValue: 'Hardened',
    metricCaption: 'Full vulnerability report + patch verification included',
    targetWidth: 95,
    serviceOption: 'AI & Web Security Audit',
  },
  {
    id: 'design',
    index: '04',
    code: 'Product Design',
    title: 'Brand Systems & Product Design',
    brief:
      'High-conversion landing pages, design systems, and visual brand identities built for modern tech companies.',
    description:
      'Cohesive UI/UX design systems, interactive prototypes, and sharp brand visuals engineered to earn immediate user trust.',
    stack: ['UI/UX Systems', 'Interactive Motion', 'Brand Identity', 'Conversion UX'],
    metricLabel: 'Design-to-Code Fidelity',
    metricValue: '100%',
    metricCaption: 'Pixel-accurate implementation directly by our engineers',
    targetWidth: 97,
    serviceOption: 'Brand & UI/UX Design',
  },
];

export interface SolutionItem {
  id: string;
  kicker: string;
  title: string;
  summary: string;
  outcomes: string[];
  deliverableTimeframe: string;
  featured?: boolean;
  serviceOption: ServiceOption;
}

export const SOLUTIONS: SolutionItem[] = [
  {
    id: 'startups',
    kicker: 'Venture & SaaS Founders',
    title: 'Zero-to-One Product & AI Platform Builds',
    summary:
      'Go from validated product architecture to a hardened production SaaS platform without managing fragmented freelancers or bloated agencies.',
    outcomes: [
      'Production React, TypeScript & API backend with CI/CD pipelines',
      'Integrated RAG workflows, agentic automation & Stripe billing',
      'Clean technical documentation ready for investor due diligence',
    ],
    deliverableTimeframe: '4–8 Week Sprint Delivery',
    featured: true,
    serviceOption: 'Web & App Development',
  },
  {
    id: 'institutions',
    kicker: 'Institutions & Campuses',
    title: 'Unified ERP & Role-Based Digital Portals',
    summary:
      'Replace legacy spreadsheets and disconnected portals with fast, access-controlled institutional infrastructure built for thousands of concurrent users.',
    outcomes: [
      'Student, faculty & administrative RBAC dashboards',
      'Automated fee ledgers, admissions & attendance engines',
      'Sub-second web performance across desktop and mobile',
    ],
    deliverableTimeframe: 'Milestone-Locked Rollout',
    serviceOption: 'Web & App Development',
  },
  {
    id: 'security-ops',
    kicker: 'Growing Teams & AI Products',
    title: 'Pre-Scale Security Hardening & Workflow Ops',
    summary:
      'Eliminate API vulnerabilities, prompt-injection exposures, and manual operational bottlenecks before customer volume spikes.',
    outcomes: [
      'OWASP Top 10 & REST/GraphQL penetration testing with patches',
      'LLM red-teaming & guardrails for customer-facing AI tools',
      'Internal automation hubs connecting CRM, Slack & billing APIs',
    ],
    deliverableTimeframe: '7–14 Day Audit & Patching',
    serviceOption: 'AI & Web Security Audit',
  },
];

export interface CaseStudy {
  id: string;
  caseNumber: string;
  category: string;
  cursorLabel: string;
  title: string;
  description: string;
  stats: { value: string; label: string }[];
  stageStatus: string;
  stageBadge: string;
  stageHeading: string;
  stageSub: string;
  stackSummary: string;
  accentGradient: string;
  challenge: string;
  architecture: string;
  outcomes: string[];
  serviceOption: ServiceOption;
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'campus-erp',
    caseNumber: 'Case 01',
    category: 'Institutional ERP & Web',
    cursorLabel: 'Inspect Platform ↗',
    title: 'Campus Management & Digital Portal',
    description:
      'Unified academic administration system featuring automated student records, role-based faculty dashboards, attendance tracking, and a modern high-speed institutional web portal.',
    stats: [
      { value: '5,000+', label: 'Active User Capacity' },
      { value: '0.4s', label: 'Portal Load Time' },
    ],
    stageStatus: 'System Live',
    stageBadge: 'RBAC Verified',
    stageHeading: 'Unified Campus Core',
    stageSub: 'Admissions · Fee Ledger · Notice & Exam Automation',
    stackSummary: 'React · Node.js · PostgreSQL · Hardened Auth',
    accentGradient:
      'radial-gradient(circle at 30% 20%, rgba(124, 58, 237, 0.22), rgba(15, 23, 42, 0.92))',
    challenge:
      'Fragmented legacy spreadsheets and slow portal logins created bottlenecks during peak admissions and exam result cycles for thousands of students and faculty.',
    architecture:
      'Engineered a unified PostgreSQL data core behind a hardened Node.js API layer with strict role-based access control (RBAC) and edge-cached React views.',
    outcomes: [
      'Reduced portal page load times to 0.4s under concurrent student load',
      'Automated fee reconciliation, attendance logs, and exam notice publishing',
      'Eliminated manual data reconciliation across admissions and finance teams',
    ],
    serviceOption: 'Web & App Development',
  },
  {
    id: 'editor-command',
    caseNumber: 'Case 02',
    category: 'Creator & Agency Ops SaaS',
    cursorLabel: 'Inspect SaaS ↗',
    title: 'Editor Command Center',
    description:
      'Real-time production workspace built for media agencies—integrating Kanban delivery pipelines, automated revision logs, asset vaults, and bitrate calculators in a single 60fps dashboard.',
    stats: [
      { value: '3.2x', label: 'Turnaround Speed' },
      { value: '100%', label: 'Revision Traceability' },
    ],
    stageStatus: 'Pipeline Synced',
    stageBadge: 'Zero Missed Deadlines',
    stageHeading: 'Agency Production Hub',
    stageSub: 'Kanban Workflows · QC Checklists · Instant Asset Vault',
    stackSummary: 'React · Tailwind CSS · Real-Time State Engine',
    accentGradient:
      'radial-gradient(circle at 70% 30%, rgba(37, 99, 235, 0.26), rgba(15, 23, 42, 0.92))',
    challenge:
      'Post-production teams were losing hours every day switching between chat threads, cloud folders, and external spreadsheets to track video revisions and export specs.',
    architecture:
      'Built a 60fps single-workspace React state engine unifying interactive Kanban production lanes, structured QC checklists, asset indexing, and real-time bitrate tooling.',
    outcomes: [
      'Accelerated end-to-end agency asset turnaround by 3.2x',
      'Enforced 100% timestamped revision traceability across editors and producers',
      'Centralized export validation and client handoff checklists in one view',
    ],
    serviceOption: 'Web & App Development',
  },
  {
    id: 'urban-traffic',
    caseNumber: 'Case 03',
    category: 'AI Computer Vision & Telemetry',
    cursorLabel: 'Inspect AI & Smart City ↗',
    title: 'AI Urban Traffic Command Center',
    description:
      'Intelligent traffic signal optimization and real-time congestion telemetry platform designed to dynamically balance intersection flow and reduce urban idle emissions.',
    stats: [
      { value: '-34%', label: 'Congestion Delay' },
      { value: 'Real-Time', label: 'Sensor Telemetry' },
    ],
    stageStatus: 'AI Inference Active',
    stageBadge: 'Multi-Node Grid',
    stageHeading: 'Adaptive Signal Routing',
    stageSub: 'Live Density Scoring · Emergency Corridor Override',
    stackSummary: 'Python · AI Vision · WebSockets · Live Map HUD',
    accentGradient:
      'radial-gradient(circle at 50% 80%, rgba(139, 92, 246, 0.28), rgba(10, 12, 20, 0.94))',
    challenge:
      'Static timed intersections fail to adapt to sudden arterial surges and emergency vehicle corridors, causing cascading gridlock across connected city blocks.',
    architecture:
      'Paired Python computer-vision density inference with low-latency WebSocket telemetry streams feeding a live operator HUD with manual emergency corridor overrides.',
    outcomes: [
      'Simulated 34% reduction in average intersection congestion delay',
      'Sub-second WebSocket state propagation across multi-intersection nodes',
      'Built instant operator override controls for emergency vehicle prioritization',
    ],
    serviceOption: 'AI Automation & Agents',
  },
];

export const EXECUTION_STEPS = [
  {
    step: '01. Architecture',
    title: '24-Hour Technical Blueprint',
    description:
      'Share your requirements. We map out the exact system architecture, tech stack, timeline, and fixed milestone pricing within 24 hours.',
  },
  {
    step: '02. Velocity Sprint',
    title: 'Live Staging & Weekly Releases',
    description:
      'Track real progress from day one on a private live staging URL with transparent milestone deliveries and zero black-box delays.',
  },
  {
    step: '03. Hardened Launch',
    title: 'Security Audit & Production Scale',
    description:
      'Every deployment undergoes OWASP security checks, performance tuning, and full source-code handover with post-launch support.',
  },
];
