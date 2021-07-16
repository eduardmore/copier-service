import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NostriserviziPage } from './nostriservizi.page';

describe('NostriserviziPage', () => {
  let component: NostriserviziPage;
  let fixture: ComponentFixture<NostriserviziPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NostriserviziPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NostriserviziPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
