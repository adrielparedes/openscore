import { UsuarioService } from './usuario.service';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
    imports: [
        HttpClientModule
    ],
    providers: [
        UsuarioService
    ]
})
export class ServicesModule { }
