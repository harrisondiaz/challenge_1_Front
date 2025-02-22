import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: unknown, state: unknown): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    }

    Swal.fire({
      title: 'Acceso restringido',
      text: 'Debes iniciar sesión para acceder a esta página',
      icon: 'warning',
      confirmButtonColor: '#3085d6'
    });
    
    this.router.navigate(['/login']);
    return false;
  }
}