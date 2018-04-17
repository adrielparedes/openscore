import { Component, OnInit } from '@angular/core';
import * as JWT from 'jwt-decode';

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
    console.log(decoded);
    this.nombre = decoded['nombre'];
    this.apellido = decoded['apellido'];
    this.roles = decoded['roles'];
  }
}
