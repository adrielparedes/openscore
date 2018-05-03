import { NoticiasRoutes } from './noticias.routing';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoticiasComponent } from './noticias.component';
import { NgxEditorModule } from 'ngx-editor';
import { NoticiasEditorComponent } from './noticias-editor/noticias-editor.component';
import { NoticiasListComponent } from './noticias-list/noticias-list.component';
import { ToastModule } from 'ng2-toastr/ng2-toastr';

@NgModule({
  imports: [
    CommonModule,
    NgxEditorModule,
    FormsModule,
    NoticiasRoutes,
    ToastModule.forRoot()
  ],
  declarations: [NoticiasComponent,
    NoticiasEditorComponent,
    NoticiasListComponent
  ]
})
export class NoticiasModule { }
