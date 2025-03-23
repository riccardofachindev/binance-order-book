import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PairSelectorComponent } from './pair-selector.component';

describe('PairSelectorComponent', () => {
  let component: PairSelectorComponent;
  let fixture: ComponentFixture<PairSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PairSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PairSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
