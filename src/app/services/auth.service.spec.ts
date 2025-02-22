import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('debe hacer login y almacenar el token', () => {
    const mockResponse = { token: 'fake-token', user: { id: 1 } };
    
    service.login({ email: 'test@example.com', password: '123456' }).subscribe();
    
    const req = httpMock.expectOne('http://localhost:3000/auth/login');
    req.flush(mockResponse);
    
    expect(localStorage.getItem('token')).toBe('fake-token');
  });
});