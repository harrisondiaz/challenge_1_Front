import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        ReactiveFormsModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form', () => {
    expect(component.loginForm.get('email')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
    expect(component.loginForm.valid).toBeFalse();
  });

  it('should validate required fields', () => {
    const form = component.loginForm;
    
    expect(form.get('email')?.errors?.['required']).toBeTrue();
    expect(form.get('password')?.errors?.['required']).toBeTrue();
  });

  it('should validate email format', () => {
    const emailControl = component.loginForm.get('email');
    
    emailControl?.setValue('invalid-email');
    expect(emailControl?.errors?.['email']).toBeTrue();

    emailControl?.setValue('valid@email.com');
    expect(emailControl?.errors?.['email']).toBeFalsy();
  });

  it('should show error message for invalid form submission', async () => {
    const swalSpy = spyOn(Swal, 'fire');
    const event = new Event('submit');
    spyOn(event, 'preventDefault');

    await component.onSubmit(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(swalSpy).toHaveBeenCalledWith(jasmine.objectContaining({
      icon: 'warning',
      title: 'Campos inválidos',
      text: 'Por favor completa todos los campos',
      confirmButtonColor: '#3B82F6'
    }));
    expect(authService.login).not.toHaveBeenCalled();
  });

  it('should handle successful login', fakeAsync(() => {
    const mockResponse = {
      token: 'fake-token',
      user: { id: 1, name: 'Test User', email: 'test@example.com' }
    };
    authService.login.and.returnValue(of(mockResponse));
    const toastSpy = spyOn(Swal, 'mixin').and.returnValue(jasmine.createSpyObj('Toast', ['fire']));
    
    const event = new Event('submit');
    spyOn(event, 'preventDefault');

    component.loginForm.setValue({
      email: 'test@example.com',
      password: '123456'
    });

    component.onSubmit(event);
    tick(1500);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(authService.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: '123456'
    });
    expect(router.navigate).toHaveBeenCalledWith(['/tasks']);
  }));

  it('should handle login error', async () => {
    const errorResponse = { status: 401 };
    authService.login.and.returnValue(throwError(() => errorResponse));
    const swalSpy = spyOn(Swal, 'fire');

    const event = new Event('submit');
    spyOn(event, 'preventDefault');

    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'wrong-password'
    });

    await component.onSubmit(event);

    expect(authService.login).toHaveBeenCalled();
    expect(swalSpy).toHaveBeenCalledWith(jasmine.objectContaining({
      icon: 'error',
      title: 'Error',
      text: 'Credenciales incorrectas',
      confirmButtonColor: '#EF4444',
      didClose: jasmine.any(Function)
    }));
  });

  it('should navigate to register page', () => {
    component.goToRegister();
    expect(router.navigate).toHaveBeenCalledWith(['/register']);
  });
});