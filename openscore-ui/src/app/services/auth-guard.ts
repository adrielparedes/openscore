import { StorageService } from './storage.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router, CanActivateChild, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivateChild {

    constructor(private storage: StorageService,
        public router: Router) { }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (!this.storage.isLoggedIn()) {
            console.log('not logged in');
            this.router.navigate(['/pages/login']);
            return false;
        } else {
            console.log('logged in');
            return true;
        }
    }

}
