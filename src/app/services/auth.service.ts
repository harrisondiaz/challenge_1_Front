import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

// Mejor: Definir interfaz de Usuario
interface User {
  id: number;
  name: string;
  email: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.loadInitialUser();
  }

  private loadInitialUser(): void {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      try {
        const parsedUser: User = JSON.parse(user);
        this.currentUserSubject.next(parsedUser);
      } catch (e) {
        console.error('Error parsing user data:', e);
        this.clearAuthData();
      }
    }
  }

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap((response) => {
          this.storeAuthData(response);

          this.currentUserSubject.next(response.user);

          this.router.navigate(['/tasks']);

          Swal.fire({
            title: '¡Bienvenido!',
            text: 'Inicio de sesión exitoso',
            icon: 'success',
            timer: 1500,
          });
        }),
        catchError((error) => {
          this.handleAuthError('Error durante el inicio de sesión');
          this.clearAuthData();
          return throwError(() => error);
        })
      );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData).pipe(
      tap(() => {
        Swal.fire({
          title: '¡Registro exitoso!',
          text: 'Ahora puedes iniciar sesión',
          icon: 'success',
        });
        this.router.navigate(['/login']);
      }),
      catchError((error) => {
        this.handleAuthError('Error durante el registro');
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    this.clearAuthData();
    this.currentUserSubject.next(null);
    Swal.fire({
      title: 'Sesión cerrada',
      text: 'Hasta pronto!',
      icon: 'info',
    });
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  private storeAuthData(response: LoginResponse): void {
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
  }

  private clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  private handleAuthError(defaultMessage: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: defaultMessage,
      confirmButtonColor: '#dc2626',
    });
  }
}
