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
  { id: 'capabilities', label: 'Capabilities' },
  { id: 'solutions', label: 'Solutions' },
  { id: 'work', label: 'Work' },
  { id: 'company', label: 'Company' },
  { id: 'contact', label: 'Contact' },
];

export const OFFICIAL_CONTACT_EMAIL = 'maveriqode@gmail.com';

export type ServiceOption =
  | 'Software Engineering'
  | 'AI & Intelligent Systems'
  | 'Automation & Integration'
  | 'SaaS & Product Development'
  | 'Cybersecurity'
  | 'Digital Infrastructure';

export type CapabilityBlueprintVariant =
  | 'software'
  | 'ai'
  | 'automation'
  | 'saas'
  | 'cybersecurity'
  | 'infrastructure';

export interface CapabilityItem {
  id: string;
  index: string;
  code: string;
  title: ServiceOption;
  brief: string;
  description: string;
  focusAreas: string[];
  stack: string[];
  blueprintRef: string;
  blueprintTitle: string;
  blueprintNodes: string[];
  visualVariant: CapabilityBlueprintVariant;
}

export const CAPABILITIES: CapabilityItem[] = [
  {
    id: 'software-engineering',
    index: '01',
    code: 'Core Systems',
    title: 'Software Engineering',
    brief:
      'Custom web applications, internal platforms, and APIs built for maintainability and clean system boundaries.',
    description:
      'We architect and deliver full-stack software systems with strongly typed interfaces, clear domain modeling, and tested service boundaries—structured so your engineering team can extend them without friction.',
    focusAreas: [
      'Full-stack web platforms and domain-driven backend services',
      'Strongly typed REST and GraphQL API design and documentation',
      'Relational database modeling, query optimization, and migrations',
      'Automated testing, linting, and continuous integration workflows',
    ],
    stack: ['TypeScript', 'React', 'Node.js', 'Python', 'PostgreSQL'],
    blueprintRef: 'SYS-01 · Application Core',
    blueprintTitle: 'Modular Service & Domain Boundary',
    blueprintNodes: ['Client Surface', 'API Gateway', 'Domain Services', 'Data Store'],
    visualVariant: 'software',
  },
  {
    id: 'ai-intelligent-systems',
    index: '02',
    code: 'Applied AI',
    title: 'AI & Intelligent Systems',
    brief:
      'Production-oriented AI workflows, retrieval architectures, and decision-support tools anchored to real business data.',
    description:
      'We design and integrate intelligent systems around structured retrieval, validation guardrails, and human review checkpoints—treating models as components inside deterministic engineering pipelines.',
    focusAreas: [
      'Retrieval-augmented generation (RAG) over governed document corpora',
      'Structured extraction, classification, and semantic search pipelines',
      'Prompt evaluation harnesses, output schemas, and fallback routing',
      'Human-in-the-loop review queues and audit logging',
    ],
    stack: ['Python', 'Vector Indexing', 'Structured Outputs', 'Evaluation Harnesses'],
    blueprintRef: 'SYS-02 · Inference Pipeline',
    blueprintTitle: 'Grounded Retrieval & Verification Flow',
    blueprintNodes: ['Document Corpus', 'Retriever', 'Model Runtime', 'Schema Guard'],
    visualVariant: 'ai',
  },
  {
    id: 'automation-integration',
    index: '03',
    code: 'Orchestration',
    title: 'Automation & Integration',
    brief:
      'Reliable system-to-system integrations and event-driven workflows that eliminate fragile manual handoffs.',
    description:
      'We connect disparate internal tools, third-party APIs, and operational databases through idempotent pipelines with explicit retry handling, observability, and clear failure recovery.',
    focusAreas: [
      'Event-driven webhooks, message queues, and background job workers',
      'Bi-directional synchronization across CRM, ERP, billing, and ops tools',
      'Idempotent data ingestion, validation, and reconciliation jobs',
      'Centralized alerting and dead-letter queue visibility',
    ],
    stack: ['Event Queues', 'Webhooks', 'ETL Pipelines', 'REST / GraphQL'],
    blueprintRef: 'SYS-03 · Event Bus',
    blueprintTitle: 'Idempotent Synchronization Fabric',
    blueprintNodes: ['Source Hooks', 'Queue Broker', 'Transform Worker', 'Target APIs'],
    visualVariant: 'automation',
  },
  {
    id: 'saas-product-development',
    index: '04',
    code: 'Product Craft',
    title: 'SaaS & Product Development',
    brief:
      'Multi-tenant software products, customer portals, and design systems built from architecture through release.',
    description:
      'From initial product architecture to multi-tenant access controls, billing hooks, and responsive interfaces, we build commercial software products engineered for clarity, usability, and long-term iteration.',
    focusAreas: [
      'Multi-tenant data isolation, permissions, and organization workspaces',
      'Component design systems and accessible responsive user interfaces',
      'Subscription billing, usage metering, and onboarding flows',
      'Telemetry instrumentation and structured release pipelines',
    ],
    stack: ['React', 'Tailwind CSS', 'Multi-Tenancy', 'Design Systems', 'Stripe'],
    blueprintRef: 'SYS-04 · Multi-Tenant SaaS',
    blueprintTitle: 'Workspace & Tenant Isolation Topology',
    blueprintNodes: ['Design System', 'Tenant Auth', 'Billing Engine', 'Admin Console'],
    visualVariant: 'saas',
  },
  {
    id: 'cybersecurity',
    index: '05',
    code: 'Security',
    title: 'Cybersecurity',
    brief:
      'Application security reviews, access-control hardening, and threat-aware engineering across web and AI surfaces.',
    description:
      'We identify and remediate security weaknesses across application codebases, API endpoints, authentication flows, and AI integrations—embedding defensive engineering into the system rather than bolting it on afterward.',
    focusAreas: [
      'OWASP-aligned code and configuration security reviews',
      'Authentication, session lifecycle, and role-based access control (RBAC)',
      'Input validation, rate limiting, and API surface hardening',
      'Prompt-injection defense and data-boundary checks for AI systems',
    ],
    stack: ['OWASP Controls', 'RBAC & Auth', 'API Hardening', 'Threat Modeling'],
    blueprintRef: 'SYS-05 · Security Perimeter',
    blueprintTitle: 'Defense-in-Depth Inspection Gate',
    blueprintNodes: ['Edge Filter', 'Auth & RBAC', 'Policy Engine', 'Audit Trail'],
    visualVariant: 'cybersecurity',
  },
  {
    id: 'digital-infrastructure',
    index: '06',
    code: 'Foundations',
    title: 'Digital Infrastructure',
    brief:
      'Cloud architecture, deployment automation, and observability foundations engineered for dependable operation.',
    description:
      'We structure cloud environments, containerized workloads, CI/CD pipelines, and backup/monitoring topologies so software teams can deploy predictably and diagnose production issues quickly.',
    focusAreas: [
      'Infrastructure-as-Code environments and reproducible deployments',
      'CI/CD automation, containerization, and staging parity',
      'Structured logging, health checks, and operational telemetry',
      'Backup verification, secret management, and network segmentation',
    ],
    stack: ['Containers', 'CI/CD', 'Cloud Networking', 'Observability'],
    blueprintRef: 'SYS-06 · Runtime Fabric',
    blueprintTitle: 'Reproducible Build & Telemetry Mesh',
    blueprintNodes: ['Source Repo', 'CI Runner', 'Isolated Runtime', 'Telemetry'],
    visualVariant: 'infrastructure',
  },
];

export interface CompanyPrinciple {
  index: string;
  title: string;
  description: string;
}

export const COMPANY_PRINCIPLES: CompanyPrinciple[] = [
  {
    index: '01',
    title: 'Architectural Clarity Before Code',
    description:
      'Every engagement begins by mapping system boundaries, data models, failure modes, and security requirements so implementation proceeds without guesswork.',
  },
  {
    index: '02',
    title: 'Direct Engineering Accountability',
    description:
      'You collaborate directly with the engineers designing and writing your system—keeping technical decisions close to the problem.',
  },
  {
    index: '03',
    title: 'Maintainability & Source Ownership',
    description:
      'Clean repositories, explicit documentation, and structured handovers ensure your organization controls every line of code and infrastructure.',
  },
];

export interface ExecutionStep {
  step: string;
  title: string;
  description: string;
}

export const EXECUTION_STEPS: ExecutionStep[] = [
  {
    step: '01 · Discovery & Architecture',
    title: 'System & Scope Definition',
    description:
      'We analyze your technical constraints, existing stack, and operational goals to produce a structured architecture plan and phased implementation scope.',
  },
  {
    step: '02 · Iterative Engineering',
    title: 'Transparent Milestone Delivery',
    description:
      'Software is built in verifiable increments against a staging environment with regular technical walkthroughs and repository visibility.',
  },
  {
    step: '03 · Hardening & Handover',
    title: 'Security Review & Documentation',
    description:
      'Before production release, we verify access controls, environment configuration, and deployment documentation for seamless team ownership.',
  },
];

export interface SolutionItem {
  id: string;
  kicker: string;
  title: string;
  summary: string;
  outcomes: string[];
  architectureFocus: string;
  featured?: boolean;
  serviceOption: ServiceOption;
}

export const SOLUTIONS: SolutionItem[] = [
  {
    id: 'digital-product-development',
    kicker: 'Product Engineering',
    title: 'Digital Product Development',
    summary:
      'End-to-end engineering for commercial web platforms, SaaS applications, and custom internal software built around clear product requirements.',
    outcomes: [
      'Modular frontend and backend architecture tailored to your domain',
      'Role-based access control, tenant separation, and clean API contracts',
      'Maintainable codebase structured for ongoing feature expansion',
    ],
    architectureFocus: 'SaaS & Web Platforms',
    featured: true,
    serviceOption: 'SaaS & Product Development',
  },
  {
    id: 'intelligent-business-systems',
    kicker: 'Decision & Data Systems',
    title: 'Intelligent Business Systems',
    summary:
      'Structured software systems that unify operational data, surface domain insights, and embed applied AI where it improves accuracy.',
    outcomes: [
      'Unified operational dashboards backed by clean relational schemas',
      'Grounded knowledge retrieval across internal technical and policy documents',
      'Validation rules and auditability across automated recommendations',
    ],
    architectureFocus: 'Software & Applied AI',
    serviceOption: 'AI & Intelligent Systems',
  },
  {
    id: 'enterprise-workflows',
    kicker: 'Systems Connectivity',
    title: 'Enterprise Workflows',
    summary:
      'Replace fragmented spreadsheets and manual data entry with synchronized, access-controlled pipelines connecting your core tools.',
    outcomes: [
      'Reliable integration between ERP, CRM, billing, and internal portals',
      'Event-driven processing with idempotency and error visibility',
      'Role-specific operational views tailored to distinct teams',
    ],
    architectureFocus: 'Integration & Portals',
    serviceOption: 'Automation & Integration',
  },
  {
    id: 'ai-powered-operations',
    kicker: 'Operational Automation',
    title: 'AI-Powered Operations',
    summary:
      'Automate high-volume triage, document processing, and internal routing with bounded AI pipelines and human oversight.',
    outcomes: [
      'Structured extraction and routing for inbound requests and documents',
      'Explicit confidence thresholds and human approval workflows',
      'Guardrails separating model reasoning from sensitive state mutations',
    ],
    architectureFocus: 'Workflows & Agents',
    serviceOption: 'AI & Intelligent Systems',
  },
  {
    id: 'security-infrastructure-engineering',
    kicker: 'Resilience & Controls',
    title: 'Security & Infrastructure Engineering',
    summary:
      'Harden web applications, APIs, AI endpoints, and cloud deployment pipelines against common attack vectors and operational fragility.',
    outcomes: [
      'OWASP-aligned vulnerability assessment and remediation engineering',
      'Reproducible deployment pipelines, secrets hygiene, and logging',
      'Hardened authentication, authorization, and rate-limiting boundaries',
    ],
    architectureFocus: 'Hardening & Cloud Ops',
    featured: true,
    serviceOption: 'Cybersecurity',
  },
];

export interface WorkEvaluationArea {
  code: string;
  title: string;
  description: string;
  serviceOption: ServiceOption;
}

export const WORK_EVALUATION_AREAS: WorkEvaluationArea[] = [
  {
    code: 'ARCH-01',
    title: 'Private Architecture Walkthroughs',
    description:
      'Review system design patterns, repository standards, and engineering documentation tailored to your problem domain.',
    serviceOption: 'Software Engineering',
  },
  {
    code: 'ARCH-02',
    title: 'Technical Scope & Feasibility Brief',
    description:
      'Discuss stack trade-offs, security boundaries, and integration requirements directly with our engineering team.',
    serviceOption: 'Digital Infrastructure',
  },
];

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const COMPANY_FAQS: FaqItem[] = [
  {
    id: 'engagement-start',
    question: 'How does an engineering engagement with MAVERIQODE begin?',
    answer:
      'We start with a technical discovery review of your objectives, existing systems, and constraints. From there, we outline a proposed architecture, capability scope, and phased delivery plan before implementation begins.',
  },
  {
    id: 'code-ownership',
    question: 'Who owns the codebase and intellectual property?',
    answer:
      'You retain ownership of the custom source code, repository history, documentation, and cloud infrastructure configured for your engagement.',
  },
  {
    id: 'sprint-visibility',
    question: 'How is technical progress communicated during development?',
    answer:
      'Work is organized into structured milestones with staging previews, changelog summaries, and direct repository access so your team can inspect real builds throughout the project.',
  },
  {
    id: 'security-hardening',
    question: 'How is security addressed across software and AI builds?',
    answer:
      'Security controls are designed alongside the core architecture—covering authentication, role-based access control, input validation, API surface protection, and data boundaries for AI workflows.',
  },
  {
    id: 'stack-integration',
    question: 'Can MAVERIQODE work within our existing codebase and infrastructure?',
    answer:
      'Yes. We regularly collaborate within existing Git repositories, cloud accounts, and engineering workflows to extend applications, refactor bottlenecks, or integrate automation and security improvements.',
  },
];
