import { Subscription } from 'rxjs/Rx';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import * as JWT from 'jwt-decode';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html'
})
export class AppHeaderComponent implements OnInit, OnDestroy {
  nombre: string;
  apellido: string
  roles: string[] = [];
  sub: Subscription;

  constructor(private router: Router, private authService: AuthService) {
  }

  ngOnInit() {
    this.sub = this.authService.getToken().subscribe(token => {
      try {
        const decoded = JWT(token);
        this.nombre = decoded['nombre'];
        this.apellido = decoded['apellido'];
        this.roles = decoded['roles'];
      } catch (e) {

      }
    });
  }

  settings() {
    this.router.navigate(['/settings']);

  }

  logout() {
    localStorage.removeItem('openscore-token');
    this.router.navigate(['/dashboard']);

  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
