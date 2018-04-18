import { FaseService } from './../../services/fase.service';
import { Fase } from './../../model/fase';
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
  fases: Fase[] = [];
  today: Date = new Date(Date.now());
  fechas: number[] = [];


  constructor(private pronosticoService: PronosticoService,
    private partidosService: PartidosService,
    private gruposService: GruposService,
    private fasesService: FaseService,
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
    this.partidosService.getFechas().subscribe(res => {
      this.fechas = res.data;
    });
    this.fasesService.getAll(0, 0).subscribe(res => {
      this.fases = res.data;
    });

    this.retrievePartidosPorDia(this.today);

  }

  retrievePartidosPorGrupo(grupo: string) {
    this.pronosticoService.getAll(0, 0, [{ key: 'grupo', value: grupo }]).subscribe(res => {
      this.partidos = res.data;
      this.spinner.hide();
    });
  }

  retrievePartidosPorDia(dia: Date) {
    const date = this.buildDate(dia);
    this.pronosticoService.getAll(0, 0, [{ key: 'dia', value: date }]).subscribe(res => {
      this.partidos = res.data;
      this.spinner.hide();
    });
  }


  retrievePartidosPorFecha(fecha: number) {
    this.pronosticoService.getAll(0, 0, [{ key: 'fecha', value: fecha }]).subscribe(res => {
      this.partidos = res.data;
      this.spinner.hide();
    });
  }

  retrievePartidosPorFase(fase: Fase) {
    this.pronosticoService.getAll(0, 0, [{ key: 'fase', value: fase.codigo }]).subscribe(res => {
      this.partidos = res.data;
      this.spinner.hide();
    });
  }

  hoy() {
    this.formato = Formato.HOY
    this.retrievePartidosPorDia(this.today);
  }

  grupo() {
    this.formato = Formato.GRUPO
    this.retrievePartidosPorGrupo(this.grupos[0].codigo);
  }

  fecha() {
    this.formato = Formato.FECHA
    this.retrievePartidosPorFecha(this.fechas[0]);
  }

  fase() {
    this.formato = Formato.FASE
    this.retrievePartidosPorFase(this.fases[0]);
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

  isFase() {
    return this.formato === Formato.FASE;
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
  HOY, GRUPO, FECHA, FASE
}