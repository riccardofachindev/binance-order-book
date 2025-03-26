import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output, signal } from '@angular/core';
import { WebSocketSubject } from 'rxjs/internal/observable/dom/WebSocketSubject';
import { Subject, Subscription, takeUntil, timer } from 'rxjs';

import { OrderBookContentComponent } from '../order-book-content/order-book-content.component';

interface OrderBookData {
  bids: [string, string][];
  asks: [string, string][];
}

@Component({
  selector: 'sl-order-book-container',
  standalone: true,
  imports: [
    OrderBookContentComponent
  ],
  templateUrl: './order-book-container.component.html',
  styleUrl: './order-book-container.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderBookContainerComponent implements OnInit, OnDestroy {
  @Input() symbol!: string;

  @Output() removeOrderBook = new EventEmitter<string>();

  // Manage the websocket connection to Binance API
  private websocketSubject: WebSocketSubject<OrderBookData> | undefined;
  private orderBookSubscription: Subscription | undefined;
  private connectionTimeoutSubscription: Subscription | undefined;
  private readonly connectionTimeout = 5000;
  private readonly wsUrl = 'wss://stream.binance.com:9443/ws';

  // Signal the completion of observables to prevent memory leaks
  private readonly destroy$ = new Subject<void>();

  topBids = signal<[string, string][]>([]);
  topAsks = signal<[string, string][]>([]);

  isLoading = signal(false);
  isCollapsed = signal(false);
  hasError = signal(false);

  ngOnInit(): void {
    this.connectWebSocket();
  }

  ngOnDestroy(): void {
    this.disconnectWebSocket();
    this.destroy$.next();
    this.destroy$.complete();
  }

  connectWebSocket(): void {
    if (this.symbol) {
      this.isLoading.set(true);
      this.hasError.set(false);

      const websocketUrl = `${this.wsUrl}/${this.symbol.toLowerCase()}@depth5`;

      // Create websocket connection
      this.websocketSubject = new WebSocketSubject<OrderBookData>(websocketUrl);

      // Subscribe to stream to keep fetching data
      this.orderBookSubscription = this.websocketSubject
        .pipe(
          // Unsubscribe when the component is destroyed
          takeUntil(this.destroy$)
        )
        .subscribe({
          next: (data) => {
            this.isLoading.set(false);
            this.updateOrderBook(data);

            this.connectionTimeoutSubscription?.unsubscribe();
          },
          error: (error) => {
            this.isLoading.set(false);
            this.hasError.set(true);
            this.connectionTimeoutSubscription?.unsubscribe();
          },
          complete: () => {
            this.isLoading.set(false);
            this.connectionTimeoutSubscription?.unsubscribe();
          }
        });

      // Timeout in case the connection doesn't work
      this.connectionTimeoutSubscription = timer(this.connectionTimeout)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          if (this.isLoading()) {
            this.isLoading.set(false);
            this.hasError.set(true);
            this.disconnectWebSocket();
          }
        });
    }
  }

  disconnectWebSocket(): void {
    this.connectionTimeoutSubscription?.unsubscribe();
    this.orderBookSubscription?.unsubscribe();
    this.websocketSubject?.complete();
  }

  // Update bids and asks with the latest top 5 values
  updateOrderBook(data: OrderBookData): void {
    this.topBids.set(data.bids.slice(0, 5));
    this.topAsks.set(data.asks.slice(0, 5));
  }

  toggleCollapse(): void {
    this.isCollapsed.update(value => !value);
  }

  onReconnect(): void {
    this.connectWebSocket();
  }

  onRemove(): void {
    this.removeOrderBook.emit(this.symbol);
  }
}
