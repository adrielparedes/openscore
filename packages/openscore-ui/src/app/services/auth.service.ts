import { Injectable } from '@angular/core';
import * as jwt_decode from 'jwt-decode';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class AuthService {


    token: BehaviorSubject<string>;

    private TOKEN = 'openscore-token';

    constructor() {
        // Que esto quede vacio asi se puede crear con un new en caso extremo
        this.token = new BehaviorSubject(this.getLocalStorageToken());
    }

    isLoggedIn() {
        const t = this.getLocalStorageToken();
        return t !== undefined && t !== null && t.length > 0;
    }

    public getToken() {
        return this.token.asObservable();
    }

    public getLocalStorageToken() {
        return localStorage.getItem(this.TOKEN);
    }

    public setToken(token: string) {
        localStorage.setItem(this.TOKEN, token);
        this.token.next(token);
    }

    public logout() {
        return localStorage.removeItem(this.TOKEN);
    }

    public isAdmin() {
        return this.containsRole('ADMIN');
    }

    public containsRole(role: string) {
        try {
            const decoded = jwt_decode(this.getLocalStorageToken());
            return (<string[]>decoded['roles']).includes(role.toUpperCase());
        } catch (e) {
            return false;
        }
    }

}
