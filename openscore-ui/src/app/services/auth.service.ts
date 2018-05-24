import { Injectable } from '@angular/core';
import * as jwt_decode from 'jwt-decode';

@Injectable()
export class AuthService {

    private TOKEN = 'openscore-token';

    constructor() {
        // Que esto quede vacio asi se puede crear con un new en caso extremo
    }

    isLoggedIn() {
        const t = this.getToken();
        return t !== undefined && t !== null && t.length > 0;
    }

    public getToken() {
        return localStorage.getItem(this.TOKEN);
    }

    public setToken(token: string) {
        return localStorage.setItem(this.TOKEN, token);
    }

    public logout() {
        return localStorage.removeItem(this.TOKEN);
    }

    public isAdmin() {
        return this.containsRole('ADMIN');
    }

    public containsRole(role: string) {
        const token = this.getToken();
        const decoded = jwt_decode(token);
        return (<string[]>decoded['roles']).includes(role.toUpperCase());
    }

}
