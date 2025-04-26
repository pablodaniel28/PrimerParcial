import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpAulasComponent } from './up-aulas.component';

describe('UpAulasComponent', () => {
  let component: UpAulasComponent;
  let fixture: ComponentFixture<UpAulasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpAulasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpAulasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
