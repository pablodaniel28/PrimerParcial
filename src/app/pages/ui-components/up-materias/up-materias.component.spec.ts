import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpMateriasComponent } from './up-materias.component';

describe('UpMateriasComponent', () => {
  let component: UpMateriasComponent;
  let fixture: ComponentFixture<UpMateriasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpMateriasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpMateriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
