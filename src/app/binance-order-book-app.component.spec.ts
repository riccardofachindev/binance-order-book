import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { Subject } from 'rxjs';
import { ViewContainerRef, Component, Input, Output, EventEmitter } from '@angular/core';
import { By } from '@angular/platform-browser';

import { BinanceOrderBookAppComponent } from './binance-order-book-app.component';
import * as OrderBookActions from './store/order-book/order-book.actions';
import * as OrderBookSelectors from './store/order-book/order-book.selectors';

// Mock OrderBookContainerComponent
@Component({
  selector: 'sl-order-book-container',
  standalone: true,
  template: '<div>Order Book: {{ symbol }}</div>',
})
class MockOrderBookContainerComponent {
  @Input() symbol!: string;
  @Output() removeOrderBook = new EventEmitter<string>();
}

// Mock PairSelectorContainerComponent
@Component({
  selector: 'sl-pair-selector-container',
  standalone: true,
  template: '<div>Pair Selector</div>',
})
class MockPairSelectorContainerComponent {
}

describe('BinanceOrderBookAppComponent', () => {
  let component: BinanceOrderBookAppComponent;
  let fixture: ComponentFixture<BinanceOrderBookAppComponent>;
  let store: Store;
  let dispatchSpy: jasmine.Spy;
  let viewContainerRef: ViewContainerRef;

  const activeSymbolsSubject = new Subject<string[]>();
  const mockActiveSymbols$ = activeSymbolsSubject.asObservable();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BinanceOrderBookAppComponent,
        MockPairSelectorContainerComponent,
        MockOrderBookContainerComponent
      ],
      providers: [
        provideMockStore({
          selectors: [
            { selector: OrderBookSelectors.selectActiveSymbols, value: mockActiveSymbols$ },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BinanceOrderBookAppComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    dispatchSpy = spyOn(store, 'dispatch');
    viewContainerRef = component.orderBookContainer;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should complete destroy$ on ngOnDestroy', () => {
    spyOn(component['destroy$'], 'next');
    spyOn(component['destroy$'], 'complete');
    component.ngOnDestroy();
    expect(component['destroy$'].next).toHaveBeenCalled();
    expect(component['destroy$'].complete).toHaveBeenCalled();
  });

  it('should dispatch removeOrderBook action and set/clear confirmation message', fakeAsync(() => {
    const symbolToRemove = 'BTCUSDT';
    component.removeOrderBook(symbolToRemove);
    expect(dispatchSpy).toHaveBeenCalledWith(OrderBookActions.removeOrderBook({ symbol: symbolToRemove }));
    expect(component.removeConfirmationMessage()).toBe(`Pair "${symbolToRemove}" removed.`);
    tick(3000);
    expect(component.removeConfirmationMessage()).toBeNull();
  }));

  it('should render the remove confirmation message when it has a value', () => {
    component.removeConfirmationMessage.set('Pair removed successfully.');
    fixture.detectChanges();
    const confirmationMessage = fixture.debugElement.query(By.css('.confirmation-message.delete'));
    expect(confirmationMessage).toBeTruthy();
    expect(confirmationMessage?.nativeElement.textContent).toContain('Pair removed successfully.');
  });

  it('should not render the remove confirmation message when it is null', () => {
    component.removeConfirmationMessage.set(null);
    fixture.detectChanges();
    const confirmationMessage = fixture.debugElement.query(By.css('.confirmation-message.delete'));
    expect(confirmationMessage).toBeFalsy();
  });
});
