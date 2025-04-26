import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpCarrerasComponent } from './up-carreras.component';

describe('UpCarrerasComponent', () => {
  let component: UpCarrerasComponent;
  let fixture: ComponentFixture<UpCarrerasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpCarrerasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpCarrerasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
