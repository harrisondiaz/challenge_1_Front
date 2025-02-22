import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['register']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        RegisterComponent,
        ReactiveFormsModule,
        RouterModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form', () => {
    expect(component.registerForm.get('name')?.value).toBe('');
    expect(component.registerForm.get('email')?.value).toBe('');
    expect(component.registerForm.get('password')?.value).toBe('');
    expect(component.registerForm.get('password_confirmation')?.value).toBe('');
    expect(component.registerForm.valid).toBeFalse();
  });

  it('should validate required fields', () => {
    const form = component.registerForm;
    
    expect(form.get('name')?.errors?.['required']).toBeTrue();
    expect(form.get('email')?.errors?.['required']).toBeTrue();
    expect(form.get('password')?.errors?.['required']).toBeTrue();
    expect(form.get('password_confirmation')?.errors?.['required']).toBeTrue();
  });

  it('should validate email format', () => {
    const emailControl = component.registerForm.get('email');
    
    emailControl?.setValue('invalid-email');
    expect(emailControl?.errors?.['email']).toBeTrue();

    emailControl?.setValue('valid@email.com');
    expect(emailControl?.errors?.['email']).toBeFalsy();
  });

  it('should validate password match', () => {
    const form = component.registerForm;
    
    form.get('password')?.setValue('123456');
    form.get('password_confirmation')?.setValue('123457');
    expect(form.errors?.['passwordMismatch']).toBeTrue();

    form.get('password_confirmation')?.setValue('123456');
    expect(form.errors?.['passwordMismatch']).toBeFalsy();
  });

  it('should show success message and navigate to login on successful register', async () => {
    const mockResponse = { message: 'Registration successful' };
    authService.register.and.returnValue(of(mockResponse));
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true } as any));

    component.registerForm.setValue({
      name: 'Test User',
      email: 'test@example.com',
      password: '123456',
      password_confirmation: '123456'
    });

    await component.onSubmit();

    expect(authService.register).toHaveBeenCalled();
    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
      icon: 'success',
      title: '¡Registro exitoso!',
      text: 'Ya puedes iniciar sesión',
      confirmButtonColor: '#10B981'
    }));
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should show error message on registration failure', async () => {
    const errorResponse = new Error('Registration failed');
    authService.register.and.returnValue(throwError(() => errorResponse));
    spyOn(Swal, 'fire');

    component.registerForm.setValue({
      name: 'Test User',
      email: 'test@example.com',
      password: '123456',
      password_confirmation: '123456'
    });

    await component.onSubmit();

    expect(authService.register).toHaveBeenCalled();
    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
      title: 'Error',
      text: 'Error en el registro',
      icon: 'error',
      confirmButtonColor: '#dc2626'
    }));
  });

  it('should navigate to login page', () => {
    component.goToLogin();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
