import { ChangeDetectionStrategy, Component, ComponentRef, inject, signal, ViewContainerRef } from '@angular/core';

import { OrderBookComponent } from './components/order-book/order-book.component';
import { PairSelectorComponent } from './components/pair-selector/pair-selector.component';

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
export class BinanceOrderBookAppComponent {
  // Use ViewContainerRef to load components dynamically
  private viewContainerRef = inject(ViewContainerRef);

  // Array of references to the dynamically created OrderBook components
  orderBookComponents = signal<ComponentRef<OrderBookComponent>[]>([]);

  // List of currently displayed symbols
  activeSymbols = signal<Set<string>>(new Set());

  addOrderBook(symbol: string): void {
    if (symbol && !this.activeSymbols().has(symbol)) {
      this.activeSymbols.update(currentSet => new Set(currentSet).add(symbol));

      // Create a new instance of OrderBook dynamically
      const componentRef = this.viewContainerRef.createComponent(OrderBookComponent);
      componentRef.instance.symbol = symbol;
      componentRef.instance.removeOrderBook.subscribe((symbolToRemove: string) => {
        this.removeOrderBook(symbolToRemove, componentRef);
      });

      this.orderBookComponents.update(components => [...components, componentRef]);
    } else if (this.activeSymbols().has(symbol)) {
      alert(`Order book for ${symbol} is already open.`);
    }
  }

  removeOrderBook(symbolToRemove: string, componentRefToRemove: ComponentRef<OrderBookComponent>): void {
    // Update active symbols by removing the specified symbol
    this.activeSymbols.update(currentSet => {
      const newSet = new Set(currentSet);
      newSet.delete(symbolToRemove);

      return newSet;
    });

    // Update OrderBook references by removing the specified component
    this.orderBookComponents.update(components =>
      components.filter(ref => ref !== componentRefToRemove)
    );

    componentRefToRemove.destroy();
  }
}
