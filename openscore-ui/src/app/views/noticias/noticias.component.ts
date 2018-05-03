import { Noticia } from './../../model/noticia';
import { NoticiasService } from './../../services/noticias.service';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-noticias',
  templateUrl: './noticias.component.html',
  styleUrls: ['./noticias.component.scss']
})
export class NoticiasComponent implements OnInit {

  noticias: Noticia[] = [];

  constructor(private noticiasService: NoticiasService) { }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.noticiasService.getAll(0, 0, [{ key: 'status', value: 'PUBLICADO' }]).subscribe(res => {
      this.noticias = res.data;
    })
  }

}
