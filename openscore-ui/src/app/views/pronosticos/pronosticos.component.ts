import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pronosticos',
  templateUrl: './pronosticos.component.html',
  styleUrls: ['./pronosticos.component.scss']
})
export class PronosticosComponent implements OnInit {

  formato = "lista";
  grupos = [
    {
      nombre: 'Grupo A', partidos: [{}, {}]
    },
    {
      nombre: 'Grupo B', partidos: [{}, {}]
    }
  ];


  constructor() { }

  ngOnInit() {
  }

}
