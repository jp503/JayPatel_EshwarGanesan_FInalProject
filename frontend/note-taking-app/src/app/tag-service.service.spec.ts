import { TestBed } from '@angular/core/testing';

import { TagServiceService } from './tag-service.service';

describe('TagServiceService', () => {
  let service: TagServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TagServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
