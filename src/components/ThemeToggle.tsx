import { Contrast } from 'lucide-react';

export type ThemeTone = 'obsidian' | 'new-year';

interface ThemeToggleProps {
  theme: ThemeTone;
  onToggle: () => void;
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const isNew Year = theme === 'new-year';

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={isNew Year}
      aria-keyshortcuts="t"
      aria-label={`Switch surface tone (current: ${isNew Year ? 'New Year' : 'Deep Obsidian'}, press T)`}
      title={`Switch to ${isNew Year ? 'Deep Obsidian' : 'New Year'} tone (Shortcut: T)`}
      className="fixed bottom-6 left-5 sm:left-8 z-40 h-11 px-3.5 rounded-xl bg-[var(--mq-surface)]/95 backdrop-blur-md border border-[var(--mq-border-strong)] text-[var(--mq-muted)] hover:text-[var(--mq-text)] hover:border-[#7138d5]/65 shadow-[0_8px_24px_rgba(0,0,0,0.12)] inline-flex items-center gap-2 font-mono text-xs transition-colors duration-200 cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7138d5]"
    >
      <Contrast className={`w-4 h-4 shrink-0 transition-transform duration-300 ${isNew Year ? 'rotate-180 text-[#7138d5]' : 'text-[var(--mq-accent-soft)]'}`} aria-hidden="true" />
      <span className="hidden sm:inline">{isNew Year ? 'Tone: New Year' : 'Tone: Obsidian'}</span>
    </button>
  );
}
