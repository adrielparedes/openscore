import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NoticiasService } from '../../../../services/noticias.service';
import { Noticia } from '../../../../model/noticia';

@Component({
  selector: 'app-noticias-list',
  templateUrl: './noticias-list.component.html',
  styleUrls: ['./noticias-list.component.scss']
})
export class NoticiasListComponent implements OnInit {

  noticias = [];

  constructor(private router: Router,
    private noticiasService: NoticiasService) { }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.noticiasService.getAll(0, 0).subscribe(res => this.noticias = res.data);
  }

  nueva() {
    this.router.navigate(['/admin/noticias/editor']);
  }

  editar(noticia: Noticia) {
    this.router.navigate(['/admin/noticias/editor', noticia.id]);
  }

  publicar(noticia: Noticia) {
    this.noticiasService.publicar(noticia.id).subscribe(res => this.refresh());
  }

  retirar(noticia: Noticia) {
    this.noticiasService.retirar(noticia.id).subscribe(res => this.refresh());
  }

}
