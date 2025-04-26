import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpModulosComponent } from './up-modulos.component';

describe('UpModulosComponent', () => {
  let component: UpModulosComponent;
  let fixture: ComponentFixture<UpModulosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpModulosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpModulosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
