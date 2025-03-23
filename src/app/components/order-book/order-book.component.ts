import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output, signal } from '@angular/core';
import { WebSocketSubject } from 'rxjs/internal/observable/dom/WebSocketSubject';
import { Subject, Subscription, takeUntil, timer } from 'rxjs';

interface OrderBookData {
    bids: [string, string][];
    asks: [string, string][];
}

@Component({
    selector: 'sl-order-book',
    standalone: true,
    imports: [],
    templateUrl: './order-book.component.html',
    styleUrl: './order-book.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderBookComponent implements OnInit, OnDestroy {
    // Selected symbol for this OrderBook reference
    @Input() symbol!: string;

    // Emit an event when the OrderBook is removed
    @Output() removeOrderBook = new EventEmitter<string>();

    // Manage the websocket connection to Binance API
    private websocketSubject: WebSocketSubject<OrderBookData> | undefined;
    private orderBookSubscription: Subscription | undefined;
    private connectionTimeoutSubscription: Subscription | undefined;
    private readonly connectionTimeout = 5000;

    // Handle the destruction of subscriptions
    private readonly destroy$ = new Subject<void>();

    // To hold the top 5 bids
    topBids = signal<[string, string][]>([]);

    // To hold the top 5 asks
    topAsks = signal<[string, string][]>([]);

    isLoading = signal(false);
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

            const websocketUrl = `wss://stream.binance.com:9443/ws/${this.symbol.toLowerCase()}@depth5`;

            // Create websocket connection
            this.websocketSubject = new WebSocketSubject<OrderBookData>(websocketUrl);

            // Subscribe to stream to keep fetching data
            this.orderBookSubscription = this.websocketSubject
                .pipe(
                    // Unsubscribe when the component is destroyed
                    takeUntil(this.destroy$)
                )
                .subscribe({
                    // Handle incoming values
                    next: (data) => {
                        this.isLoading.set(false);
                        this.updateOrderBook(data);

                        this.connectionTimeoutSubscription?.unsubscribe();
                    },
                    // Handle errors
                    error: (error) => {
                        this.isLoading.set(false);
                        this.hasError.set(true);

                        console.error('WebSocket error:', error);

                        this.connectionTimeoutSubscription?.unsubscribe();
                    },
                    // Handle websocket closing
                    complete: () => {
                        this.isLoading.set(false);

                        console.log('WebSocket connection closed');

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

                        console.error('WebSocket connection timeout');

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
}
