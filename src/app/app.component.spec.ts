import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

interface Task {
  id: number;
  title: string;
  description: string;
}

describe('AppComponent', () => {
  let authServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    authServiceMock = {
      currentUser$: new BehaviorSubject(null),
      logout: jasmine.createSpy('logout')
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should update isAuthenticated when user changes', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    
    expect(app.isAuthenticated).toBeFalse();
    
    authServiceMock.currentUser$.next({ id: 1, name: 'Test User' });
    expect(app.isAuthenticated).toBeTrue();
  });
});