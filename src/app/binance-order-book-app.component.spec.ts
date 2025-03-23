import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BinanceOrderBookAppComponent } from './binance-order-book-app.component';

describe('BinanceOrderBookAppComponent', () => {
  let component: BinanceOrderBookAppComponent;
  let fixture: ComponentFixture<BinanceOrderBookAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BinanceOrderBookAppComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BinanceOrderBookAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
