import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskListComponent } from './task-list.component';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let taskService: jasmine.SpyObj<TaskService>;

  const mockTasks: Task[] = [
    { id: 1, title: 'Task 1', description: 'Description 1', completed: false },
    { id: 2, title: 'Task 2', description: 'Description 2', completed: false }
  ];

  beforeEach(async () => {
    const taskServiceSpy = jasmine.createSpyObj('TaskService', [
      'deleteTask', 
      'getTasks',
      'updateTask',
      'toggleTaskComplete'  // Añadido este método
    ]);
    
    taskServiceSpy.deleteTask.and.returnValue(of({ message: 'Tarea eliminada' }));
    taskServiceSpy.getTasks.and.returnValue(of(mockTasks));
    taskServiceSpy.toggleTaskComplete.and.returnValue(of({ message: 'Tarea actualizada', completed: true }));

    await TestBed.configureTestingModule({
      imports: [
        TaskListComponent,
        HttpClientTestingModule,
        CommonModule,
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

  it('should handle error when deleting task', async () => {
    spyOn(Swal, 'fire').and.returnValues(
      Promise.resolve({ isConfirmed: true } as any),
      Promise.resolve({ isConfirmed: true } as any)
    );
    taskService.deleteTask.and.returnValue(throwError(() => new Error('Delete failed')));
    component.tasks = [...mockTasks];

    await component.confirmDelete(1);
    fixture.detectChanges();

    expect(taskService.deleteTask).toHaveBeenCalledWith(1);
    expect(component.tasks.length).toBe(2);
    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
      title: 'Error',
      text: 'Ocurrió un error al eliminar la tarea',
      icon: 'error',
      confirmButtonColor: '#ef4444',
      background: '#fff'
    }));
  });

  it('should toggle task completion', async () => {
    const task = { ...mockTasks[0] };
    component.tasks = [task];
    
    await component.toggleComplete(task);
    fixture.detectChanges();

    expect(taskService.toggleTaskComplete).toHaveBeenCalledWith(task.id);
    expect(component.tasks[0].completed).toBeTrue();
  });
});

