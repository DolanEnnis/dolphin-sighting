import { Routes } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', component: WelcomeComponent },
  {
    path: 'register',
    loadComponent: () =>
      import('./auth/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'reports',
    loadComponent: () =>
      import('./reports/reports.component').then((m) => m.ReportsComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'sightingForm',
    loadComponent: () =>
      import('./sighting-form/sighting-form.component').then(
        (m) => m.SightingFormComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'map',
    loadComponent: () =>
      import('./map/map.component').then((m) => m.MapComponent),
    canActivate: [AuthGuard],
  },
  // Redirect any other path to the welcome page
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

