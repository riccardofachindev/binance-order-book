import { ChangeDetectionStrategy, Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AsyncPipe, CommonModule } from '@angular/common';

import * as TradingPairsSelectors from '../../store/trading-pairs/trading-pairs.selectors';
import * as TradingPairsActions from '../../store/trading-pairs/trading-pairs.actions';
import * as OrderBookActions from '../../store/order-book/order-book.actions';
import * as OrderBookSelectors from '../../store/order-book/order-book.selectors';

// Different states while loading trading pairs
type TradingPairsLoadState =
  { kind: 'loading' }
  | { kind: 'success'; pairs: string[] }
  | { kind: 'error'; error: string }
  | { kind: 'empty' };

@Component({
  selector: 'sl-pair-selector',
  standalone: true,
  imports: [
    AsyncPipe,
    CommonModule
  ],
  templateUrl: './pair-selector.component.html',
  styleUrls: ['./pair-selector.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PairSelectorComponent implements OnInit {
  // Reference to the HTML select element
  @ViewChild('tradingPairSelect') tradingPairSelect!: ElementRef<HTMLSelectElement>;

  private store = inject(Store);

  // List of currently displayed order book symbols
  activeSymbols$: Observable<string[]> = this.store.select(OrderBookSelectors.selectActiveSymbols); // Select active symbols

  // Currently selected pair
  selectedPair = signal<string>('');

  // Loading state of the available trading pairs
  tradingPairsState$!: Observable<TradingPairsLoadState>;

  // Add a confirmation message after a pair is added
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

      // Reset the dropdown selection
      if (this.tradingPairSelect) {
        this.tradingPairSelect.nativeElement.value = '';
      }

      this.addConfirmationMessage.set(`Pair "${symbolToAdd}" added.`);

      setTimeout(() => {
        this.addConfirmationMessage.set(null);
      }, 3000);
    }
  }
}
