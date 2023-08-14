import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes,
} from '@angular/router';

import { AppPrelodingStrategyService } from './app-preloding-strategy.service';
import { EmployeeGuard } from './core/guards/employee.guard';

const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
    canMatch: [EmployeeGuard],
  },
  {
    path: '', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
    data: { preload: true }
  },
  { 
    path: '**', 
    loadComponent: () => import('./page-not-found/page-not-found.component').then(m => m.PageNotFoundComponent),
    data: { preload: true }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: AppPrelodingStrategyService,
    scrollPositionRestoration: "enabled"
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
