import { Grupo } from './../../../../model/grupo';
import { CrearPartido } from './../../../../model/crear-partido';
import { PartidosService } from './../../../../services/partidos.service';
import { Router, ActivatedRoute } from '@angular/router';
import { EquiposService } from './../../../../services/equipos.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Partido } from './../../../../model/partido';
import { Component, OnInit } from '@angular/core';
import { Equipo } from '../../../../model/equipo';

@Component({
  selector: 'app-partido-form',
  templateUrl: './partido-form.component.html',
  styleUrls: ['./partido-form.component.scss']
})
export class PartidoFormComponent implements OnInit {

  id: number;
  partido: Partido;
  local: Equipo;
  visitante: Equipo;
  form: FormGroup;

  constructor(
    private equiposService: EquiposService,
    private partidosService: PartidosService,
    private fb: FormBuilder,
    private router: Router,
    private activedRoute: ActivatedRoute) {

    this.id = this.activedRoute.snapshot.params.id;

    if (this.id) {
      this.partidosService.get(this.id).subscribe(res => {
        this.partido = res.data;
        this.crearForm(this.partido);
      });
    } else {
      this.partido = <Partido>{};
      this.crearForm(this.partido);
    }

  }

  ngOnInit() {

  }

  crearForm(partido: Partido) {
    console.log(partido);
    this.form = this.fb.group({
      id: [partido.id],
      local: [partido.local || partido.local.nombre],
      visitante: [partido.visitante || partido.visitante.nombre],
      dia: [partido.dia],
      fecha: [partido.fecha],
      lugar: [partido.lugar],
      grupo: [partido.grupo || partido.grupo.nombre],
      fase: [partido.fase || partido.fase.nombre]
    });
  }

  guardar() {
    const id = this.form.value.id;
    const crearPartido: CrearPartido = <CrearPartido>{
      nombre: this.form.value.nombre,
      codigo: this.form.value.codigo,
      codigoPais: this.form.value.codigoPais,
      logo: this.form.value.logo,
    }

    if (this.form.value.id) {
      this.partidosService.update(this.form.value.id, crearPartido).subscribe(res =>
        this.cancelar());
    } else {
      this.partidosService.add(crearPartido).subscribe(res => this.cancelar());
    }
  }

  cancelar() {
    this.router.navigate(['/admin/partidos']);
  }

}
