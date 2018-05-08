import { ToastrService } from 'ngx-toastr';
import { ApiResponse } from './../../../../model/api-response';
import { ActivatedRoute } from '@angular/router';
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
  titulo: string;
  autor: string;
  htmlContent: string;

  constructor(private noticiasService: NoticiasService,
    private activedRoute: ActivatedRoute,
    private toastr: ToastrService) {
    console.log(this.toastr);
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
    const crearNoticia = <CrearNoticia>{ titulo: this.titulo, contenido: this.htmlContent, autor: this.autor }
    console.log(this.id);
    if (this.id) {
      this.noticiasService.update(this.id, crearNoticia).subscribe(this.noticiaGuardada(this.toastr));
    } else {
      this.noticiasService.add(crearNoticia).subscribe(this.noticiaGuardada(this.toastr));
    }
  }

  noticiaGuardada(toastr: ToastrService) {
    return (res: ApiResponse<Noticia>) => {
      this.id = res.data.id;
      toastr.success(`Noticia ${this.id} guardado`);
    };
  }
}
