import { createFeatureSelector, createSelector } from '@ngrx/store';

import { TradingPairsState } from './trading-pairs.state';

/**
 * Selectors for the trading pairs feature
 * They return values only when their inputs change, providing improved performance
 */

export const selectTradingPairsState = createFeatureSelector<TradingPairsState>('tradingPairs');

export const selectTradingPairs = createSelector(
  selectTradingPairsState,
  (state: TradingPairsState) => state.pairs
);

export const selectTradingPairsLoading = createSelector(
  selectTradingPairsState,
  (state: TradingPairsState) => state.loading
);

export const selectTradingPairsError = createSelector(
  selectTradingPairsState,
  (state: TradingPairsState) => state.error
);
