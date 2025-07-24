import { Component, inject } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button'; // Import the module for standalone
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-welcome',
  standalone: true, // FIX: Add standalone flag
  templateUrl: './welcome.component.html',
  imports: [
    RouterLink,
    MatButtonModule, // FIX: Import the module, not the component
    NgOptimizedImage
  ],
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent {
  // Using inject() is a great modern practice!
  authService = inject(AuthService);

  // The constructor and ngOnInit are no longer needed here.
  // The logic from ngOnInit should be moved into the AuthService.
}
