import { createFeatureSelector, createSelector } from '@ngrx/store';

import { OrderBookState } from './order-book.state';

/**
 * Selectors for the order book feature
 * They return values only when their inputs change, providing improved performance
 */

export const selectOrderBookState = createFeatureSelector<OrderBookState>('orderBook');

export const selectActiveSymbols = createSelector(
  selectOrderBookState,
  (state: OrderBookState) => state.activeSymbols
);
