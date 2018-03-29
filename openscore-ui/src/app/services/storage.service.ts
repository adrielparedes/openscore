import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {

    private TOKEN = 'token';

    constructor() {

    }

    public getToken() {
        return localStorage.getItem(this.TOKEN);
    }

    public setToken(token: string) {
        return localStorage.setItem(this.TOKEN, token)
    }

}