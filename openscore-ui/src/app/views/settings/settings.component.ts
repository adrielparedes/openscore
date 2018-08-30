import { ToastrService } from 'ngx-toastr';
import { UpdateUsuario } from './../../model/update-usuario';
import { Pais } from './../../model/pais';
import { Router } from '@angular/router';
import { PaisesService } from './../../services/paises.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../model/usuario';
import { CrearUsuario } from '../../model/crear-usuario';

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
    private toastr: ToastrService,
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
      this.form.patchValue(this.usuario);
      this.form.controls['pais'].setValue(this.usuario.pais.codigo);

    });


  }

  submit() {
    const formValues = <UpdateUsuario>this.form.value;
    const updateUsuario: UpdateUsuario = {
      nombre: formValues.nombre,
      apellido: formValues.apellido,
      pais: formValues.pais
    };
    this.usuarioService.updateUser(this.usuario.id, updateUsuario).subscribe(res => {
      this.authService.setToken(res.data.token);
      this.toastr.success('User updated succesfully');
    });
  }

  cancelar() {
    this.router.navigate(['/home']);
  }

  changePassword() {
    this.router.navigate(['/pages/password']);
  }

  isInvalid(controlName: string) {
    const control = this.form.controls[controlName];
    return control.invalid && control.dirty;
  }






}
