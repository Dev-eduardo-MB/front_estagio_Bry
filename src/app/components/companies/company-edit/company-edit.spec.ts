import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyEditComponent } from './company-edit';

describe('CompanyDetails', () => {
  let component: CompanyEditComponent;
  let fixture: ComponentFixture<CompanyEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyEditComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
