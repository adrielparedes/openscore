import { PaisesService } from './paises.service';
import { NoticiasService } from './noticias.service';
import { FaseService } from './fase.service';
import { GruposService } from './grupos.service';
import { PronosticoService } from './pronostico.service';
import { PartidosService } from './partidos.service';
import { StorageService } from './storage.service';
import { AddHeaderInterceptor } from './../interceptors/add-header.interceptor';
import { EquiposService } from './equipos.service';
import { DefinicionCompeticionesService } from './definicion-competiciones.service';
import { UsuarioService } from './usuario.service';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RankingService } from './ranking.service';
import { AuthGuard } from './auth-guard';


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
        PartidosService,
        GruposService,
        NoticiasService,
        FaseService,
        PaisesService,
        AuthGuard,
        PronosticoService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AddHeaderInterceptor,
            multi: true,
        }
    ]
})
export class ServicesModule { }
