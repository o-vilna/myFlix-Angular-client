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
  user: any = {};
  favoriteMovies: any[] = [];
  movies: any[] = [];
  newPassword: string = '';

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getUser();
    this.getAllMovies();
  }

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
        // Пошук користувача за ім'ям
        const currentUser = data.find((u: any) => u.Username === username);
        if (currentUser) {
          this.user = currentUser;
          // Видаляємо пароль з об'єкта користувача
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

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }

  updateUserProfile(): void {
    // Не логуйте об'єкт користувача з паролем
    console.log('Updating user profile for:', this.user.Username);
    
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('user');
    
    if (!token || !username) {
      this.snackBar.open('Authentication error', 'OK', {
        duration: 2000
      });
      return;
    }

    // Підготовка даних для оновлення
    const userData = { ...this.user };
    
    // Додаємо новий пароль до даних користувача, якщо він був введений
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
        // Очищаємо поле нового пароля після успішного оновлення
        this.newPassword = '';
      })
      .catch((error) => {
        console.error('Error updating profile:', error);
        this.snackBar.open('Error updating profile: ' + error.message, 'OK', {
          duration: 2000
        });
      });
  }

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