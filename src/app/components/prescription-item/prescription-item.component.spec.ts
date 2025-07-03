import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescriptionItemComponent } from './prescription-item.component';

describe('PrescriptionItemComponent', () => {
  let component: PrescriptionItemComponent;
  let fixture: ComponentFixture<PrescriptionItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrescriptionItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrescriptionItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
