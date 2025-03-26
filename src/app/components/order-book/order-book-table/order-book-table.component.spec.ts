import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { DebugElement } from '@angular/core';

import { OrderBookTableComponent } from './order-book-table.component';

describe('OrderBookTableComponent', () => {
  let component: OrderBookTableComponent;
  let fixture: ComponentFixture<OrderBookTableComponent>;
  let debugElement: DebugElement;

  const mockTopBids: [string, string][] = [
    ['10000.12345', '1.56789'],
    ['9999.98765', '0.12345'],
    ['9999.54321', '2.34567'],
  ];
  const mockTopAsks: [string, string][] = [
    ['10000.98765', '0.98765'],
    ['10001.12345', '1.23456'],
    ['10001.56789', '0.45678'],
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, OrderBookTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderBookTableComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the correct number of rows for bids and asks', () => {
    component.topBids = mockTopBids;
    component.topAsks = mockTopAsks;
    fixture.detectChanges();
    const rows = debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(mockTopBids.length);
  });

  it('should render no data rows when topBids and topAsks are null', () => {
    component.topBids = null;
    component.topAsks = null;
    fixture.detectChanges();
    const rows = debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(0);
  });

  it('should render no data rows when topBids and topAsks are empty arrays', () => {
    component.topBids = [];
    component.topAsks = [];
    fixture.detectChanges();
    const rows = debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(0);
  });

  it('should apply the number pipe with correct format', () => {
    component.topBids = [['123.456789', '987.654321']];
    component.topAsks = [['987.654321', '123.456789']];
    fixture.detectChanges();
    const bidPrice = debugElement.query(By.css('tbody tr td:nth-child(1)')).nativeElement.textContent;
    const bidQuantity = debugElement.query(By.css('tbody tr td:nth-child(2)')).nativeElement.textContent;
    const askPrice = debugElement.query(By.css('tbody tr td:nth-child(3)')).nativeElement.textContent;
    const askQuantity = debugElement.query(By.css('tbody tr td:nth-child(4)')).nativeElement.textContent;
    expect(bidPrice).toContain('123.4568');
    expect(bidQuantity).toContain('987.6543');
    expect(askPrice).toContain('987.6543');
    expect(askQuantity).toContain('123.4568');
  });
});
