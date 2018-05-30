import { Pais } from './../../model/pais';
import { Router } from '@angular/router';
import { PaisesService } from './../../services/paises.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../model/usuario';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  paises: Pais[] = [];
  form: FormGroup;
  usuario: Usuario;

  constructor(private usuarioService: UsuarioService,
    private fb: FormBuilder,
    private paisesService: PaisesService,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit() {

    this.paisesService.getAll(0, 0).subscribe(res => this.paises = res.data);
    this.form = this.fb.group({
      email: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      pais: ['', Validators.required]
    });

    this.usuarioService.getMyUser().subscribe(res => {
      this.usuario = res.data;
      console.log(this.usuario);
      this.form.patchValue(this.usuario);
      this.form.controls['pais'].setValue(this.usuario.pais.codigo);

    });


  }

  submit() {

  }

  cancelar() {

  }

  changePassword() {

  }

  isInvalid(controlName: string) {
    const control = this.form.controls[controlName];
    return control.invalid && control.dirty;
  }






}
