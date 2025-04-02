import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

/**
 * Component for displaying and managing user profile
 * @component UserProfileComponent
 */
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class UserProfileComponent implements OnInit {
  /**
   * User data object
   */
  user: any = {};

  /**
   * Array of favorite movies
   */
  favoriteMovies: any[] = [];

  /**
   * Array of all movies
   */
  movies: any[] = [];

  /**
   * New password input
   */
  newPassword: string = '';

  /**
   * Creates an instance of UserProfileComponent
   * @param fetchApiData Service for API calls
   * @param snackBar Service for showing notifications
   * @param router Router for navigation
   * @param dialog Dialog service for showing dialogs
   */
  constructor(
    private fetchApiData: FetchApiDataService,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog
  ) {}

  /**
   * Lifecycle hook that is called after data-bound properties are initialized
   */
  ngOnInit(): void {
    this.getUser();
    this.getAllMovies();
  }

  /**
   * Fetches user profile data
   */
  getUser(): void {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('user');
    
    if (!token || !username) {
      this.router.navigate(['welcome']);
      return;
    }

    fetch(`https://star-flix-5d32add713bf.herokuapp.com/users`, {
      method: "GET",
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
      })
      .then((data) => {
        // Find user by username
        const currentUser = data.find((u: any) => u.Username === username);
        if (currentUser) {
          this.user = currentUser;
          // Remove password from user object
          delete this.user.Password;
          console.log('User data:', this.user);
        } else {
          throw new Error('User not found');
        }
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
        this.snackBar.open('Error loading user data: ' + error.message, 'OK', {
          duration: 2000
        });
      });
  }

  /**
   * Fetches all movies
   */
  getAllMovies(): void {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return;
    }

    fetch('https://star-flix-5d32add713bf.herokuapp.com/movies', {
      method: "GET",
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
      })
      .then((data) => {
        this.movies = data;
        this.getFavoriteMovies();
      })
      .catch((error) => {
        console.error('Error fetching movies:', error);
        this.snackBar.open('Error loading movies: ' + error.message, 'OK', {
          duration: 2000
        });
      });
  }

  /**
   * Fetches favorite movies
   */
  getFavoriteMovies(): void {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('user');
    
    if (!token || !username) {
      return;
    }

    fetch(`https://star-flix-5d32add713bf.herokuapp.com/users/${username}/movies`, {
      method: "GET",
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
      })
      .then((data) => {
        const favoriteMovieIds = data.FavoriteMovies || [];
        this.favoriteMovies = this.movies.filter(movie => 
          favoriteMovieIds.includes(movie._id)
        );
        console.log('Favorite movies:', this.favoriteMovies);
      })
      .catch((error) => {
        console.error('Error fetching favorite movies:', error);
        this.snackBar.open('Error loading favorite movies: ' + error.message, 'OK', {
          duration: 2000
        });
      });
  }

  /**
   * Formats date
   * @param dateString Date string to format
   * @returns Formatted date string
   */
  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }

  /**
   * Updates user profile
   */
  updateUserProfile(): void {
    // Do not log user object with password
    console.log('Updating user profile for:', this.user.Username);
    
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('user');
    
    if (!token || !username) {
      this.snackBar.open('Authentication error', 'OK', {
        duration: 2000
      });
      return;
    }

    // Prepare data for update
    const userData = { ...this.user };
    
    // Add new password to user data if entered
    if (this.newPassword) {
      userData.Password = this.newPassword;
    }

    fetch(`https://star-flix-5d32add713bf.herokuapp.com/users/${username}`, {
      method: "PUT",
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
      })
      .then((data) => {
        localStorage.setItem('userData', JSON.stringify(data));
        this.snackBar.open('Profile updated successfully', 'OK', {
          duration: 2000
        });
        // Clear new password field after successful update
        this.newPassword = '';
      })
      .catch((error) => {
        console.error('Error updating profile:', error);
        this.snackBar.open('Error updating profile: ' + error.message, 'OK', {
          duration: 2000
        });
      });
  }

  /**
   * Deletes user profile
   */
  deleteUserProfile(): void {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      const token = localStorage.getItem('token');
      const username = localStorage.getItem('user');
      
      if (!token || !username) {
        this.snackBar.open('Authentication error', 'OK', {
          duration: 2000
        });
        return;
      }

      fetch(`https://star-flix-5d32add713bf.herokuapp.com/users/${username}`, {
        method: "DELETE",
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      })
        .then((response) => {
          if (response.ok) {
            this.snackBar.open('User deleted successfully', 'OK', {
              duration: 2000
            });
            localStorage.clear();
            this.router.navigate(['welcome']);
          } else {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
          }
        })
        .catch((error) => {
          console.error('Error deleting account:', error);
          this.snackBar.open('Error deleting account: ' + error.message, 'OK', {
            duration: 2000
          });
        });
    }
  }

  /**
   * Removes movie from favorites
   * @param movieId ID of the movie to remove
   */
  removeFromFavorites(movieId: string): void {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('user');
    
    if (!token || !username) {
      this.snackBar.open('Authentication error', 'OK', {
        duration: 2000
      });
      return;
    }

    fetch(`https://star-flix-5d32add713bf.herokuapp.com/users/${username}/movies/${movieId}`, {
      method: "DELETE",
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        if (response.ok) {
          this.snackBar.open('Movie removed from favorites', 'OK', {
            duration: 2000
          });
          this.getFavoriteMovies();
        } else {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
      })
      .catch((error) => {
        console.error('Error removing from favorites:', error);
        this.snackBar.open('Error removing from favorites: ' + error.message, 'OK', {
          duration: 2000
        });
      });
  }
} 