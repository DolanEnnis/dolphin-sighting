import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule} from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './shared/services/auth.service';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './navigation/header/header.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { SidenavComponent } from './navigation/sidenav/sidenav.component';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    FooterComponent,
    HeaderComponent,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    SidenavComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
// FIX: Removed "implements OnInit" as it's no longer needed.
export class AppComponent {
  // The authService is injected but no longer needs to be explicitly used in the component's class.
  // It's available for child components and routing.
  authService = inject(AuthService);
  title = 'dolphin-sightings-app';

  @ViewChild('drawer') drawer!: MatSidenav;


  // The AuthService now correctly manages its own state.


  // This action is already handled cleanly within the HeaderComponent.
}

