import { Component, EventEmitter, inject, Output } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [MatListModule, RouterLink],
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent {
  // This will emit an event that the parent component (AppComponent) can listen for.
  @Output() closeSidenav = new EventEmitter<void>();

  authService = inject(AuthService);
  router = inject(Router); // Inject the Router

  // This single method will be called by all links to emit the event.
  onClose(): void {
    this.closeSidenav.emit();
  }

  // The logout method handles the auth logic and also closes the sidenav.
  logout(): void {
    // FIX: Subscribe to the logout observable and navigate on completion.
    this.authService.logout().subscribe(() => {
      this.onClose(); // Close the sidenav first
      this.router.navigateByUrl('/'); // Then navigate to the welcome page
    });
  }
}
