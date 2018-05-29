import { Component, OnInit } from '@angular/core';
import * as JWT from 'jwt-decode';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html'
})
export class AppHeaderComponent implements OnInit {
  nombre: string;
  apellido: string
  roles: string[] = [];

  ngOnInit() {
    const token = localStorage.getItem('openscore-token');
    const decoded = JWT(token);

    this.nombre = decoded['nombre'];
    this.apellido = decoded['apellido'];
    this.roles = decoded['roles'];
  }

  constructor(private router: Router) {

  }

  settings() {
    this.router.navigate(['/settings']);

  }

  logout() {
    localStorage.removeItem('openscore-token');
    this.router.navigate(['/dashboard']);

  }
}
