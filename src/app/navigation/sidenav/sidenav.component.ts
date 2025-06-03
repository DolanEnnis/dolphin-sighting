import { Component, inject,Input, OnInit } from '@angular/core';
import { AuthService } from "../../shared/services/auth.service";
import {MatListModule} from "@angular/material/list";
import {MatButtonModule} from "@angular/material/button";
import {RouterLink} from "@angular/router";
import { MatDrawer } from '@angular/material/sidenav'; // Import MatDrawer


@Component({
  selector: 'app-sidenav',
  imports: [MatListModule, MatButtonModule,MatDrawer, RouterLink],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent implements OnInit {

  @Input() drawer!: MatDrawer;


  authService = inject(AuthService);

  ngOnInit(): void {
    // You might not need anything specific here for this functionality
  }

  logout(): void {
    this.authService.logout();
  }
}
