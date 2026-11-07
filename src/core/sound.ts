import { read, write } from './store';

/** Square-wave blips from the Web Audio API: no files, off until the visitor turns it on. */
const KEY = 'nicco:snd';
let context: AudioContext | undefined;
let on = read(KEY) === 'on';

export const soundOn = () => on;

function note(frequency: number, duration: number, delay = 0, volume = 0.035) {
  if (!on) return;
  context ??= new AudioContext();
  if (context.state === 'suspended') void context.resume();

  const start = context.currentTime + delay;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = 'square';
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(volume, start);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.02);
}

export const sfx = {
  move: () => note(880, 0.03),
  open: () => {
    note(660, 0.06);
    note(990, 0.09, 0.06);
  },
  back: () => {
    note(520, 0.06);
    note(390, 0.09, 0.06);
  },
  toggle: () => note(1320, 0.04),
};

export function setSound(value: boolean) {
  on = value;
  write(KEY, value ? 'on' : 'off');
  window.dispatchEvent(new CustomEvent('soundchange'));
  sfx.toggle();
}
