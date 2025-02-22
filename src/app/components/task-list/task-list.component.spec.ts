import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskListComponent } from './task-list.component';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task';
import { of } from 'rxjs';
import Swal from 'sweetalert2';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let taskService: jasmine.SpyObj<TaskService>;

  const mockTasks: Task[] = [
    { id: 1, title: 'Task 1', description: 'Description 1' },
    { id: 2, title: 'Task 2', description: 'Description 2' }
  ];

  beforeEach(async () => {
    const taskServiceSpy = jasmine.createSpyObj('TaskService', ['deleteTask']);
    taskServiceSpy.deleteTask.and.returnValue(of(void 0));

    await TestBed.configureTestingModule({
      imports: [
        TaskListComponent,
        HttpClientTestingModule
      ],
      providers: [
        { provide: TaskService, useValue: taskServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    taskService = TestBed.inject(TaskService) as jasmine.SpyObj<TaskService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display tasks when provided', () => {
    component.tasks = mockTasks;
    fixture.detectChanges();

    const taskElements = fixture.nativeElement.querySelectorAll('.border-b');
    expect(taskElements.length).toBe(2);
    expect(taskElements[0].textContent).toContain('Task 1');
    expect(taskElements[0].textContent).toContain('Description 1');
  });

  it('should show empty state when no tasks', () => {
    component.tasks = [];
    fixture.detectChanges();

    const emptyMessage = fixture.nativeElement.querySelector('.text-gray-500');
    expect(emptyMessage.textContent).toContain('¡No hay tareas pendientes!');
  });

  it('should confirm and delete task', async () => {
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true } as any));
    component.tasks = [...mockTasks];

    await component.confirmDelete(1);
    fixture.detectChanges();

    expect(taskService.deleteTask).toHaveBeenCalledWith(1);
    expect(component.tasks.length).toBe(1);
    expect(component.tasks[0].id).toBe(2);
  });

  it('should not delete task when confirmation is cancelled', async () => {
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: false } as any));
    component.tasks = [...mockTasks];

    await component.confirmDelete(1);
    fixture.detectChanges();

    expect(taskService.deleteTask).not.toHaveBeenCalled();
    expect(component.tasks.length).toBe(2);
  }
  );
}
);

