import { Routes } from '@angular/router';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import {WelcomeComponent} from './welcome/welcome.component';
import {ReportsComponent} from './reports/reports.component';
import {TestpageComponent} from './testpage/testpage.component';
import {AuthGuard} from './auth.guard';
// Assuming you have LoginComponent

export const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'reports', component: ReportsComponent, canActivate: [AuthGuard] },
  { path: 'test', component: TestpageComponent, canActivate: [AuthGuard]},
  // ... other routes
];

