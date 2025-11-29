export enum ClockTheme {
  MINIMAL = 'MINIMAL',
  NEON_CYBER = 'NEON_CYBER',
  RETRO_TERMINAL = 'RETRO_TERMINAL',
  ELEGANT_SERIF = 'ELEGANT_SERIF',
  ANALOG_CLASSIC = 'ANALOG_CLASSIC',
  HUGE_BOLD = 'HUGE_BOLD',
}

export interface QuoteData {
  text: string;
  author: string;
}

export interface ClockState {
  date: Date;
  isFullScreen: boolean;
  showControls: boolean;
  theme: ClockTheme;
  showSeconds: boolean;
  showDate: boolean;
  showQuote: boolean;
}