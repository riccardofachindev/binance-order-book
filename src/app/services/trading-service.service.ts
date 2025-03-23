import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';

interface ExchangeInfo {
  symbols: SymbolInfo[];
}

interface SymbolInfo {
  symbol: string;
  status: string;
  isSpotTradingAllowed: boolean;
  quoteAsset: string;
}

@Injectable({
  providedIn: 'root',
})
export class TradingService {
  // Inject HttpClient service to make HTTP requests
  private http = inject(HttpClient);
  private binanceApiUrl = 'https://api.binance.com/api/v3';

  fetchTradingPairs(): Observable<string[]> {
    return this.http.get<ExchangeInfo>(`${this.binanceApiUrl}/exchangeInfo`).pipe(
      map((data) =>
        // Filter data by "isSpotTradingAllowed=true" and "quoteAsset === 'USDT'" or "quoteAsset === 'USD'"
        data.symbols.filter(
          (symbol) => symbol.isSpotTradingAllowed && (symbol.quoteAsset === 'USDT' || symbol.quoteAsset === 'USD')
        ).map((symbol) => symbol.symbol)
      ),
      catchError((error) => {
        console.error(`Failed to fetch trading pairs from Binance API:`, error);

        return throwError(() => new Error('Failed to fetch trading pairs'));
      })
    );
  }
}
