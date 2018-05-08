import { ToastrService } from 'ngx-toastr';
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

  usuarios: UsuarioCompleto[] = [];
  loading = true;

  constructor(
    private usuariosService: UsuarioService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.loading = true;
    this.usuariosService.allAdmin(0, 10).subscribe(res => {
      this.usuarios = res.data;
      this.loading = false;
    },
      err => {
        if (err.status === 0) {
          this.toastr.error('No se puede comunicar con el servicio');
        } else {
          this.toastr.error('Error desconocido');
        }
        this.loading = false;
      });
  }

}
