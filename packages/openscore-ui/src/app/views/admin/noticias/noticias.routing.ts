import { NoticiasListComponent } from './noticias-list/noticias-list.component';
import { NoticiasComponent } from './noticias.component';
import { Routes, RouterModule } from '@angular/router';
import { NoticiasEditorComponent } from './noticias-editor/noticias-editor.component';

const routes: Routes = [
  {
    path: '',
    component: NoticiasComponent,
    data: {
      title: 'Noticias'
    },
    children: [{
      path: '',
      component: NoticiasListComponent,
      data: {
        title: 'Noticias'
      }
    },
    {
      path: 'editor',
      component: NoticiasEditorComponent,
      data: {
        title: 'Editor'
      },
    },
    {
      path: 'editor/:id',
      component: NoticiasEditorComponent,
      data: {
        title: 'Editor'
      },
    }]
  },
];

export const NoticiasRoutes = RouterModule.forChild(routes);
