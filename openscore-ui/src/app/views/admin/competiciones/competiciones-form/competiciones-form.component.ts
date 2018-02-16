import { FormBuilder, FormGroup } from '@angular/forms';
import { DefinicionCompeticion } from './../../../../model/definicion-competicion';
import { DefinicionCompeticionesService } from './../../../../services/definicion-competiciones.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-competiciones-form',
  templateUrl: './competiciones-form.component.html',
  styleUrls: ['./competiciones-form.component.scss']
})
export class CompeticionesFormComponent implements OnInit {

  id: number;
  competicion: DefinicionCompeticion;
  form: FormGroup;
  logo: String;

  constructor(
    private competicionesService: DefinicionCompeticionesService,
    private fb: FormBuilder,
    private router: Router,
    private activedRoute: ActivatedRoute) {

    this.id = this.activedRoute.snapshot.params.id;

    this.competicion = <DefinicionCompeticion>{};
    this.crearForm(this.competicion);

    if (this.id) {
      this.competicionesService.get(this.id).subscribe(response => {
        this.competicion = response.data;
        this.crearForm(this.competicion);
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



  crearForm(competicion: DefinicionCompeticion) {
    this.form = this.fb.group({
      id: [competicion.id],
      deleted: [competicion.deleted],
      nombre: [competicion.nombre],
      descripcion: [competicion.descripcion],
      logo: [competicion.logo]
    });
    this.logo = competicion.logo;
    this.onChanges();
  }

  guardar() {
    const competicion = this.form.value;

    if (competicion.id) {
      this.competicionesService.update(competicion.id, competicion).subscribe(res =>
        this.cancelar());
    } else {
      this.competicionesService.add(competicion).subscribe(res => this.cancelar());
    }
  }

  cancelar() {
    this.router.navigate(['/admin/competiciones']);
  }

}
