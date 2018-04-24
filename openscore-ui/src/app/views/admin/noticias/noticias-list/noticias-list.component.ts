import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NoticiasService } from '../../../../services/noticias.service';

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

}