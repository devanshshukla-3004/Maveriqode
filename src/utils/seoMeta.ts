import { useEffect } from 'react';
import { NavSectionId } from '../data/maveriqodeData';

export interface SectionMeta {
  title: string;
  description: string;
}

export const SECTION_META_MAP: Record<NavSectionId, SectionMeta> = {
  home: {
    title: 'MAVERIQODE — Digital Engineering, AI Systems & Security',
    description:
      'MAVERIQODE builds high-velocity web & mobile platforms, autonomous AI automation, and hardened security architectures for ambitious startups and enterprises.',
  },
  company: {
    title: 'Company & Delivery Model — MAVERIQODE',
    description:
      'Senior engineering teams with zero outsourced handoffs, 24-hour technical blueprints, weekly live staging releases, and 100% source-code ownership.',
  },
  capabilities: {
    title: 'Capabilities — Web, AI, Security & Design | MAVERIQODE',
    description:
      'Full-stack web and cross-platform app engineering, autonomous AI agents, OWASP and LLM security auditing, and high-conversion product design systems.',
  },
  solutions: {
    title: 'Solutions for Startups, Institutions & AI Teams | MAVERIQODE',
    description:
      'Tailored engineering delivery tracks for venture-backed startups, unified campus ERPs, and pre-scale API and AI security hardening.',
  },
  work: {
    title: 'Production Systems & Case Studies — MAVERIQODE',
    description:
      'Explore deployed systems in production including campus management portals, real-time creator agency workspaces, and AI urban traffic telemetry.',
  },
  contact: {
    title: 'Contact & Project Brief — MAVERIQODE',
    description:
      'Initiate a project brief with MAVERIQODE. Get a 24-hour technical blueprint and sub-4-hour business day response SLA at hello@maveriqode.tech.',
  },
};

function upsertMetaTag(
  attributeName: 'name' | 'property',
  attributeValue: string,
  content: string
) {
  let meta = document.querySelector<HTMLMetaElement>(
    `meta[${attributeName}="${attributeValue}"]`
  );

  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attributeName, attributeValue);
    document.head.appendChild(meta);
  }

  meta.setAttribute('content', content);
}

export function updateSectionMetaTags(sectionId: NavSectionId): SectionMeta {
  const meta = SECTION_META_MAP[sectionId] ?? SECTION_META_MAP.home;

  if (typeof document !== 'undefined') {
    document.title = meta.title;
    upsertMetaTag('name', 'description', meta.description);
    upsertMetaTag('property', 'og:title', meta.title);
    upsertMetaTag('property', 'og:description', meta.description);
  }

  return meta;
}

export function useSectionMeta(activeSection: NavSectionId) {
  useEffect(() => {
    updateSectionMetaTags(activeSection);
  }, [activeSection]);
}
