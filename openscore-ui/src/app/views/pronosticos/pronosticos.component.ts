import { PartidosService } from './../../services/partidos.service';
import { Grupo } from './../../model/grupo';
import { Partido } from './../../model/partido';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pronosticos',
  templateUrl: './pronosticos.component.html',
  styleUrls: ['./pronosticos.component.scss']
})
export class PronosticosComponent implements OnInit {

  formato = "lista";
  partidos: Partido[] = [];
  grupos: Grupo[] = [
    { codigo: "GRUPO_A", nombre: "Grupo A" },
    { codigo: "GRUPO_B", nombre: "Grupo B" }
  ]

  constructor(private partidosService: PartidosService) { }

  ngOnInit() {
    this.retrievePartidos('GRUPO_A');
  }

  retrievePartidos(grupo: string) {
    console.log(grupo);
    this.partidosService.getAll(0, 0).subscribe(res => {
      this.partidos = res.data;
    });
  }

  getResultado(partido: Partido) {
    return this.capitalize(partido.status.replace('_', ' ').toLowerCase());
  }

  capitalize(str: string) {
    return str.replace(/\b(\w)/g, s => s.toUpperCase());
  }

}
