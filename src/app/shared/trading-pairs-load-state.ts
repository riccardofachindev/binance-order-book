export type TradingPairsLoadState =
  { kind: 'loading' }
  | { kind: 'success'; pairs: string[] }
  | { kind: 'error'; error: string }
  | { kind: 'empty' };
