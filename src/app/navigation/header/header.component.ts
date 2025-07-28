import { Component, computed, inject, Output, EventEmitter } from '@angular/core'; // Import Output & EventEmitter
import { AuthService } from '../../shared/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; // Import MatIconModule
import { UserInterface } from '../../shared/types/userInterface';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  imports: [
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule // Add MatIconModule here
  ],
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  // Create an event emitter that the parent component (AppComponent) can listen to.
  @Output() toggleSidenav = new EventEmitter<void>();
  router = inject(Router); // Inject the Router

  authService = inject(AuthService);

  loggedInUsername = computed<string | undefined>(() => {
    const user: UserInterface | null = this.authService.currentUserSig();
    if (user) {
      return user.username;
    }
    return undefined;
  });


  logout(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigateByUrl('/');
    });
  }

  //  Add a method to be called by the button click, which emits the event.
  onToggleSidenav(): void {
    this.toggleSidenav.emit();
  }
}
