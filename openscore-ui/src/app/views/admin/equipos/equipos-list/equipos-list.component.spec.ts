/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EquiposListComponent } from './equipos-list.component';

describe('EquiposListComponent', () => {
  let component: EquiposListComponent;
  let fixture: ComponentFixture<EquiposListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EquiposListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquiposListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
