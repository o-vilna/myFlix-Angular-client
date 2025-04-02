import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { CommonModule } from '@angular/common';

/**
 * Root component of the application
 * @component AppComponent
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavBarComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  /**
   * Title of the application
   */
  title = 'myFlix-Angular-client';

  /**
   * Flag indicating whether user is logged in
   */
  isLoggedIn: boolean = false;

  /**
   * Creates an instance of AppComponent
   * @param router Service for navigation
   */
  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const token = localStorage.getItem('token');
        this.isLoggedIn = !!token;
      }
    });
  }
}
