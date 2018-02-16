/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CompeticionesFormComponent } from './competiciones-form.component';

describe('CompeticionesFormComponent', () => {
  let component: CompeticionesFormComponent;
  let fixture: ComponentFixture<CompeticionesFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompeticionesFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompeticionesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
