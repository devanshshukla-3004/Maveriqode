import { useEffect } from 'react';
import { NavSectionId, OFFICIAL_CONTACT_EMAIL } from '../data/maveriqodeData';
import { supabase } from '../lib/supabase';

export interface SectionMeta {
  title: string;
  description: string;
}

export const SECTION_META_MAP: Record<NavSectionId, SectionMeta> = {
  home: {
    title: 'MAVERIQODE — Digital Engineering, AI Systems & Infrastructure',
    description: 'MAVERIQODE is a digital engineering and technology company building software products, AI systems, automation, cybersecurity solutions, and digital infrastructure.',
  },
  company: {
    title: 'Company & Engineering Approach — MAVERIQODE',
    description: 'Learn how MAVERIQODE approaches software architecture, technical accountability, security controls, and direct engineering collaboration.',
  },
  capabilities: {
    title: 'Capabilities — Software, AI, Automation, SaaS, Security & Infrastructure | MAVERIQODE',
    description: 'Explore MAVERIQODE engineering capabilities across software engineering, applied AI, automation, SaaS product development, cybersecurity, and digital infrastructure.',
  },
  solutions: {
    title: 'Solutions — Digital Product, AI Operations & Security Engineering | MAVERIQODE',
    description: 'Practical engineering solutions across digital product development, intelligent business systems, enterprise workflows, AI operations, and security engineering.',
  },
  work: {
    title: 'Selected Work & Technical Archive — MAVERIQODE',
    description: 'MAVERIQODE publishes verified client work only with explicit authorization. Request a private technical walkthrough of our engineering approach.',
  },
  contact: {
    title: 'Bring Us The Problem — Contact MAVERIQODE',
    description: `Start an engineering conversation with MAVERIQODE via ${OFFICIAL_CONTACT_EMAIL} or prepare a structured project inquiry.`,
  },
};

function upsertMetaTag(attributeName: 'name' | 'property', attributeValue: string, content: string) {
  let meta = document.querySelector<HTMLMetaElement>(`meta[${attributeName}="${attributeValue}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attributeName, attributeValue);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}

export function updateSectionMetaTags(sectionId: NavSectionId, override?: Partial<SectionMeta>): SectionMeta {
  const fallback = SECTION_META_MAP[sectionId] ?? SECTION_META_MAP.home;
  const meta = {
    title: override?.title?.trim() || fallback.title,
    description: override?.description?.trim() || fallback.description,
  };
  if (typeof document !== 'undefined') {
    document.title = meta.title;
    upsertMetaTag('name', 'description', meta.description);
    upsertMetaTag('property', 'og:title', meta.title);
    upsertMetaTag('property', 'og:description', meta.description);
    upsertMetaTag('name', 'twitter:title', meta.title);
    upsertMetaTag('name', 'twitter:description', meta.description);
  }
  return meta;
}

export function useSectionMeta(activeSection: NavSectionId) {
  useEffect(() => {
    let active = true;
    const slug = activeSection === 'home' || activeSection === 'contact' ? 'site-seo' : activeSection;
    const fallback = updateSectionMetaTags(activeSection);
    void supabase.from('website_content').select('seo_title,seo_description')
      .eq('slug', slug).eq('status', 'published').maybeSingle()
      .then(({ data, error }: { data: any; error: any }) => {
        if (!active || error || !data) return;
        updateSectionMetaTags(activeSection, {
          title: typeof data.seo_title === 'string' ? data.seo_title : fallback.title,
          description: typeof data.seo_description === 'string' ? data.seo_description : fallback.description,
        });
      });
    return () => { active = false; };
  }, [activeSection]);
}
