import { createAction, props } from '@ngrx/store';

/**
 * Actions related to the order book feature
 */

export const addOrderBook = createAction(
  '[Order Book] Add Order Book',
  props<{ symbol: string }>()
);

export const removeOrderBook = createAction(
  '[Order Book] Remove Order Book',
  props<{ symbol: string }>()
);
