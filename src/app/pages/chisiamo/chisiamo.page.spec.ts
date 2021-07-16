import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChisiamoPage } from './chisiamo.page';

describe('ChisiamoPage', () => {
  let component: ChisiamoPage;
  let fixture: ComponentFixture<ChisiamoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChisiamoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChisiamoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
