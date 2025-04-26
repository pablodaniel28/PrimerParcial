import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGruposComponent } from './add-grupos.component';

describe('AddGruposComponent', () => {
  let component: AddGruposComponent;
  let fixture: ComponentFixture<AddGruposComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddGruposComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddGruposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
