import { TestBed } from '@angular/core/testing';

import { GestionesService } from './gestiones.service';

describe('GestionesService', () => {
  let service: GestionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
