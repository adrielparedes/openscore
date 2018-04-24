import { CrearNoticia } from './../../../../model/crear-noticia';
import { NoticiasService } from './../../../../services/noticias.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-noticias-editor',
  templateUrl: './noticias-editor.component.html',
  styleUrls: ['./noticias-editor.component.scss']
})
export class NoticiasEditorComponent implements OnInit {

  id: number;
  htmlContent: string;

  constructor(private noticiasService: NoticiasService) { }

  ngOnInit() {
  }

  save() {
    const crearNoticia = <CrearNoticia>{ titulo: '', contenido: this.htmlContent }
    this.noticiasService.add(crearNoticia).subscribe(res => this.id = res.data.id);
  }
}
