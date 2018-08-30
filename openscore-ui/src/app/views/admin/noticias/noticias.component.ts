import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-noticias',
  templateUrl: './noticias.component.html',
  styleUrls: ['./noticias.component.scss']
})
export class NoticiasComponent implements OnInit {

  htmlContent: string;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  nueva() {
    this.router.navigate(['/admin/noticias/editor']);
  }

}
