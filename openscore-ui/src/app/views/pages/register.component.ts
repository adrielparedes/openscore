import { PreguntaSecreta } from './../../model/pregunta-secreta';
import { PreguntaSecretaService } from './../../services/pregunta-secreta.service';
import { Pais } from './../../model/pais';
import { PaisesService } from './../../services/paises.service';
import { CrearUsuario } from './../../model/crear-usuario';
import { UsuarioService } from './../../services/usuario.service';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  templateUrl: 'register.component.html'
})
export class RegisterComponent {

  mailPattern = '.+@redhat\.com';
  paises: Pais[] = [];
  preguntas: PreguntaSecreta[] = [];
  registro: FormGroup;
  error = false;
  errores: string[] = [];
  constructor(private usuarioService: UsuarioService,
    private fb: FormBuilder,
    private paisesService: PaisesService,
    private preguntaSecretaService: PreguntaSecretaService,
    private router: Router) {

    this.paisesService.getAll(0, 0).subscribe(res => this.paises = res.data);
    this.preguntaSecretaService.getAll(0, 0).subscribe(res => this.preguntas = res.data);

    this.registro = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      pais: ['', Validators.required],
      email: ['', [Validators.pattern(this.mailPattern)]],
      confirmacionEmail: ['', [Validators.pattern(this.mailPattern)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmacionPassword: ['', [Validators.required, Validators.minLength(6)]]
    });


    this.registro.valueChanges.subscribe(change => { this.error = false });
  }

  registrar() {
    if (this.registro.valid) {
      console.log(this.registro.value);
      const crearUsuario: CrearUsuario = this.registro.value;
      this.usuarioService.registrar(crearUsuario).subscribe(res => {
        console.log(res)
        this.router.navigate(['/dashboard']);
      }, error => {
        this.error = true;
        this.errores = error.error.data;
        console.log(error);
        console.log(this.errores);
      });
    } else {
      this.error = true;
    }
  }

  isInvalid(controlName: string) {
    const control = this.registro.controls[controlName];
    return control.invalid && control.dirty;
  }

}
