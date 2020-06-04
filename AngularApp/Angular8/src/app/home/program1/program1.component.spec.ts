import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Program1Component } from './program1.component';

describe('Program1Component', () => {
  let component: Program1Component;
  let fixture: ComponentFixture<Program1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Program1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Program1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
