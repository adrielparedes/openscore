import { UsuarioCompleto } from './../../../model/usuario-completo';
import { Usuario } from './../../../model/usuario';
import { UsuarioService } from './../../../services/usuario.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {

  usuarios: UsuarioCompleto[]

  constructor(private usuariosService: UsuarioService) { }

  ngOnInit() {
    this.usuariosService.allAdmin(0, 10).subscribe(res => {
      this.usuarios = res.data;
    }
    );
  }

}
