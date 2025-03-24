import { createReducer, on } from '@ngrx/store';

import { initialState } from './order-book.state';
import * as OrderBookActions from './order-book.actions';

/**
 * Reducer for the order book feature
 * It takes the current state and an action, and returns an updated state depending on the action
 */

export const orderBookReducer = createReducer(
  initialState,
  on(OrderBookActions.addOrderBook, (state, { symbol }) => ({
    ...state,
    activeSymbols: [...state.activeSymbols, symbol]
  })),
  on(OrderBookActions.removeOrderBook, (state, { symbol }) => ({
    ...state,
    activeSymbols: state.activeSymbols.filter(s => s !== symbol)
  }))
);
