import { ToastrService } from 'ngx-toastr';
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
  loading = true;


  constructor(private pronosticoService: PronosticoService,
    private partidosService: PartidosService,
    private gruposService: GruposService,
    private fasesService: FaseService,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.update();
  }

  update() {
    this.gruposService.getAll(0, 0).subscribe(res1 => {
      this.grupos = this.removeNone(res1.data);
      this.partidosService.getFechas().subscribe(res2 => {
        this.fechas = res2.data;
        this.fasesService.getAll(0, 0).subscribe(res => {
          this.fases = res.data;
        });
      });
    });

    this.retrievePartidosPorDia(this.today);

  }

  retrievePartidosPorGrupo(grupo: string) {
    this.getAll(0, 0, [{ key: 'grupo', value: grupo }]);
  }

  retrievePartidosPorDia(dia: Date) {
    const date = this.buildDate(dia);
    this.getAll(0, 0, [{ key: 'dia', value: date }]);
  }


  retrievePartidosPorFecha(fecha: number) {
    this.getAll(0, 0, [{ key: 'fecha', value: fecha }]);
  }

  retrievePartidosPorFase(fase: Fase) {
    this.getAll(0, 0, [{ key: 'fase', value: fase.codigo }]);
  }


  getAll(page: number, pageSize: number, params) {
    this.loading = true;
    this.partidos = [];
    this.pronosticoService.getAll(page, pageSize, params).subscribe((res) => {
      this.partidos = res.data;
      this.loading = false;
    });
  }

  removeNone(grupos: Grupo[]) {
    return grupos.filter(x => x.codigo !== 'NONE');
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

}

export enum Formato {
  HOY, GRUPO, FECHA, FASE
}
