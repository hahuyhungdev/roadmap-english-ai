export const SHORTCUTS: [string, string][] = [
  ["Space", "Play / Pause video"],
  ["← →", "Seek ±5 seconds"],
  ["Shift + ←", "Prev sentence"],
  ["Shift + →", "Next sentence"],
  ["[", "Set loop point A"],
  ["]", "Set loop point B"],
  ["L", "Toggle A-B loop"],
  ["R", "Toggle recording"],
  ["?", "Show / hide shortcuts"],
  ["Esc", "Close shortcuts / settings"],
];

export const TTS_PROVIDERS = [
  { value: "edge", label: "Edge (Browser Native)" },
  { value: "google", label: "Google Cloud TTS" },
];

export const TTS_ACCENTS = {
  edge: [
    { value: "en-US", label: "English (US)" },
    { value: "en-GB", label: "English (UK)" },
    { value: "en-AU", label: "English (Australia)" },
    { value: "en-CA", label: "English (Canada)" },
    { value: "en-IN", label: "English (India)" },
    { value: "en-IE", label: "English (Ireland)" },
  ],
  google: [
    { value: "en-US-Neural2-F", label: "Female (Natural)" },
    { value: "en-US-Neural2-C", label: "Female (Friendly)" },
    { value: "en-US-Neural2-J", label: "Male (Professional)" },
    { value: "en-US-Neural2-A", label: "Male (Standard)" },
  ],
};

export const TTS_VOICES = [
  { value: "en-US-Neural2-F", label: "Female (Natural)" },
  { value: "en-US-Neural2-C", label: "Female (Friendly)" },
  { value: "en-US-Neural2-J", label: "Male (Professional)" },
  { value: "en-US-Neural2-A", label: "Male (Standard)" },
  { value: "edge-native", label: "Edge (Browser Native)" },
];

export const TTS_SPEEDS = [
  { value: 0.75, label: "0.75x — Slow" },
  { value: 0.9, label: "0.9x — Normal-" },
  { value: 1.0, label: "1.0x — Normal" },
  { value: 1.15, label: "1.15x — Fast" },
];
