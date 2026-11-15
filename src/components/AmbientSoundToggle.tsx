import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

interface AudioEngine {
  ctx: AudioContext;
  masterGain: GainNode;
  lfo: OscillatorNode;
  source: AudioBufferSourceNode;
}

const TARGET_GAIN = 0.036;

export function AmbientSoundToggle() {
  const [isPlaying, setIsPlaying] = useState(false);
  const engineRef = useRef<AudioEngine | null>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    return () => {
      const engine = engineRef.current;
      if (engine) {
        try {
          engine.source.stop();
          engine.lfo.stop();
          void engine.ctx.close();
        } catch {
          // Ignore teardown errors on already-closed contexts
        }
        engineRef.current = null;
      }
    };
  }, []);

  const createEngine = (): AudioEngine | null => {
    const AudioCtx =
      window.AudioContext ||
      (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;

    const ctx = new AudioCtx();
    const durationSeconds = 3;
    const bufferSize = Math.floor(ctx.sampleRate * durationSeconds);
    const noiseBuffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);

    // Smooth pink-tinted digital white noise for a subtle atmospheric floor
    for (let ch = 0; ch < 2; ch++) {
      const output = noiseBuffer.getChannelData(ch);
      let b0 = 0;
      let b1 = 0;
      let b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.997 * b0 + white * 0.029;
        b1 = 0.985 * b1 + white * 0.032;
        b2 = 0.95 * b2 + white * 0.048;
        output[i] = (b0 + b1 + b2 + white * 0.14) * 0.35;
      }
    }

    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    const highpass = ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = 110;

    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 1280;
    lowpass.Q.value = 0.7;

    // Gentle LFO sweeps the low-pass cutoff slowly for a cinematic air feel
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.08;

    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 160;

    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.0001;

    lfo.connect(lfoGain);
    lfoGain.connect(lowpass.frequency);

    source.connect(highpass);
    highpass.connect(lowpass);
    lowpass.connect(masterGain);
    masterGain.connect(ctx.destination);

    source.start();
    lfo.start();

    return { ctx, masterGain, lfo, source };
  };

  const handleToggle = async () => {
    try {
      if (!engineRef.current) {
        const created = createEngine();
        if (!created) return;
        engineRef.current = created;
      }

      const { ctx, masterGain } = engineRef.current;
      const now = ctx.currentTime;

      if (isPlaying) {
        masterGain.gain.cancelScheduledValues(now);
        masterGain.gain.setValueAtTime(Math.max(masterGain.gain.value, 0.0001), now);
        masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
        window.setTimeout(() => {
          if (engineRef.current && engineRef.current.ctx === ctx && ctx.state === 'running') {
            void ctx.suspend();
          }
        }, 300);
        setIsPlaying(false);
      } else {
        if (ctx.state === 'suspended') {
          await ctx.resume();
        }
        masterGain.gain.cancelScheduledValues(now);
        masterGain.gain.setValueAtTime(0.0001, now);
        masterGain.gain.exponentialRampToValueAtTime(TARGET_GAIN, now + 0.45);
        setIsPlaying(true);
      }
    } catch {
      setIsPlaying(false);
    }
  };

  return (
    <motion.button
      type="button"
      onClick={handleToggle}
      aria-pressed={isPlaying}
      aria-label={
        isPlaying
          ? 'Mute ambient digital white noise soundscape'
          : 'Play subtle ambient digital white noise soundscape'
      }
      whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-[11px] transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a100ff] whitespace-nowrap shrink-0 ${
        isPlaying
          ? 'bg-[var(--mq-surface)] border-[#a100ff]/60 text-[var(--mq-text)]'
          : 'bg-[var(--mq-surface-inset)] border-[var(--mq-border)] text-[var(--mq-muted)] hover:text-[var(--mq-text)] hover:border-[var(--mq-border-strong)]'
      }`}
    >
      {isPlaying ? (
        <Volume2 className="w-3.5 h-3.5 text-[var(--mq-accent-soft)]" aria-hidden="true" />
      ) : (
        <VolumeX className="w-3.5 h-3.5 text-[var(--mq-muted)]" aria-hidden="true" />
      )}
      <span>Ambient: {isPlaying ? 'On' : 'Off'}</span>
      <span className="inline-flex items-end gap-[2px] h-2.5" aria-hidden="true">
        {[0, 1, 2].map((bar) => (
          <motion.span
            key={bar}
            animate={
              isPlaying && !shouldReduceMotion
                ? {
                    scaleY: [0.35, 1, 0.45, 0.85, 0.35],
                  }
                : { scaleY: isPlaying ? 0.75 : 0.3 }
            }
            transition={
              isPlaying && !shouldReduceMotion
                ? {
                    duration: 1.15 + bar * 0.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: bar * 0.14,
                  }
                : { duration: 0.2 }
            }
            className={`w-[2px] h-full origin-bottom rounded-full ${
              isPlaying ? 'bg-[var(--mq-accent-soft)]' : 'bg-[var(--mq-border-strong)]'
            }`}
          />
        ))}
      </span>
    </motion.button>
  );
}
