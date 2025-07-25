import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SightingFormComponent } from './sighting-form.component';

describe('SightingFormComponent', () => {
  let component: SightingFormComponent;
  let fixture: ComponentFixture<SightingFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SightingFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SightingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
