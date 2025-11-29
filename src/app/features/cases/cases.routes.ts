/**
 * Cases Feature Routes
 * Lazy-loaded routes for the cases feature
 */
import { Routes } from '@angular/router';
import { CaseListComponent } from './case-list/case-list.component';
import { CaseFormComponent } from './case-form/case-form.component';
import { CaseDetailComponent } from './case-detail/case-detail.component';

export const casesRoutes: Routes = [
  {
    path: '',
    component: CaseListComponent
  },
  {
    path: 'new',
    component: CaseFormComponent
  },
  {
    path: 'new/:clientId',
    component: CaseFormComponent
  },
  {
    path: ':id',
    component: CaseDetailComponent
  },
  {
    path: ':id/edit',
    component: CaseFormComponent
  }
];

