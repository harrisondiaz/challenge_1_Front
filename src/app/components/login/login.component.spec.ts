import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';


describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: { login: jasmine.createSpy() } },
        { provide: Router, useValue: { navigate: jasmine.createSpy() } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe bloquear el envío con formulario inválido', () => {
    component.credentials = { email: '', password: '' };
    component.onSubmit(new Event('submit'));
    expect(authService.login).not.toHaveBeenCalled();
  });

  it('debe navegar a /tasks al iniciar sesión correctamente', () => {
    component.credentials = { email: 'test@example.com', password: '123456' };
    (authService.login as jasmine.Spy).and.returnValue({ subscribe: (callback: any) => callback({}) });
    
    component.onSubmit(new Event('submit'));
    expect(router.navigate).toHaveBeenCalledWith(['/tasks']);
  });
});