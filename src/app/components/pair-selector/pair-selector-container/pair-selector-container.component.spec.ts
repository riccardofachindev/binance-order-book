import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import * as TradingPairsActions from '../../../store/trading-pairs/trading-pairs.actions';
import * as OrderBookActions from '../../../store/order-book/order-book.actions';
import * as OrderBookSelectors from '../../../store/order-book/order-book.selectors';
import { PairSelectorContainerComponent } from './pair-selector-container.component';
import { PairSelectorDropdownComponent } from '../pair-selector-dropdown/pair-selector-dropdown.component';

describe('PairSelectorContainerComponent', () => {
  let component: PairSelectorContainerComponent;
  let fixture: ComponentFixture<PairSelectorContainerComponent>;
  let store: Store;
  let dispatchSpy: jasmine.Spy;
  let debugElement: DebugElement;

  const mockActiveSymbols = ['BNBUSDT'];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PairSelectorContainerComponent,
        PairSelectorDropdownComponent
      ],
      providers: [
        provideMockStore({
          selectors: [
            { selector: OrderBookSelectors.selectActiveSymbols, value: mockActiveSymbols },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PairSelectorContainerComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    dispatchSpy = spyOn(store, 'dispatch');
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadTradingPairs action on ngOnInit', () => {
    expect(dispatchSpy).toHaveBeenCalledWith(TradingPairsActions.loadTradingPairs());
  });

  it('should select activeSymbols from store', () => {
    let activeSymbols: string[] | undefined;
    component.activeSymbols$.subscribe(symbols => activeSymbols = symbols);
    expect(activeSymbols).toEqual(mockActiveSymbols);
  });

  it('should update selectedPair signal when onPairSelected is called', () => {
    const selected = 'ETHUSDT';
    component.onPairSelected(selected);
    expect(component.selectedPair()).toBe(selected);
  });

  it('should dispatch addOrderBook action and clear selectedPair and show confirmation message when addPairToStore is called', fakeAsync(() => {
    const selected = 'BTCUSDT';
    component.selectedPair.set(selected);
    component.addPairToStore();
    expect(dispatchSpy).toHaveBeenCalledWith(OrderBookActions.addOrderBook({ symbol: selected }));
    expect(component.selectedPair()).toBe('');
    expect(component.addConfirmationMessage()).toBe(`Pair "${selected}" added.`);

    tick(3000);
    expect(component.addConfirmationMessage()).toBeNull();
  }));

  it('should not dispatch addOrderBook action if no pair is selected', () => {
    component.addPairToStore();
    expect(dispatchSpy).not.toHaveBeenCalledWith(OrderBookActions.addOrderBook({ symbol: '' }));
  });

  it('should call onPairSelected when pairSelected event is emitted from PairSelectorDropdownComponent', () => {
    spyOn(component, 'onPairSelected');
    const dropdownComponent = debugElement.query(By.directive(PairSelectorDropdownComponent));
    const selectedPair = 'LTCUSDT';
    dropdownComponent.componentInstance.pairSelected.emit(selectedPair);
    expect(component.onPairSelected).toHaveBeenCalledWith(selectedPair);
  });

  it('should call addPairToStore when addPairClicked event is emitted from PairSelectorDropdownComponent', () => {
    spyOn(component, 'addPairToStore');
    const dropdownComponent = debugElement.query(By.directive(PairSelectorDropdownComponent));
    dropdownComponent.componentInstance.addPairClicked.emit();
    expect(component.addPairToStore).toHaveBeenCalled();
  });

  it('should render confirmation message when addConfirmationMessage has a value', () => {
    component.addConfirmationMessage.set('Test confirmation');
    fixture.detectChanges();
    const confirmationMessage = debugElement.query(By.css('.confirmation-message'));
    expect(confirmationMessage).toBeTruthy();
    expect(confirmationMessage?.nativeElement.textContent).toContain('Test confirmation');
  });

  it('should not render confirmation message when addConfirmationMessage is null', () => {
    component.addConfirmationMessage.set(null);
    fixture.detectChanges();
    const confirmationMessage = debugElement.query(By.css('.confirmation-message'));
    expect(confirmationMessage).toBeFalsy();
  });
});
