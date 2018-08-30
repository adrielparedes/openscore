import { ToastrService } from 'ngx-toastr';
import { ApiResponse } from './../../../../model/api-response';
import { ActivatedRoute, Router } from '@angular/router';
import { CrearNoticia } from './../../../../model/crear-noticia';
import { NoticiasService } from './../../../../services/noticias.service';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Noticia } from '../../../../model/noticia';

@Component({
  selector: 'app-noticias-editor',
  templateUrl: './noticias-editor.component.html',
  styleUrls: ['./noticias-editor.component.scss']
})
export class NoticiasEditorComponent implements OnInit {

  id: number;
  titulo = '';
  autor = '';
  htmlContent = '';
  isDirty = false;
  saving = false;
  config = {
    placeholder: 'Escriba aqui',
    height: 'auto',
    minHeight: '300px',
    spellcheck: true
  }

  constructor(private noticiasService: NoticiasService,
    private router: Router,
    private activedRoute: ActivatedRoute,
    private toastr: ToastrService) {
  }

  ngOnInit() {
    this.id = this.activedRoute.snapshot.params.id;
    this.noticiasService.get(this.id).subscribe(res => {
      this.titulo = res.data.titulo;
      this.autor = res.data.autor;
      this.htmlContent = res.data.contenido;
    })
  }

  save() {
    this.saving = true;
    const crearNoticia = <CrearNoticia>{ titulo: this.titulo.trim(), contenido: this.htmlContent, autor: this.autor.trim() }
    console.log(this.id);
    if (this.id) {
      this.noticiasService.update(this.id, crearNoticia).subscribe(this.noticiaGuardada(this.toastr), this.errorAlGuardar(this.toastr));
    } else {
      this.noticiasService.add(crearNoticia).subscribe(this.noticiaGuardada(this.toastr), this.errorAlGuardar(this.toastr));
    }
  }

  onChange(newValue) {
    this.isDirty = true;
  }

  noticiaGuardada(toastr: ToastrService) {
    return (res: ApiResponse<Noticia>) => {
      this.id = res.data.id;
      toastr.success(`Noticia ${this.id} guardado`);
      this.isDirty = false;
      this.saving = false;
    };
  }

  volver() {
    this.router.navigate(['admin', 'noticias']);
  }


  errorAlGuardar(toastr: ToastrService) {
    return (res) => {
      let titulo = '';
      if (this.titulo !== undefined && this.titulo.length > 0) {
        titulo = '"' + this.titulo + '"';
      }
      toastr.error(`No se pudo guardar la noticia ${titulo}`);
      this.saving = false;
    };
  }
}
