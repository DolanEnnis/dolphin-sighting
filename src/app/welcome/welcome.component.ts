import {Component, inject, OnInit} from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import {RouterLink} from '@angular/router';
import {MatButton} from '@angular/material/button';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  imports: [
    RouterLink,
    MatButton,
    NgOptimizedImage
  ],
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  authService = inject(AuthService);

  constructor() {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user: any) => {
      if (user) {
        this.authService.currentUserSig.set({
          email: user.email!,
          username: user.displayName!,
        });
      } else {
        this.authService.currentUserSig.set(null);
      }
      console.log(this.authService.currentUserSig());
    });
  }
}
