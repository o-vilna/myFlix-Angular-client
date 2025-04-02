import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

//Declaring the api url that will provide data for the client app
const apiUrl = 'https://star-flix-5d32add713bf.herokuapp.com/';

/**
 * Service for handling all API calls to the myFlix backend
 * @service FetchApiDataService
 */
@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService {
  /**
   * Creates an instance of FetchApiDataService
   * @param http The HttpClient for making API calls
   * @param router The Router for navigation
   * @param snackBar The MatSnackBar for showing notifications
   */
  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  /**
   * User registration
   * @param userDetails Object containing user registration details
   * @returns Observable containing the API response
   */
  public userRegistration(userDetails: any): Observable<any> {
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * User login
   * @param userDetails Object containing user login credentials
   * @returns Observable containing the API response
   */
  public userLogin(userDetails: any): Observable<any> {
    console.log('Logging in user:', userDetails);
    return this.http.post(apiUrl + 'login', userDetails).pipe(
      map((response) => {
        console.log('Raw login response:', response);
        const result = this.extractResponseData(response);
        console.log('Processed login response:', result);
        if (result.user && result.token) {
          // Store data in localStorage
          localStorage.setItem('user', result.user.Username);
          localStorage.setItem('token', result.token);
          localStorage.setItem('userData', JSON.stringify(result.user));
          console.log('User successfully authenticated');
        }
        return result;
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Get all movies
   * @returns Observable containing array of all movies
   */
  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError(() => new Error('No auth token found'));
    }
    return this.http.get(apiUrl + 'movies', {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Making the api call for getting one movie endpoint
  getOneMovie(title: string): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError(() => new Error('No auth token found'));
    }
    return this.http.get(apiUrl + 'movies/' + title, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Making the api call for getting one director endpoint
  getOneDirector(directorName: string): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError(() => new Error('No auth token found'));
    }
    return this.http.get(apiUrl + 'movies/director/' + directorName, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Making the api call for getting one genre endpoint
  getOneGenre(genreName: string): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError(() => new Error('No auth token found'));
    }
    return this.http.get(apiUrl + 'movies/genre/' + genreName, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Get user profile
   * @returns Observable containing user details
   */
  getUser(): Observable<any> {
    const token = localStorage.getItem('token');
    console.log('Getting users data');
    console.log('Using token:', token);
    
    if (!token) {
      console.error('Missing token');
      return throwError(() => new Error('No auth token found'));
    }

    return this.http.get(apiUrl + 'users', {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      })
    }).pipe(
      map((response) => {
        console.log('Raw users response:', response);
        const result = this.extractResponseData(response);
        console.log('Processed users response:', result);
        // Find the current user
        const username = localStorage.getItem('user');
        const currentUser = result.find((user: any) => user.Username === username);
        console.log('Current user:', currentUser);
        return currentUser;
      }),
      catchError(this.handleError)
    );
  }

  // Making the api call for getting user's favorite movies endpoint
  getFavoriteMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('user');
  
    if (!token || !username) {
      console.error('Missing token or username');
      return throwError(() => new Error('No auth token or username found'));
    }

    return this.http.get(apiUrl + 'users/' + username + '/movies', {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Add movie to favorites
   * @param movieId ID of the movie to add to favorites
   * @returns Observable containing updated user details
   */
  addFavoriteMovie(movieId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('user');
    console.log('Adding favorite movie for:', username);
    console.log('Movie ID:', movieId);
    console.log('Using token:', token);
    
    if (!token || !username) {
      console.error('Missing token or username');
      return throwError(() => new Error('No auth token or username found'));
    }

    return this.http.post(apiUrl + 'users/' + username + '/movies/' + movieId, {}, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Making the api call for deleting a movie from the favorite movies endpoint
  deleteFavoriteMovie(movieId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('user');
    console.log('Deleting favorite movie for:', username);
    console.log('Movie ID:', movieId);
    console.log('Using token:', token);
    
    if (!token || !username) {
      console.error('Missing token or username');
      return throwError(() => new Error('No auth token or username found'));
    }

    return this.http.delete(apiUrl + 'users/' + username + '/movies/' + movieId, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Making the api call for editing user endpoint
  editUser(updatedUser: any): Observable<any> {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('user');
    console.log('Editing user:', username);
    console.log('Updated data:', updatedUser);
    console.log('Using token:', token);
    
    if (!token || !username) {
      console.error('Missing token or username');
      return throwError(() => new Error('No auth token or username found'));
    }

    return this.http.put(apiUrl + 'users/' + username, updatedUser, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Making the api call for deleting user endpoint
  deleteUser(): Observable<any> {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('user');
    console.log('Deleting user:', username);
    console.log('Using token:', token);
    
    if (!token || !username) {
      console.error('Missing token or username');
      return throwError(() => new Error('No auth token or username found'));
    }

    return this.http.delete(apiUrl + 'users/' + username, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Non-typed response extraction
  private extractResponseData(res: any): any {
    const body = res;
    return body || {};
  }

  private handleError(error: HttpErrorResponse): Observable<any> {
    // Ensure no sensitive data is logged
    
    // Replace logging with specific error fields
    console.error(`Error Status code ${error.status}, Error message: ${error.message}`);
    
    let errorMessage = 'Something went wrong; please try again later.';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 400) {
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else {
          errorMessage = 'Invalid login credentials or user does not exist';
        }
      } else if (error.status === 404) {
        errorMessage = 'User not found';
      } else if (error.status === 401) {
        errorMessage = 'Unauthorized access. Please login again';
      } else if (error.status === 403) {
        errorMessage = 'Access forbidden';
      } else if (error.status === 500) {
        errorMessage = 'Server error. Please try again later';
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }
}
