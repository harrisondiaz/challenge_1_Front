import { TestBed } from '@angular/core/testing';
import { TaskService } from './task.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BaseService } from './base.service';
import { Task } from '../models/task';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;
  let baseService: jasmine.SpyObj<BaseService>;

  const mockTask: Task = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
  };

  beforeEach(() => {
    const baseServiceSpy = jasmine.createSpyObj('BaseService', ['getApiUrl']);
    baseServiceSpy.getApiUrl.and.returnValue('http://localhost:3000');

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TaskService,
        { provide: BaseService, useValue: baseServiceSpy }
      ]
    });

    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
    baseService = TestBed.inject(BaseService) as jasmine.SpyObj<BaseService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all tasks', () => {
    const mockTasks: Task[] = [mockTask];

    service.getTasks().subscribe(tasks => {
      expect(tasks).toEqual(mockTasks);
    });

    const req = httpMock.expectOne('http://localhost:3000/tasks');
    expect(req.request.method).toBe('GET');
    req.flush(mockTasks);
  });

  it('should add a task', () => {
    const newTask: Omit<Task, 'id'> = {
      title: 'New Task',
      description: 'New Description',
    };

    service.addTask(newTask).subscribe(task => {
      expect(task).toEqual({ ...newTask, id: 1 });
    });

    const req = httpMock.expectOne('http://localhost:3000/tasks');
    expect(req.request.method).toBe('POST');
    req.flush({ ...newTask, id: 1 });
  });

  it('should delete a task', () => {
    service.deleteTask(1).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne('http://localhost:3000/tasks/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
