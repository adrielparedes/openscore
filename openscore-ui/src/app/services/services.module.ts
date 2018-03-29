import { StorageService } from './storage.service';
import { AddHeaderInterceptor } from './../interceptors/add-header.interceptor';
import { EquiposService } from './equipos.service';
import { DefinicionCompeticionesService } from './definicion-competiciones.service';
import { UsuarioService } from './usuario.service';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RankingService } from './ranking.service';


@NgModule({
    imports: [
        HttpClientModule
    ],
    providers: [
        UsuarioService,
        DefinicionCompeticionesService,
        EquiposService,
        RankingService,
        StorageService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AddHeaderInterceptor,
            multi: true,
        }
    ]
})
export class ServicesModule { }
