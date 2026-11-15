import { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, X } from 'lucide-react';

export interface ToastMessage {
  id: number;
  title: string;
  description: string;
}

interface ToastNotificationProps {
  toast: ToastMessage | null;
  onDismiss: () => void;
  durationMs?: number;
}

export function ToastNotification({
  toast,
  onDismiss,
  durationMs = 5000,
}: ToastNotificationProps) {
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => {
      onDismiss();
    }, durationMs);
    return () => window.clearTimeout(timer);
  }, [toast, durationMs, onDismiss]);

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed top-20 left-4 right-4 sm:left-auto sm:right-8 sm:w-[390px] z-[70] pointer-events-none"
    >
      <AnimatePresence mode="wait">
        {toast && (
          <motion.div
            key={toast.id}
            role="status"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto rounded-xl bg-[var(--mq-surface)]/95 backdrop-blur-xl border border-[#34D399]/35 p-4 shadow-[0_16px_40px_rgba(0,0,0,0.55)] flex items-start gap-3"
          >
            <CheckCircle2
              className="w-5 h-5 text-[#34D399] shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white leading-snug">
                {toast.title}
              </p>
              <p className="text-xs text-[var(--mq-muted)] mt-1 leading-relaxed">
                {toast.description}
              </p>
            </div>
            <button
              type="button"
              onClick={onDismiss}
              aria-label="Dismiss notification"
              className="w-8 h-8 -mt-1 -mr-1 rounded-lg text-[#8E8E98] hover:text-white hover:bg-white/[0.06] flex items-center justify-center shrink-0 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
