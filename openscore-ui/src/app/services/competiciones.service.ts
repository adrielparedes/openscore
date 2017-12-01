import { Competicion } from './../models/competicion';
import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

@Injectable()
export class CompeticionesService {

    constructor() {

    }

    get(page: number, size: number): Observable<Array<Competicion>> {
        const competicion1 = new Competicion();
        competicion1.nombre = 'Copa Libertadores de América';
        competicion1.descripcion = 'La copa mas importante de sudamerica!';
        competicion1.ubicacion = 'CONMEBOL';
        competicion1.logoUrl = 'http://www.brandemia.org/sites/default/files/inline/images/copa_libertadores-antes2.jpg';
        competicion1.registrado = true;

        const competicion2 = new Competicion();
        competicion2.nombre = 'Superliga Argentina de Futbol';
        competicion2.ubicacion = 'Argentina';
        competicion2.logoUrl = 'http://cdn.foxsportsla.com/sites/foxsports-la/files/img/competition/shields-original/logo_superliga.png?ver=76ddaf8b-6b74-4d41-8577-29f99cf71f3d';
        competicion2.registrado = false;
        return Observable.of([competicion1, competicion2]);
    }

}