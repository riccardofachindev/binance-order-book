import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderBookTableComponent } from '../order-book-table/order-book-table.component';

@Component({
  selector: 'sl-order-book-content',
  standalone: true,
  imports: [CommonModule, OrderBookTableComponent],
  templateUrl: './order-book-content.component.html',
  styleUrls: ['./order-book-content.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderBookContentComponent {
  @Input() symbol: string | null = '';
  @Input() isCollapsed: boolean | null = false;
  @Input() isLoading: boolean | null = false;
  @Input() hasError: boolean | null = false;
  @Input() topBids: [string, string][] | null = null;
  @Input() topAsks: [string, string][] | null = null;

  @Output() reconnectHandler = new EventEmitter<void>();
  @Output() removeHandler = new EventEmitter<string>();

  onReconnectClicked(): void {
    this.reconnectHandler.emit();
  }

  onRemoveClicked(): void {
    this.removeHandler.emit();
  }
}
