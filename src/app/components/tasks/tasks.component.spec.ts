import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TasksComponent } from './tasks.component';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { TaskFormComponent } from '../task-form/task-form.component';
import { TaskListComponent } from '../task-list/task-list.component';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TasksComponent', () => {
  let component: TasksComponent;
  let fixture: ComponentFixture<TasksComponent>;
  let taskService: jasmine.SpyObj<TaskService>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  const mockUser = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com'
  };

  const mockTasks = [
    { id: 5, title: 'Task 1', description: 'Description 1' },
    { id: 6, title: 'Task 2', description: 'Description 2' }
  ];

  beforeEach(async () => {
    
    const taskServiceSpy = jasmine.createSpyObj('TaskService', ['getTasks']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['logout']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    
    taskServiceSpy.getTasks.and.returnValue(of(mockTasks));

    await TestBed.configureTestingModule({
      imports: [
        TasksComponent,
        TaskFormComponent,
        TaskListComponent,
        HttpClientTestingModule
      ],
      providers: [
        { provide: TaskService, useValue: taskServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TasksComponent);
    component = fixture.componentInstance;
    taskService = TestBed.inject(TaskService) as jasmine.SpyObj<TaskService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    
    localStorage.setItem('user', JSON.stringify(mockUser));
    component.loadUser();
    fixture.detectChanges();
  });

  xit('should load tasks on initialization', fakeAsync(() => {
    taskService.getTasks.calls.reset();

    component.ngOnInit();
    tick();
    fixture.detectChanges();

    expect(taskService.getTasks).toHaveBeenCalled();
    expect(component.tasks).toEqual(mockTasks);
  }));

  xit('should reload tasks when task is added', fakeAsync(() => {
    taskService.getTasks.calls.reset();

    component.handleTaskAdded();
    tick();
    fixture.detectChanges();

    expect(taskService.getTasks).toHaveBeenCalledTimes(1);
  }));

  xit('should handle error when loading tasks', fakeAsync(() => {
    const consoleSpy = spyOn(console, 'error');
    const testError = new Error('Test error');
    taskService.getTasks.and.returnValue(throwError(() => testError));

    component.loadTasks();
    tick();
    fixture.detectChanges();

    expect(consoleSpy).toHaveBeenCalledWith('Error loading tasks:', testError);
    expect(component.tasks).toEqual([]);
  }));


  it('should load user from localStorage on init', () => {
    component.user = null;
    localStorage.setItem('user', JSON.stringify(mockUser));

    component.loadUser();
    fixture.detectChanges();

    expect(component.user as any).toEqual(mockUser);
  });

  it('should handle logout', () => {
    component.logout();

    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  afterEach(() => {
    localStorage.clear();
  });
});
