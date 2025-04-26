import { TestBed } from '@angular/core/testing';

import { SistemasacademicosService } from './sistemasacademicos.service';

describe('SistemasacademicosService', () => {
  let service: SistemasacademicosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SistemasacademicosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
