import { TestBed } from '@angular/core/testing';

import { GetmenusService } from './getmenus.service';

describe('GetmenusService', () => {
  let service: GetmenusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetmenusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
