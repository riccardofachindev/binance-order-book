export interface TradingPairsState {
  pairs: string[];
  loading: boolean;
  error: string | null;
}

export const initialState: TradingPairsState = {
  pairs: [],
  loading: false,
  error: null
};
