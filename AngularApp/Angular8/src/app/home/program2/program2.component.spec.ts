import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Program2Component } from './program2.component';

describe('Program2Component', () => {
  let component: Program2Component;
  let fixture: ComponentFixture<Program2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Program2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Program2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
