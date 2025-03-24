import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { tradingPairsReducer } from './store/trading-pairs/trading-pairs.reducer';
import { orderBookReducer } from './store/order-book/order-book.reducer';
import { TradingPairsEffects } from './store/trading-pairs/trading-pairs.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideStore({
      orderBook: orderBookReducer,
      tradingPairs: tradingPairsReducer
    }),
    provideEffects([TradingPairsEffects])
  ]
};
