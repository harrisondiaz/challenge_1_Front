import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { TaskFormComponent } from '../task-form/task-form.component';
import { TaskListComponent } from '../task-list/task-list.component';

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
  tasks: any[] = [];
  user: User = {
    id: 0,
    name: '',
    email: ''
  };

  constructor(
    private taskService: TaskService,
    private authService: AuthService, 
    private router: Router 
  ) {
    this.loadTasks();
  }

  ngOnInit() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      this.user = JSON.parse(userStr);
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  loadTasks() {
    this.taskService.getTasks().subscribe({
      next: (tasks) => this.tasks = tasks,
      error: (err) => console.error('Error loading tasks:', err)
    });
  }

  handleTaskAdded() {
    this.loadTasks();
  }
}