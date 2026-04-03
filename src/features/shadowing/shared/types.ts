export interface YTPlayer {
  playVideo(): void;
  pauseVideo(): void;
  setPlaybackRate(rate: number): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  getCurrentTime(): number;
  getDuration(): number;
  getPlayerState(): number;
}

export type SpeakingReview = {
  original_transcript: string;
  corrected_version: string;
  explanation: string;
  better_alternatives: string[];
  score?: number;
};

export type ShadowTurn = {
  id: string;
  text: string;
  sentenceIdx?: number;
  feedback: string | null;
  review: SpeakingReview | null;
  audioUrl?: string;
  timestamp: number;
};

export type Sentence = {
  text: string;
  startMs: number;
  endMs: number;
  viText?: string;
};

export type TTSProvider = "edge" | "google";

export interface TTSSettings {
  provider: TTSProvider;
  accent: string;
  speed: number;
}

/** Options for initializing a shadowing hook from a persisted session */
export interface SessionOpts {
  sessionId?: number;
  initialVideoId?: string;
  initialScriptText?: string;
  initialSentences?: Sentence[];
  initialActiveSentenceIdx?: number;
  onSentencesChange?: (sentences: Sentence[]) => void;
  onActiveSentenceChange?: (idx: number) => void;
  onVideoChange?: (videoId: string) => void;
  onScriptTextChange?: (scriptText: string) => void;
}
