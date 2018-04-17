import { GruposService } from './../../services/grupos.service';
import { Pronostico } from './../../model/pronostico';
import { PronosticoService } from './../../services/pronostico.service';
import { PartidosService } from './../../services/partidos.service';
import { Grupo } from './../../model/grupo';
import { Partido } from './../../model/partido';
import { Component, OnInit } from '@angular/core';
import { ApiResponse } from '../../model/api-response';

@Component({
  selector: 'app-pronosticos',
  templateUrl: './pronosticos.component.html',
  styleUrls: ['./pronosticos.component.scss']
})
export class PronosticosComponent implements OnInit {

  partidos: Partido[] = [];
  grupos: Grupo[] = [];

  constructor(private partidosService: PronosticoService,
    private gruposService: GruposService) {

  }

  ngOnInit() {

    this.gruposService.getAll(0, 0).subscribe(res => {
      console.log(res);
      this.grupos = res.data;
      this.retrievePartidos(this.grupos[0].codigo);
    });


  }

  retrievePartidos(grupo: string) {
    console.log(grupo);
    this.partidosService.getAll(0, 0, [{ key: 'grupo', value: grupo }]).subscribe(res => {
      this.partidos = res.data;
      console.log(this.partidos);
    });
  }

  getResultado(partido: Partido) {
    return this.capitalize(partido.status.replace('_', ' ').toLowerCase());
  }

  capitalize(str: string) {
    return str.replace(/\b(\w)/g, s => s.toUpperCase());
  }

  isLocal(pronostico: Pronostico) {
    return pronostico !== null && pronostico.local;
  }

  local(partido: Partido) {
    console.log('local');
    this.partidosService.local(partido.id).subscribe(this.updatePartido(partido));
  }


  empate(partido: Partido) {
    this.partidosService.empate(partido.id).subscribe(this.updatePartido(partido));
  }


  visitante(partido: Partido) {
    this.partidosService.visitante(partido.id).subscribe(this.updatePartido(partido));
  }

  isEmpate(pronostico: Pronostico) {
    return pronostico !== null && pronostico.empate;
  }

  updatePartido(partido: Partido) {
    return (res: ApiResponse<Pronostico>) => { partido.pronostico = res.data }
  }

  isVisitante(pronostico: Pronostico) {
    return pronostico !== null && pronostico.visitante;
  }
}
