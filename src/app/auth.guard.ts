import { Injectable } from '@angular/core';
import { CanActivate,  Router } from '@angular/router';
import {AuthService} from './shared/services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    if (this.authService.currentUserSig()) { // Check if user is logged in
      return true; // Allow access
    } else {
      await this.router.navigate(['/login']); // Redirect to login page
      return false; // Block access
    }
  }
}
