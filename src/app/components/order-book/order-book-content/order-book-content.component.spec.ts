import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { OrderBookContentComponent } from './order-book-content.component';

// Mock the OrderBookTableComponent
@Component({
  selector: 'sl-order-book-table-mock',
  standalone: true,
  template: '<div>Order Book Table</div>',
})
class MockOrderBookTableComponent {
  @Input() topBids: [string, string] | null = null;
  @Input() topAsks: [string, string] | null = null;
}

describe('OrderBookContentComponent', () => {
  let component: OrderBookContentComponent;
  let fixture: ComponentFixture<OrderBookContentComponent>;
  let debugElement: DebugElement;

  const mockSymbol = 'BTCUSDT';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, OrderBookContentComponent],
      declarations: [],
      providers: [],
    })
      .overrideComponent(OrderBookContentComponent, {
        add: {
          imports: [MockOrderBookTableComponent],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(OrderBookContentComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    component.symbol = mockSymbol;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not display any content (except remove button) when isCollapsed is true', () => {
    component.isCollapsed = true;
    fixture.detectChanges();
    const loadingElement = debugElement.query(By.css('.loading-container'));
    const errorElement = debugElement.query(By.css('.error-message'));
    const orderBookTableElement = debugElement.query(By.directive(MockOrderBookTableComponent));
    expect(loadingElement).toBeFalsy();
    expect(errorElement).toBeFalsy();
    expect(orderBookTableElement).toBeFalsy();
    const removeButton = debugElement.query(By.css('footer button'));
    expect(removeButton).toBeTruthy();
  });

  it('should not display loading or error messages or table when isCollapsed is true', () => {
    component.isCollapsed = true;
    fixture.detectChanges();
    expect(debugElement.query(By.css('.loading-container'))).toBeFalsy();
    expect(debugElement.query(By.css('.error-message'))).toBeFalsy();
    expect(debugElement.query(By.directive(MockOrderBookTableComponent))).toBeFalsy();
  });
});
