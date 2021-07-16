import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistenzaPage } from './assistenza.page';

describe('AssistenzaPage', () => {
  let component: AssistenzaPage;
  let fixture: ComponentFixture<AssistenzaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssistenzaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistenzaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
