import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { BaseService } from './base.service';
import { first } from 'rxjs/operators';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: Router;
  let baseService: jasmine.SpyObj<BaseService>;

  const mockUser = {
    id: 2,
    name: 'Test User',
    email: 'test@example.com'
  };

  const mockLoginResponse = {
    token: 'fake-token',
    user: mockUser
  };

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const baseServiceSpy = jasmine.createSpyObj('BaseService', ['getApiUrl']);
    baseServiceSpy.getApiUrl.and.returnValue('http://localhost:3000');

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: routerSpy },
        { provide: BaseService, useValue: baseServiceSpy }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    baseService = TestBed.inject(BaseService) as jasmine.SpyObj<BaseService>;
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login successfully', () => {
    const credentials = { email: 'test@example.com', password: '123456' };
    
    service.login(credentials).subscribe((response) => {
      expect(response).toEqual(mockLoginResponse);
      expect(localStorage.getItem('token')).toBe('fake-token');
      expect(localStorage.getItem('user')).toBe(JSON.stringify(mockUser));
      expect(router.navigate).toHaveBeenCalledWith(['/tasks']);
    });

    const req = httpMock.expectOne('http://localhost:3000/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockLoginResponse);
  });

  it('should register successfully', () => {
    const userData = { 
      name: 'Test User', 
      email: 'test@example.com', 
      password: '123456' 
    };

    service.register(userData).subscribe(() => {
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

    const req = httpMock.expectOne('http://localhost:3000/auth/register');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should logout correctly', () => {
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('user', JSON.stringify(mockUser));

    service.logout();

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should check authentication status correctly', () => {
    expect(service.isAuthenticated()).toBeFalse();
    
    localStorage.setItem('token', 'fake-token');
    expect(service.isAuthenticated()).toBeTrue();
    
    localStorage.removeItem('token');
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('should load initial user on construction', (done) => {
    localStorage.clear();
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('user', JSON.stringify(mockUser));

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) },
        { 
          provide: BaseService, 
          useValue: jasmine.createSpyObj('BaseService', ['getApiUrl'], {
            getApiUrl: () => 'http://localhost:3000'
          })
        }
      ]
    });

    const newService = TestBed.inject(AuthService);
    
    newService.currentUser$.subscribe(user => {
      expect(user).toEqual(mockUser);
      done();
    });
  });
});