import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {

    private TOKEN = 'openscore-token';

    constructor() {

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

}