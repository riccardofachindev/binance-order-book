import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';

import { ExchangeInfo } from '../shared/exchange-info';

@Injectable({
  providedIn: 'root',
})
export class TradingService {
  private http = inject(HttpClient);
  private binanceApiUrl = 'https://api.binance.com/api/v3/exchangeInfo';

  fetchTradingPairs(): Observable<string[]> {
    return this.http.get<ExchangeInfo>(`${this.binanceApiUrl}`).pipe(
      map((data) =>
        data.symbols.filter(
          (symbol) => symbol.isSpotTradingAllowed && (symbol.quoteAsset === 'USDT' || symbol.quoteAsset === 'USD')
        ).map((symbol) => symbol.symbol)
      ),
      catchError((error) => {
        return throwError(() => new Error(error.message ?? 'Failed to fetch trading pairs.'));
      })
    );
  }
}
