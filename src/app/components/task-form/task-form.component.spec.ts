import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskFormComponent } from './task-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';

describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;
  let taskService: jasmine.SpyObj<TaskService>;

  beforeEach(async () => {
    const taskServiceSpy = jasmine.createSpyObj('TaskService', ['addTask']);
    taskServiceSpy.addTask.and.returnValue(of({ id: 1, title: 'Test Task', description: 'Test Description' }));

    await TestBed.configureTestingModule({
      imports: [
        TaskFormComponent,
        ReactiveFormsModule
      ],
      providers: [
        { provide: TaskService, useValue: taskServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
    taskService = TestBed.inject(TaskService) as jasmine.SpyObj<TaskService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form', () => {
    expect(component.taskForm.get('title')?.value).toBe('');
    expect(component.taskForm.get('description')?.value).toBe('');
    expect(component.taskForm.valid).toBeFalse();
  });

  it('should validate required fields', () => {
    const form = component.taskForm;
    const titleControl = form.get('title');
    const descriptionControl = form.get('description');

    titleControl?.setValue('');
    descriptionControl?.setValue('');
    expect(form.valid).toBeFalse();

    titleControl?.setValue('Test Title');
    descriptionControl?.setValue('Test Description');
    expect(form.valid).toBeTrue();
  });

  it('should emit taskAdded event on successful submission', async () => {
    spyOn(component.taskAdded, 'emit');
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true } as any));

    component.taskForm.setValue({
      title: 'Test Task',
      description: 'Test Description'
    });

    await component.onSubmit();
    
    expect(taskService.addTask).toHaveBeenCalledWith({
      title: 'Test Task',
      description: 'Test Description'
    });
    expect(component.taskAdded.emit).toHaveBeenCalled();
    expect(component.taskForm.getRawValue()).toEqual({
      title: null,
      description: null
    });
  });

  it('should show error message on submission failure', async () => {
    spyOn(Swal, 'fire');
    taskService.addTask.and.returnValue(throwError(() => new Error('Test error')));

    component.taskForm.setValue({
      title: 'Test Task',
      description: 'Test Description'
    });

    component.onSubmit();

    expect(taskService.addTask).toHaveBeenCalled();
    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
      title: 'Error',
      text: 'Error al crear la tarea',
      icon: 'error',
      confirmButtonColor: '#ef4444',
      background: '#fff'
    }));
  });

  it('should not submit if form is invalid', () => {
    component.taskForm.setValue({
      title: '',
      description: ''
    });

    component.onSubmit();

    expect(taskService.addTask).not.toHaveBeenCalled();
  });
});
