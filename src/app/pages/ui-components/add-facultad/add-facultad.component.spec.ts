import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFacultadComponent } from './add-facultad.component';

describe('AddFacultadComponent', () => {
  let component: AddFacultadComponent;
  let fixture: ComponentFixture<AddFacultadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddFacultadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddFacultadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
