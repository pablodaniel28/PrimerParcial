import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpSistemasacademicosComponent } from './up-sistemasacademicos.component';

describe('UpSistemasacademicosComponent', () => {
  let component: UpSistemasacademicosComponent;
  let fixture: ComponentFixture<UpSistemasacademicosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpSistemasacademicosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpSistemasacademicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
