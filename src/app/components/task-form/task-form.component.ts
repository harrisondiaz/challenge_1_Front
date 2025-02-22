import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  standalone: true,
  imports: [ReactiveFormsModule]
})
export class TaskFormComponent {
  taskForm: FormGroup;
  @Output() taskAdded = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.taskForm.valid) {
      this.taskService.addTask(this.taskForm.value as Omit<Task, 'id'>)
        .subscribe({
          next: () => {
            Swal.fire({
              title: '¡Éxito!',
              text: 'Tarea creada correctamente',
              icon: 'success',
              confirmButtonColor: '#10b981',
              background: '#fff',
              timer: 2000
            });
            this.taskAdded.emit();
            this.taskForm.reset();
          },
          error: (err) => {
            Swal.fire({
              title: 'Error',
              text: 'Error al crear la tarea',
              icon: 'error',
              confirmButtonColor: '#ef4444',
              background: '#fff'
            });
          }
        });
    }
  }
}