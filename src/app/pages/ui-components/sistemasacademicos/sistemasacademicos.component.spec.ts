import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SistemasacademicosComponent } from './sistemasacademicos.component';

describe('SistemasacademicosComponent', () => {
  let component: SistemasacademicosComponent;
  let fixture: ComponentFixture<SistemasacademicosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SistemasacademicosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SistemasacademicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
