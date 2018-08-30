import { ToastrService } from 'ngx-toastr';
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
  loading = true;

  constructor(private router: Router,
    private noticiasService: NoticiasService,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.loading = true;
    this.noticiasService.getAll(0, 0).subscribe(res => {
      this.noticias = res.data;
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
