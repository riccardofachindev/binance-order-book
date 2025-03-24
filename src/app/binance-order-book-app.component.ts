import { ChangeDetectionStrategy, Component, ComponentRef, inject, ViewContainerRef, OnInit, OnDestroy, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';

import { OrderBookComponent } from './components/order-book/order-book.component';
import { PairSelectorComponent } from './components/pair-selector/pair-selector.component';
import * as OrderBookActions from './store/order-book/order-book.actions';
import * as OrderBookSelectors from './store/order-book/order-book.selectors';

@Component({
  selector: 'sl-binance-order-book-app',
  standalone: true,
  imports: [
    PairSelectorComponent
  ],
  templateUrl: './binance-order-book-app.component.html',
  styleUrls: ['./binance-order-book-app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BinanceOrderBookAppComponent implements OnInit, OnDestroy {
  // Use ViewContainerRef to load components dynamically
  private viewContainerRef = inject(ViewContainerRef);

  private store = inject(Store);

  // Signal the completion of observables to prevent memory leaks
  private readonly destroy$ = new Subject<void>();

  // Array of references to the dynamically created OrderBook components
  orderBookComponents: { [symbol: string]: ComponentRef<OrderBookComponent> } = {};

  removeConfirmationMessage = signal<string | null>(null);

  // Array of currently active trading pair symbols from the store
  activeSymbols$: Observable<string[]> = this.store.select(OrderBookSelectors.selectActiveSymbols);

  ngOnInit(): void {
    // Subscribe to changes in the active symbols and update the displayed order book components
    this.activeSymbols$.pipe(takeUntil(this.destroy$)).subscribe(symbols => {
      this.updateOrderBookComponents(symbols);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  removeOrderBook(symbolToRemove: string): void {
    // Remove an order book from the store for a given symbol
    this.store.dispatch(OrderBookActions.removeOrderBook({ symbol: symbolToRemove }));

    this.removeConfirmationMessage.set(`Pair "${symbolToRemove}" removed.`);
    setTimeout(() => {
      this.removeConfirmationMessage.set(null);
    }, 3000);
  }

  private updateOrderBookComponents(symbols: string[]): void {
    const currentSymbols = Object.keys(this.orderBookComponents);

    // Create a new instance of OrderBook dynamically
    symbols.forEach(symbol => {
      if (!this.orderBookComponents[symbol]) {
        const componentRef = this.viewContainerRef.createComponent(OrderBookComponent);
        componentRef.instance.symbol = symbol;
        componentRef.instance.removeOrderBook.pipe(takeUntil(this.destroy$)).subscribe((symbolToRemove: string) => {
          this.removeOrderBook(symbolToRemove);
        });
        this.orderBookComponents[symbol] = componentRef;
      }
    });

    // Update active symbols by removing the specified symbol
    currentSymbols.forEach(symbol => {
      if (!symbols.includes(symbol)) {
        this.orderBookComponents[symbol].destroy();
        delete this.orderBookComponents[symbol];
      }
    });
  }
}
