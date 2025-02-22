import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { TaskFormComponent } from '../task-form/task-form.component';
import { TaskListComponent } from '../task-list/task-list.component';
import { Task } from '../../models/task';

interface User {
  id: number;
  name: string;
  email: string;
}

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  imports: [TaskFormComponent, TaskListComponent],
  providers: [TaskService],
  standalone: true
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  user: User | null = null;

  constructor(
    private taskService: TaskService,
    private authService: AuthService, 
    private router: Router 
  ) {}

  ngOnInit(): void {
    this.loadTasks();
    this.loadUser();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        this.tasks = [];
      }
    });
  }

  handleTaskAdded(): void {
    this.loadTasks();
  }

  loadUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      this.user = JSON.parse(userStr);
    }
  }
}