import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientViewBillComponent } from './patient-view-bill.component';

describe('PatientViewBillComponent', () => {
  let component: PatientViewBillComponent;
  let fixture: ComponentFixture<PatientViewBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientViewBillComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientViewBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
