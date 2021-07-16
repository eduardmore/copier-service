import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreventiviPage } from './preventivi.page';

describe('PreventiviPage', () => {
  let component: PreventiviPage;
  let fixture: ComponentFixture<PreventiviPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreventiviPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreventiviPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
