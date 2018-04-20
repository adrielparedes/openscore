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

  isPendiente() {
    return this.partido.status === 'PENDIENTE';
  }

  isGanador() {
    if (this.partido.resultado !== null && this.partido.pronostico !== null) {
      if ((this.partido.resultado.local > this.partido.resultado.visitante && this.partido.pronostico.local) ||
        (this.partido.resultado.local === this.partido.resultado.visitante && this.partido.pronostico.empate) ||
        (this.partido.resultado.local < this.partido.resultado.visitante && this.partido.pronostico.visitante)) {
        return 'success';
      } else {
        return 'error';
      }
    } else {
      return '';
    }
  }

  getEleccion() {
    if (this.partido.pronostico == null) {
      return 'Sin pronostico';
    } else if (this.partido.pronostico.empate) {
      return 'Empate';
    } else if (this.partido.pronostico.local) {
      return this.partido.local.nombre;
    } else if (this.partido.pronostico.visitante) {
      return this.partido.visitante.nombre;
    } else {
      return 'Sin pronostico';
    }
  }

}
