import { CrearEquipo } from './../../../../model/crear-equipo';
import { Pais } from './../../../../model/pais';
import { Router, ActivatedRoute } from '@angular/router';
import { EquiposService } from './../../../../services/equipos.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Equipo } from './../../../../model/equipo';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-equipos-form',
  templateUrl: './equipos-form.component.html',
  styleUrls: ['./equipos-form.component.scss']
})
export class EquiposFormComponent implements OnInit {

  id: number;
  equipo: Equipo;
  form: FormGroup;
  logo: String;

  constructor(
    private equiposService: EquiposService,
    private fb: FormBuilder,
    private router: Router,
    private activedRoute: ActivatedRoute) {

    this.id = this.activedRoute.snapshot.params.id;

    this.equipo = <Equipo>{};
    this.crearForm(this.equipo);

    if (this.id) {
      this.equiposService.get(this.id).subscribe(response => {
        this.equipo = response.data;
        this.crearForm(this.equipo);
      });
    }

  }

  ngOnInit() {

  }



  onChanges(): void {
    this.form.valueChanges.subscribe(val => {
      console.log(val);
      this.logo = val.logo;
    });
  }


  crearForm(equipo: Equipo) {
    this.form = this.fb.group({
      id: [equipo.id],
      deleted: [equipo.deleted],
      nombre: [equipo.nombre],
      codigo: [equipo.codigo],
      codigoPais: [equipo.pais],
      logo: [equipo.logo]
    });
    this.logo = equipo.logo;
    this.onChanges();
  }

  guardar() {
    const id = this.form.value.id;
    const equipo: CrearEquipo = <CrearEquipo>{
      nombre: this.form.value.nombre,
      codigo: this.form.value.codigo,
      codigoPais: this.form.value.codigoPais,
      logo: this.form.value.logo,
    }

    if (this.form.value.id) {
      this.equiposService.update(this.form.value.id, equipo).subscribe(res =>
        this.cancelar());
    } else {
      this.equiposService.add(equipo).subscribe(res => this.cancelar());
    }
  }

  cancelar() {
    this.router.navigate(['/admin/equipos']);
  }

}
