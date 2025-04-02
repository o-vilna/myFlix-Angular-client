import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

/**
 * Component for navigation bar
 * @component NavBarComponent
 * Provides navigation links and user actions like logout
 */
@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule]
})
export class NavBarComponent {
  /**
   * Creates an instance of NavBarComponent
   * @param router Service for navigation
   */
  constructor(private router: Router) {}

  /**
   * Navigates to user profile page
   */
  goToProfile(): void {
    this.router.navigate(['profile']);
  }

  /**
   * Navigates to movies page
   */
  goToMovies(): void {
    this.router.navigate(['movies']);
  }

  /**
   * Handles user logout
   * Clears localStorage and navigates to welcome page
   */
  logout(): void {
    localStorage.clear();
    this.router.navigate(['welcome']);
  }
} 