import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddModulosComponent } from './add-modulos.component';

describe('AddModulosComponent', () => {
  let component: AddModulosComponent;
  let fixture: ComponentFixture<AddModulosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddModulosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddModulosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
