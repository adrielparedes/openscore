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
  loading = true;

  constructor(
    private equiposService: EquiposService,
    private partidosService: PartidosService,
    private fb: FormBuilder,
    private router: Router,
    private activedRoute: ActivatedRoute) {

    this.id = this.activedRoute.snapshot.params.id;

  }

  ngOnInit() {
    this.loading = true;
    this.crearForm();
    if (this.id) {
      this.partidosService.get(this.id).subscribe(res => {
        this.partido = res.data;
        this.form.setValue({
          id: this.partido.id,
          local: this.partido.local.codigo,
          visitante: this.partido.visitante.codigo,
          dia: new Date(this.partido.dia),
          fecha: this.partido.fecha,
          lugar: this.partido.lugar,
          grupo: this.partido.grupo.codigo,
          fase: this.partido.fase.codigo
        });
        this.loading = false;
      });
    } else {
      this.partido = <Partido>{};
      this.loading = false;
    }
  }

  crearForm() {
    this.form = this.fb.group({
      id: [''],
      local: [''],
      visitante: [''],
      dia: [''],
      fecha: [''],
      lugar: [''],
      grupo: [''],
      fase: ['']
    });
  }

  guardar() {
    const id = this.form.value.id;
    const crearPartido: CrearPartido = <CrearPartido>{
      local: this.form.value.local,
      visitante: this.form.value.visitante,
      dia: this.form.value.dia,
      fecha: this.form.value.fecha,
      lugar: this.form.value.lugar,
      grupo: this.form.value.grupo,
      fase: this.form.value.fase
    }

    if (this.form.value.id) {
      this.partidosService.update(this.form.value.id, crearPartido).subscribe(res =>
        this.cancelar());
    } else {
      console.log(crearPartido);
      this.partidosService.add(crearPartido).subscribe(res => this.cancelar());
    }
  }

  cancelar() {
    this.router.navigate(['/admin/partidos']);
  }

}
