import { TestBed } from '@angular/core/testing';

import { JabiyaService } from './jabiya.service';

describe('JabiyaService', () => {
  let service: JabiyaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JabiyaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
