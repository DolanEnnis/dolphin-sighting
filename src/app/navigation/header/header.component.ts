import { Component,inject, OnInit } from '@angular/core';
//import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import {RouterLink} from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';



@Component({
  selector: 'app-header',
  //imports: [ RouterOutlet, RouterLink],
  templateUrl: './header.component.html',
  imports: [
    RouterLink,MatToolbarModule,MatButtonModule
  ],
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  authService = inject(AuthService);

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
