/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PartidosListComponent } from './partidos-list.component';

describe('PartidosListComponent', () => {
  let component: PartidosListComponent;
  let fixture: ComponentFixture<PartidosListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartidosListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartidosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
