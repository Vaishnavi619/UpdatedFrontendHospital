import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientViewPrescriptionComponent } from './patient-view-prescription.component';

describe('PatientViewPrescriptionComponent', () => {
  let component: PatientViewPrescriptionComponent;
  let fixture: ComponentFixture<PatientViewPrescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientViewPrescriptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientViewPrescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
