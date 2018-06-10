import { PronosticoService } from './../../services/pronostico.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent {

  today: Date = new Date(Date.now());
  clock: string;
  comienzo = new Date(2018, 5, 14);
  matches = 0;

  constructor(private pronosticoService: PronosticoService) {
    this.clock = this.getRemainingDays();
    setInterval(() => {
      this.clock = this.getRemainingDays();
    }, 1000);
    this.getTodayMatches();

  }

  getRemainingDays() {
    const time = this.comienzo.getTime() - new Date().getTime();
    return (time / (1000 * 60 * 60 * 24)).toFixed();
  }

  buildDate(fecha: Date) {
    return fecha.getFullYear().toString()
      + this.fillWithZeros((fecha.getMonth() + 1).toString())
      + this.fillWithZeros(fecha.getDate().toString());
  }

  fillWithZeros(date: string) {
    if (date.length === 1) {
      return '0' + date;
    } else {
      return date;
    }
  }

  getTodayMatches() {
    this.pronosticoService.getAll(0, 0, [{ key: 'dia', value: this.buildDate(this.today) }]).subscribe((res) => {
      this.matches = res.data.length;
    });
  }



}
