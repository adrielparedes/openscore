import { ApiResponse } from './../../../model/api-response';
import { PronosticoService } from './../../../services/pronostico.service';
import { Partido } from './../../../model/partido';
import { Component, OnInit, Input } from '@angular/core';
import { Pronostico } from '../../../model/pronostico';

@Component({
  selector: 'app-pronostico',
  templateUrl: './pronostico.component.html',
  styleUrls: ['./pronostico.component.scss']
})
export class PronosticoComponent implements OnInit {

  @Input() partido: Partido;

  constructor(private pronosticoService: PronosticoService) { }

  ngOnInit() {
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
    this.pronosticoService.local(partido.id).subscribe(this.updatePartido(partido));
  }


  empate(partido: Partido) {
    this.pronosticoService.empate(partido.id).subscribe(this.updatePartido(partido));
  }


  visitante(partido: Partido) {
    this.pronosticoService.visitante(partido.id).subscribe(this.updatePartido(partido));
  }

  isEmpate(pronostico: Pronostico) {
    return pronostico !== null && pronostico.empate;
  }

  updatePartido(partido: Partido) {
    return (res: ApiResponse<Pronostico>) => {
      partido.pronostico = res.data;
    }
  }

  isVisitante(pronostico: Pronostico) {
    return pronostico !== null && pronostico.visitante;
  }

}
