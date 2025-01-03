import {Component, inject, OnInit} from '@angular/core';
import { CommonModule} from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {AuthService} from './shared/services/auth.service';
import {FooterComponent} from './footer/footer.component'
import {HeaderComponent} from './navigation/header/header.component';


@Component({
    selector: 'app-root',
    imports: [CommonModule, RouterOutlet, FooterComponent,HeaderComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  authService = inject(AuthService);
  http = inject(HttpClient)
  title = 'dolphin-sightings-app';

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

  logout(): void{
   this.authService.logout();
  }
}

