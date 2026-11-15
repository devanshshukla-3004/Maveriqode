import { Contrast } from 'lucide-react';

export type ThemeTone = 'obsidian' | 'slate';

interface ThemeToggleProps {
  theme: ThemeTone;
  onToggle: () => void;
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const isSlate = theme === 'slate';

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={isSlate}
      aria-label={`Switch surface tone (current: ${isSlate ? 'Softer Slate' : 'Deep Dark'})`}
      title={`Switch to ${isSlate ? 'Deep Dark' : 'Softer Slate'} theme`}
      className="fixed bottom-6 left-5 sm:left-8 z-40 h-11 px-3.5 rounded-xl bg-[var(--mq-surface)]/92 backdrop-blur-md border border-[var(--mq-border-strong)] text-[var(--mq-muted)] hover:text-white hover:border-[#8B5CF6]/60 shadow-[0_8px_24px_rgba(0,0,0,0.45)] inline-flex items-center gap-2 font-mono text-xs transition-colors duration-200 cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]"
    >
      <Contrast
        className={`w-4 h-4 shrink-0 transition-transform duration-300 ${
          isSlate ? 'rotate-180 text-[#93C5FD]' : 'text-[#A78BFA]'
        }`}
        aria-hidden="true"
      />
      <span className="hidden sm:inline">
        {isSlate ? 'Tone: Slate' : 'Tone: Obsidian'}
      </span>
    </button>
  );
}
