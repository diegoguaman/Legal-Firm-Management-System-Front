/**
 * Clients Feature Routes
 * Lazy-loaded routes for the clients feature
 */
import { Routes } from '@angular/router';
import { ClientListComponent } from './client-list/client-list.component';
import { ClientFormComponent } from './client-form/client-form.component';

export const clientsRoutes: Routes = [
  {
    path: '',
    component: ClientListComponent
  },
  {
    path: 'new',
    component: ClientFormComponent
  },
  {
    path: ':id/edit',
    component: ClientFormComponent
  }
];

