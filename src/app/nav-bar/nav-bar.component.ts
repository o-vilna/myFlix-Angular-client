import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule]
})
export class NavBarComponent {
  constructor(private router: Router) {}

  goToProfile(): void {
    this.router.navigate(['profile']);
  }

  goToMovies(): void {
    this.router.navigate(['movies']);
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['welcome']);
  }
} 