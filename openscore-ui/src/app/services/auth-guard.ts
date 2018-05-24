import { Injectable } from '@angular/core';
import { CanActivate, Router, CanActivateChild, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivateChild {

    constructor(private authService: AuthService,
        public router: Router) { }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (!this.authService.isLoggedIn()) {
            console.log('not logged in');
            this.router.navigate(['/pages/login']);
            return false;
        } else {
            console.log('logged in');
            return true;
        }
    }

}
