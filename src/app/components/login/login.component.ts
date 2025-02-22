import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule]
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;

  private Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });
  credentials: { email: string; password: string; } | undefined;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    console.log('Form values:', this.loginForm.value); // 🐛 Debug
    
    if (this.loginForm.invalid) {
      this.showFormErrors();
      return;
    }

    this.loading = true;

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.Toast.fire({
          icon: "success",
          title: `¡Bienvenido ${response.user.name}!`
        });
        
        setTimeout(() => {
          this.router.navigate(['/tasks']);
        }, 1500);
      },
      error: (err) => {
        this.loading = false;
        this.handleLoginError(err);
      },
      complete: () => this.loading = false
    });
  }

  private showFormErrors(): void {
    Swal.fire({
      icon: 'warning',
      title: 'Campos inválidos',
      text: this.getFormErrorMessage(),
      confirmButtonColor: '#3B82F6'
    });
  }

  private getFormErrorMessage(): string {
    if (this.loginForm.get('email')?.hasError('required') || 
        this.loginForm.get('password')?.hasError('required')) {
      return 'Por favor completa todos los campos';
    }
    if (this.loginForm.get('email')?.hasError('email')) {
      return 'Por favor ingresa un email válido';
    }
    return 'Por favor revisa los campos del formulario';
  }

  private handleLoginError(err: any): void {
    let errorMessage = 'Error al iniciar sesión';
    
    if (err.status === 401) {
      errorMessage = 'Credenciales incorrectas';
    } else if (err.status === 0) {
      errorMessage = 'Error de conexión con el servidor';
    }

    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: errorMessage,
      confirmButtonColor: '#EF4444',
      didClose: () => {
        this.loginForm.get('password')?.reset();
      }
    });
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}