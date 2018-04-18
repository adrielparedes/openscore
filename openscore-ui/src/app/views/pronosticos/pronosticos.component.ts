import { GruposService } from './../../services/grupos.service';
import { Pronostico } from './../../model/pronostico';
import { PronosticoService } from './../../services/pronostico.service';
import { PartidosService } from './../../services/partidos.service';
import { Grupo } from './../../model/grupo';
import { Partido } from './../../model/partido';
import { Component, OnInit } from '@angular/core';
import { ApiResponse } from '../../model/api-response';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-pronosticos',
  templateUrl: './pronosticos.component.html',
  styleUrls: ['./pronosticos.component.scss']
})
export class PronosticosComponent implements OnInit {


  formato: Formato = Formato.HOY;
  partidos: Partido[] = [];
  grupos: Grupo[] = [];
  today: Date = new Date(Date.now());
  fechas: Date[] = [new Date('2018-06-14T00:00:00'), new Date('2018-06-15T00:00:00')];


  constructor(private partidosService: PronosticoService,
    private gruposService: GruposService,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.update();
  }

  update() {
    this.spinner.show();
    this.gruposService.getAll(0, 0).subscribe(res => {
      this.spinner.show();
      this.grupos = res.data;
    });
    this.retrievePartidosPorFecha(this.today);

  }

  retrievePartidosPorGrupo(grupo: string) {
    this.partidosService.getAll(0, 0, [{ key: 'grupo', value: grupo }]).subscribe(res => {
      this.partidos = res.data;
      this.spinner.hide();
    });
  }

  retrievePartidosPorFecha(fecha: Date) {
    const date = this.buildDate(fecha);
    this.partidosService.getAll(0, 0, [{ key: 'fecha', value: date }]).subscribe(res => {
      this.partidos = res.data;
      this.spinner.hide();
    });
  }

  hoy() {
    this.formato = Formato.HOY
    this.retrievePartidosPorFecha(this.today);
  }

  grupo() {
    this.formato = Formato.GRUPO
    this.retrievePartidosPorGrupo(this.grupos[0].codigo);
  }

  fecha() {
    this.formato = Formato.FECHA
    this.retrievePartidosPorFecha(this.fechas[0]);
  }

  isHoy() {
    return this.formato === Formato.HOY;
  }

  isGrupo() {
    return this.formato === Formato.GRUPO;
  }

  isFecha() {
    return this.formato === Formato.FECHA;
  }

  buildDate(fecha: Date) {
    return fecha.getFullYear().toString() + this.completeMonth((fecha.getMonth() + 1).toString()) + fecha.getDate().toString();
  }

  completeMonth(month: string) {
    if (month.length === 1) {
      return '0' + month;
    } else {
      return month;
    }
  }

}

export enum Formato {
  HOY, GRUPO, FECHA
}