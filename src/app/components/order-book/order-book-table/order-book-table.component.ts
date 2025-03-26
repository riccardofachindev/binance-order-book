import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'sl-order-book-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-book-table.component.html',
  styleUrls: ['./order-book-table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderBookTableComponent {
  @Input() topBids: [string, string][] | null = null;
  @Input() topAsks: [string, string][] | null = null;
}
