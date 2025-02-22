import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule]
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('password_confirmation');
    return password && confirmPassword && password.value === confirmPassword.value ? 
      null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.showFormErrors();
      return;
    }

    this.loading = true;
    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: '¡Registro exitoso!',
          text: 'Ya puedes iniciar sesión',
          confirmButtonColor: '#10B981'
        }).then(() => {
          this.router.navigate(['/login']);
        });
      },
      error: (err) => this.handleError(err),
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
    if (this.registerForm.errors?.['passwordMismatch']) {
      return 'Las contraseñas no coinciden';
    }
    if (this.registerForm.get('name')?.errors?.['required']) {
      return 'El nombre es requerido';
    }
    if (this.registerForm.get('email')?.errors?.['required']) {
      return 'El email es requerido';
    }
    if (this.registerForm.get('email')?.errors?.['email']) {
      return 'El email no es válido';
    }
    if (this.registerForm.get('password')?.errors?.['minlength']) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    return 'Por favor revisa los campos del formulario';
  }

  private handleError(err: any): void {
    console.log("Error", err);  
    const errorMessage = err.error?.message || 'Error en el registro';
    Swal.fire({
      title: 'Error',
      text: errorMessage,
      icon: 'error',
      confirmButtonColor: '#dc2626'
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}