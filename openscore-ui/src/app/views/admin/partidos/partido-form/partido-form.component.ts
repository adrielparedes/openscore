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
          local: this.partido.local.nombre,
          visitante: this.partido.visitante.nombre,
          dia: this.partido.dia,
          fecha: this.partido.fecha,
          lugar: this.partido.lugar,
          grupo: this.partido.grupo.nombre,
          fase: this.partido.fase.nombre
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
