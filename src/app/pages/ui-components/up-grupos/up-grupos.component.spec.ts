import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpGruposComponent } from './up-grupos.component';

describe('UpGruposComponent', () => {
  let component: UpGruposComponent;
  let fixture: ComponentFixture<UpGruposComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpGruposComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpGruposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
