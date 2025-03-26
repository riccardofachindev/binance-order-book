import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { PairSelectorDropdownComponent } from './pair-selector-dropdown.component';
import { TradingPairsLoadState } from '../../../shared/trading-pairs-load-state';

describe('PairSelectorDropdownComponent', () => {
  let component: PairSelectorDropdownComponent;
  let fixture: ComponentFixture<PairSelectorDropdownComponent>;
  let debugElement: DebugElement;

  const mockTradingPairsSuccess: TradingPairsLoadState = { kind: 'success', pairs: ['BTCUSDT', 'ETHUSDT', 'BNBUSDT'] };
  const mockActiveSymbols = ['BNBUSDT'];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, PairSelectorDropdownComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PairSelectorDropdownComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display initial loading message when tradingPairsState is null', () => {
    component.tradingPairsState = null;
    fixture.detectChanges();
    const initialLoadingElement = debugElement.query(By.css('.initial-loading-message'));
    expect(initialLoadingElement).toBeTruthy();
    expect(initialLoadingElement?.nativeElement.textContent).toContain('Loading pairs...');
  });

  describe('when tradingPairsState is success', () => {
    beforeEach(() => {
      component.tradingPairsState = mockTradingPairsSuccess;
      component.activeSymbols = mockActiveSymbols;
      fixture.detectChanges();
    });

    it('should disable the add button when no pair is selected', () => {
      component.selectedPair = null;
      fixture.detectChanges();
      const addButton = debugElement.query(By.css('button.pair-selector-button'));
      expect(addButton?.nativeElement.disabled).toBeTrue();
    });
  });
});
