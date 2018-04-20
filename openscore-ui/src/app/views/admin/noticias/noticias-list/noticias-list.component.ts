import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-noticias-list',
  templateUrl: './noticias-list.component.html',
  styleUrls: ['./noticias-list.component.scss']
})
export class NoticiasListComponent implements OnInit {

  noticias = [];

  constructor(private router: Router) { }

  ngOnInit() {
  }

  nueva() {
    this.router.navigate(['/admin/noticias/editor']);
  }

}
