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
  grupos: Grupo[] = [
    { codigo: "GRUPO_A", nombre: "Grupo A" },
    { codigo: "GRUPO_B", nombre: "Grupo B" }
  ]

  constructor() { }

  ngOnInit() {
  }

  partidos(grupo: Grupo): Partido[] {
    console.log(grupo);
    return <Partido[]>[{}];
  }

}
