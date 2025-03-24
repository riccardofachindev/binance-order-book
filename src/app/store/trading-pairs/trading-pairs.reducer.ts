import { createReducer, on } from '@ngrx/store';

import { initialState } from './trading-pairs.state';
import * as TradingPairsActions from './trading-pairs.actions';

/**
 * Reducer for the trading pairs feature
 * It takes the current state and an action, and returns an updated state depending on the action
 */

export const tradingPairsReducer = createReducer(
  initialState,
  on(TradingPairsActions.loadTradingPairs, (state) => ({ ...state, loading: true, error: null })),
  on(TradingPairsActions.loadTradingPairsSuccess, (state, { pairs }) => ({
    ...state,
    pairs,
    loading: false,
    error: null
  })),
  on(TradingPairsActions.loadTradingPairsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
