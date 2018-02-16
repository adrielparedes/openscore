import { EquiposService } from './equipos.service';
import { DefinicionCompeticionesService } from './definicion-competiciones.service';
import { UsuarioService } from './usuario.service';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
    imports: [
        HttpClientModule
    ],
    providers: [
        UsuarioService,
        DefinicionCompeticionesService,
        EquiposService
    ]
})
export class ServicesModule { }
