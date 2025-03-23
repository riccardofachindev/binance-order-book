import { ChangeDetectionStrategy, Component, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { TradingService } from '../../services/trading-service.service';

@Component({
  selector: 'sl-pair-selector',
  standalone: true,
  imports: [],
  templateUrl: './pair-selector.component.html',
  styleUrls: ['./pair-selector.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PairSelectorComponent implements OnInit {
  private tradingService = inject(TradingService);

  // Create the list of trading pairs, initializing is at an empty array
  tradingPairs = toSignal(this.tradingService.fetchTradingPairs(), { initialValue: [] });

  // Currently selected pair
  selectedPair = signal<string>('');

  // Emit an event when a new pair is selected
  @Output() addPair = new EventEmitter<string>();

  ngOnInit(): void {
  }

  onPairSelected(pair: string): void {
    this.selectedPair.set(pair);
  }
}
