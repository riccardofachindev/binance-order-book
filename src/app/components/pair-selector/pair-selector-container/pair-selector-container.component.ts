import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AsyncPipe, CommonModule } from '@angular/common';

import * as TradingPairsSelectors from '../../../store/trading-pairs/trading-pairs.selectors';
import * as TradingPairsActions from '../../../store/trading-pairs/trading-pairs.actions';
import * as OrderBookActions from '../../../store/order-book/order-book.actions';
import * as OrderBookSelectors from '../../../store/order-book/order-book.selectors';
import { TradingPairsLoadState } from '../../../shared/trading-pairs-load-state';
import { PairSelectorDropdownComponent } from '../pair-selector-dropdown/pair-selector-dropdown.component';

@Component({
    selector: 'sl-pair-selector-container',
    standalone: true,
    imports: [
        AsyncPipe,
        CommonModule,
        PairSelectorDropdownComponent
    ],
    templateUrl: './pair-selector-container.component.html',
    styleUrls: ['./pair-selector-container.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PairSelectorContainerComponent implements OnInit {
    private store = inject(Store);

    activeSymbols$: Observable<string[]> = this.store.select(OrderBookSelectors.selectActiveSymbols);

    // Loading state of the available trading pairs
    tradingPairsState$!: Observable<TradingPairsLoadState>;

    selectedPair = signal<string>('');
    addConfirmationMessage = signal<string | null>(null);

    ngOnInit(): void {
        // Get trading pairs state from the store
        this.tradingPairsState$ = this.store.select(TradingPairsSelectors.selectTradingPairsState).pipe(
            map(state => {
                if (state.loading) {
                    return { kind: 'loading' };
                } else if (state.error) {
                    return { kind: 'error', error: state.error };
                } else if (state.pairs && state.pairs.length > 0) {
                    return { kind: 'success', pairs: state.pairs };
                } else {
                    return { kind: 'empty' };
                }
            })
        );

        // Dispatch action to load trading pairs when the component initializes
        this.store.dispatch(TradingPairsActions.loadTradingPairs());
    }

    onPairSelected(pair: string): void {
        this.selectedPair.set(pair);
    }

    addPairToStore(): void {
        if (this.selectedPair()) {
            const symbolToAdd = this.selectedPair();

            // Dispatch action to add the selected trading pair to the store
            this.store.dispatch(OrderBookActions.addOrderBook({ symbol: this.selectedPair() }));
            this.selectedPair.set('');

            this.addConfirmationMessage.set(`Pair "${symbolToAdd}" added.`);

            setTimeout(() => {
                this.addConfirmationMessage.set(null);
            }, 3000);
        }
    }
}
