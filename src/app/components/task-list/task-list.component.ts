import { Component, Input } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class TaskListComponent {
  @Input() tasks: Task[] = [];

  get pendingTasks(): Task[] {
    return this.tasks.filter(task => !task.completed);
  }

  get completedTasks(): Task[] {
    return this.tasks.filter(task => task.completed);
  }

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
          next: (response) => {
            this.tasks = this.tasks.filter(task => task.id !== id);
            Swal.fire({
              title: '¡Eliminado!',
              text: response.message,
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

  toggleComplete(task: Task) {
    this.taskService.toggleTaskComplete(task.id).subscribe({
      next: (updatedTask) => {
        const index = this.tasks.findIndex(t => t.id === task.id);
        if (index !== -1) {
          this.tasks[index] = {
            ...this.tasks[index],
            completed: updatedTask.completed
          };
        }
        Swal.fire({
          title: this.tasks[index].completed ? '¡Tarea completada!' : 'Tarea pendiente',
          icon: this.tasks[index].completed ? 'success' : 'warning',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          background: '#fff',
          iconColor: this.tasks[index].completed ? '#10b981' : '#eab308'
        });
      },
      error: (err) => {
        Swal.fire({
          title: 'Error',
          text: err.error?.error || 'No se pudo actualizar el estado de la tarea',
          icon: 'error',
          confirmButtonColor: '#ef4444',
          background: '#fff'
        });
      }
    });
  }

  async editTask(task: Task) {
    const { value: formValues } = await Swal.fire({
      title: 'Editar Tarea',
      html: `
        <input 
          id="swal-title" 
          class="swal2-input" 
          placeholder="Título" 
          value="${task.title}"
        >
        <textarea 
          id="swal-description" 
          class="swal2-textarea" 
          placeholder="Descripción"
        >${task.description}</textarea>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#0043A9',
      cancelButtonColor: '#ef4444',
      preConfirm: () => {
        const title = (document.getElementById('swal-title') as HTMLInputElement).value.trim();
        const description = (document.getElementById('swal-description') as HTMLTextAreaElement).value.trim();
        
        if (!title || !description) {
          Swal.showValidationMessage('Por favor completa todos los campos');
          return false;
        }
        
        return { title, description };
      }
    });
  
    if (formValues) {
      if (formValues.title === task.title && formValues.description === task.description) {
        Swal.fire({
          title: 'Sin cambios',
          text: 'No se detectaron cambios en la tarea',
          icon: 'info',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          background: '#fff',
          iconColor: '#3b82f6'
        });
        return;
      }

      const updatedTask = {
        title: formValues.title,
        description: formValues.description,
        completed: task.completed
      };
  
      this.taskService.updateTask(task.id, updatedTask).subscribe({
        next: (response) => {
          const index = this.tasks.findIndex(t => t.id === task.id);
          if (index !== -1) {
            this.tasks[index] = {
              ...this.tasks[index],
              ...response,
              completed: task.completed
            };
          }
          
          Swal.fire({
            title: '¡Actualizado!',
            text: 'La tarea ha sido actualizada',
            icon: 'success',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            background: '#fff',
            iconColor: '#10b981'
          });
        },
        error: (error) => {
          Swal.fire({
            title: 'Error',
            text: error.error?.message || 'No se pudo actualizar la tarea',
            icon: 'error',
            confirmButtonColor: '#ef4444',
            background: '#fff'
          });
        }
      });
    }
  }
}