import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';

import { TradingService } from '../../services/trading-service.service';
import * as TradingPairsActions from './trading-pairs.actions';

/**
 * Effects for the trading pairs feature
 * They are used to dispatch new actions without directly modifying the state
 */

@Injectable()
export class TradingPairsEffects {
    private actions$ = inject(Actions);
    private tradingService = inject(TradingService);

    loadTradingPairs$ = createEffect(() =>
        this.actions$.pipe(
            ofType(TradingPairsActions.loadTradingPairs),
            switchMap(() =>
                this.tradingService.fetchTradingPairs().pipe(
                    map((pairs) => TradingPairsActions.loadTradingPairsSuccess({ pairs })),
                    catchError((error) => of(TradingPairsActions.loadTradingPairsFailure({ error: error.message || 'Failed to load trading pairs' })))
                )
            )
        )
    );
}
