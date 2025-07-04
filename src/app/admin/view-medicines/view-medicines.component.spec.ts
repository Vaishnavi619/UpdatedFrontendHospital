import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMedicinesComponent } from './view-medicines.component';

describe('ViewMedicinesComponent', () => {
  let component: ViewMedicinesComponent;
  let fixture: ComponentFixture<ViewMedicinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewMedicinesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewMedicinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
