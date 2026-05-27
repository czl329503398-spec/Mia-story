/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Synthesise cute cartoon sound effects for children
export const playSound = (type: 'chirp' | 'chime' | 'pop' | 'success' | 'morning') => {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    if (type === 'chirp') {
      // Little bird morning sound
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.frequency.setValueAtTime(1500, now);
      osc.frequency.exponentialRampToValueAtTime(3000, now + 0.1);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.start(now);
      osc.stop(now + 0.16);
    } else if (type === 'pop') {
      // Tap selection pop
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.08);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === 'chime') {
      // Magic fairy chime
      const freqs = [880, 1046, 1318, 1568];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.setValueAtTime(freq, now + idx * 0.05);
        gain.gain.setValueAtTime(0, now + idx * 0.05);
        gain.gain.linearRampToValueAtTime(0.06, now + idx * 0.05 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.25);

        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.3);
      });
    } else if (type === 'success') {
      // Game success chime (A major triad)
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        gain.gain.setValueAtTime(0, now + idx * 0.06);
        gain.gain.linearRampToValueAtTime(0.08, now + idx * 0.06 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.35);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.4);
      });
    } else if (type === 'morning') {
      // Gentle waking morning chord (C Maj9 chord)
      const chord = [261.63, 329.63, 392.00, 493.88, 523.25]; // C4, E4, G4, B4, C5
      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.05, now + idx * 0.08 + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 1.2);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 1.4);
      });
    }
  } catch (err) {
    console.warn('Web Audio synthesis not allowed yet or failed', err);
  }
};

interface SpeakOptions {
  pitch?: number;
  rate?: number;
  onStart?: () => void;
  onEnd?: () => void;
  lang: 'en' | 'zh';
}

export const speakText = (text: string, options: SpeakOptions) => {
  if (!('speechSynthesis' in window)) {
    console.warn('SpeechSynthesis API not supported in this browser.');
    options.onEnd?.();
    return;
  }

  // Cancel any ongoing speeches
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.pitch = options.pitch ?? (options.lang === 'en' ? 1.45 : 1.05); // higher pitch for child voice, normal for mom
  utterance.rate = options.rate ?? (options.lang === 'en' ? 0.72 : 0.95); // children slower for EN, natural for ZH to avoid robotic dragging
  utterance.lang = options.lang === 'en' ? 'en-US' : 'zh-CN';

  // Attempt to select the most matching voice
  const findVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    const cleanVoices = voices.filter(v => v.lang);
    
    if (options.lang === 'en') {
      // Find clean English kid/female voices
      const targetName = ['google us english', 'samantha', 'zira', 'karen', 'moira'];
      for (const t of targetName) {
        const found = cleanVoices.find(v => v.name.toLowerCase().includes(t) && v.lang.startsWith('en'));
        if (found) return found;
      }
      return cleanVoices.find(v => v.lang.startsWith('en'));
    } else {
      // Find warm gentle Chinese female narrator voices
      const targetName = ['tingting', '婷婷', 'huihui', 'yahei', 'xiaoxiao', 'lulu', 'sinji', 'kexin', 'shan'];
      for (const t of targetName) {
        const found = cleanVoices.find(v => v.name.toLowerCase().includes(t) && v.lang.toLowerCase().startsWith('zh'));
        if (found) return found;
      }
      // Or general google chinese voice
      const googleZh = cleanVoices.find(v => v.name.includes('Google') && v.lang.toLowerCase().startsWith('zh'));
      if (googleZh) return googleZh;

      return cleanVoices.find(v => v.lang.toLowerCase().startsWith('zh'));
    }
  };

  const selectedVoice = findVoice();
  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }

  utterance.onstart = () => {
    options.onStart?.();
  };

  utterance.onend = () => {
    options.onEnd?.();
  };

  utterance.onerror = (e) => {
    console.warn('Utterance playback error:', e);
    options.onEnd?.();
  };

  window.speechSynthesis.speak(utterance);
};

export const cancelSpeech = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};
