import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSistemasacademicosComponent } from './add-sistemasacademicos.component';

describe('AddSistemasacademicosComponent', () => {
  let component: AddSistemasacademicosComponent;
  let fixture: ComponentFixture<AddSistemasacademicosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSistemasacademicosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddSistemasacademicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
