import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent {

  clock: string;
  comienzo = new Date(2018, 5, 14);

  constructor() {
    this.clock = this.getRemainingDays();
    setInterval(() => {
      this.clock = this.getRemainingDays();
    }, 1000);

  }

  getRemainingDays() {
    const time = this.comienzo.getTime() - new Date().getTime();
    return (time / (1000 * 60 * 60 * 24)).toFixed();
  }



}
