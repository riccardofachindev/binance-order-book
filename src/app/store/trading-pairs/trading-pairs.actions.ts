import { createAction, props } from '@ngrx/store';

/**
 * Actions related to the trading pairs feature
 */

export const loadTradingPairs = createAction(
  '[Trading Pairs] Load Trading Pairs'
);

export const loadTradingPairsSuccess = createAction(
  '[Trading Pairs] Load Trading Pairs Success',
  props<{ pairs: string[]}>()
);

export const loadTradingPairsFailure = createAction(
  '[Trading Pairs] Load Trading Pairs Failure',
  props<{ error: string }>()
);
