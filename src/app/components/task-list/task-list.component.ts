import { Component, Input } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  standalone: true,
  imports: []
  
})
export class TaskListComponent {
  @Input() tasks: Task[] = [];

  constructor(private taskService: TaskService) {}

  confirmDelete(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esta acción!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: '#fff',
      iconColor: '#ef4444'
    }).then((result) => {
      if (result.isConfirmed) {
        this.taskService.deleteTask(id).subscribe({
          next: () => {
            this.tasks = this.tasks.filter(task => task.id !== id);
            Swal.fire({
              title: '¡Eliminado!',
              text: 'La tarea ha sido eliminada.',
              icon: 'success',
              confirmButtonColor: '#10b981',
              background: '#fff'
            });
          },
          error: (err) => {
            Swal.fire({
              title: 'Error',
              text: 'Ocurrió un error al eliminar la tarea',
              icon: 'error',
              confirmButtonColor: '#ef4444',
              background: '#fff'
            });
          }
        });
      }
    });
  }
}