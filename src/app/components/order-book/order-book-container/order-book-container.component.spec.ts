import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderBookContainerComponent } from './order-book-container.component';
import { OrderBookContentComponent } from '../order-book-content/order-book-content.component';
import { Subject } from 'rxjs';
import { WebSocketSubject } from 'rxjs/internal/observable/dom/WebSocketSubject';
import { ChangeDetectionStrategy } from '@angular/core';
import { By } from '@angular/platform-browser';

// Mock the WebSocketSubject
class MockWebSocketSubject<T> extends Subject<T> {
  constructor() {
    super();
  }

  override complete() {
    super.complete();
  }

  override error(err: any) {
    super.error(err);
  }

  override next(value: T) {
    super.next(value);
  }
}

describe('OrderBookContainerComponent', () => {
  let component: OrderBookContainerComponent;
  let fixture: ComponentFixture<OrderBookContainerComponent>;
  let mockWebSocketSubject: MockWebSocketSubject<any>;

  const mockSymbol = 'BTCUSDT';

  beforeEach(async () => {
    mockWebSocketSubject = new MockWebSocketSubject<any>();

    await TestBed.configureTestingModule({
      imports: [OrderBookContainerComponent],
      providers: [
        { provide: WebSocketSubject, useValue: mockWebSocketSubject },
      ],
    })
      .overrideComponent(OrderBookContainerComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default }
      })
      .compileComponents();

    fixture = TestBed.createComponent(OrderBookContainerComponent);
    component = fixture.componentInstance;
    component.symbol = mockSymbol;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call connectWebSocket on ngOnInit', () => {
    spyOn(component, 'connectWebSocket');
    component.ngOnInit();
    expect(component.connectWebSocket).toHaveBeenCalled();
  });

  it('should set isLoading to true and hasError to false when connecting', () => {
    component.connectWebSocket();
    expect(component.isLoading()).toBeTrue();
    expect(component.hasError()).toBeFalse();
  });

  it('should unsubscribe from WebSocket and timer on ngOnDestroy', () => {
    spyOn(component as any, 'disconnectWebSocket');
    component.ngOnDestroy();
    expect(component['disconnectWebSocket']).toHaveBeenCalled();
  });

  it('should toggle isCollapsed signal', () => {
    expect(component.isCollapsed()).toBeFalse();
    component.toggleCollapse();
    expect(component.isCollapsed()).toBeTrue();
    component.toggleCollapse();
    expect(component.isCollapsed()).toBeFalse();
  });

  it('should emit removeOrderBook event with the symbol when onRemove is called', () => {
    spyOn(component.removeOrderBook, 'emit');
    component.onRemove();
    expect(component.removeOrderBook.emit).toHaveBeenCalledWith(mockSymbol);
  });

  it('should call connectWebSocket when onReconnect is called', () => {
    spyOn(component, 'connectWebSocket');
    component.onReconnect();
    expect(component.connectWebSocket).toHaveBeenCalled();
  });

  it('should pass correct data to OrderBookContent component', () => {
    component.isLoading.set(false);
    component.hasError.set(false);
    component.topBids.set([['1', '1']]);
    component.topAsks.set([['2', '2']]);
    component.isCollapsed.set(true);
    fixture.detectChanges();

    const orderBookContent = fixture.debugElement.query(By.directive(OrderBookContentComponent));
    expect(orderBookContent).toBeTruthy();
    expect(orderBookContent.componentInstance.symbol).toBe(mockSymbol);
    expect(orderBookContent.componentInstance.isLoading).toBe(component.isLoading());
    expect(orderBookContent.componentInstance.hasError).toBe(component.hasError());
    expect(orderBookContent.componentInstance.topBids).toEqual(component.topBids());
    expect(orderBookContent.componentInstance.topAsks).toEqual(component.topAsks());
    expect(orderBookContent.componentInstance.isCollapsed).toBe(component.isCollapsed());
  });

  it('should call onReconnect when reconnectHandler is emitted from OrderBookContent', () => {
    spyOn(component, 'onReconnect');
    fixture.detectChanges();
    const orderBookContent = fixture.debugElement.query(By.directive(OrderBookContentComponent));
    orderBookContent.componentInstance.reconnectHandler.emit();
    expect(component.onReconnect).toHaveBeenCalled();
  });

  it('should call onRemove when removeHandler is emitted from OrderBookContent', () => {
    spyOn(component, 'onRemove');
    fixture.detectChanges();
    const orderBookContent = fixture.debugElement.query(By.directive(OrderBookContentComponent));
    orderBookContent.componentInstance.removeHandler.emit();
    expect(component.onRemove).toHaveBeenCalled();
  });
});
