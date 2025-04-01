import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

//Declaring the api url that will provide data for the client app
const apiUrl = 'https://star-flix-5d32add713bf.herokuapp.com/';

@Injectable({
  providedIn: 'root'
})
export class FetchApiDataService {
  // Inject the HttpClient module to the constructor params
  // This will provide HttpClient to the entire class, making it available via this.http
  constructor(private http: HttpClient) { }

  // Making the api call for the user registration endpoint
  public userRegistration(userDetails: any): Observable<any> {
    console.log('Registering user:', userDetails);
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  // Making the api call for the user login endpoint
  public userLogin(userDetails: any): Observable<any> {
    console.log('Logging in user:', userDetails);
    return this.http.post(apiUrl + 'login', userDetails).pipe(
      map((response) => {
        console.log('Raw login response:', response);
        const result = this.extractResponseData(response);
        console.log('Processed login response:', result);
        if (result.user && result.token) {
          // Зберігаємо дані в localStorage
          localStorage.setItem('user', result.user.Username);
          localStorage.setItem('token', result.token);
          localStorage.setItem('userData', JSON.stringify(result.user));
        }
        return result;
      }),
      catchError(this.handleError)
    );
  }

  // Making the api call for getting all movies endpoint
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

  // Making the api call for getting user endpoint
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
        // Знаходимо поточного користувача
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
    console.log('Getting favorite movies for:', username);
    console.log('Using token:', token);
    
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

  // Making the api call for adding a movie to favorite Movies endpoint
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
    console.log('Extracting response data:', res);
    const body = res;
    return body || { };
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` +
        `Error body is: ${error.error}`
      );
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}
