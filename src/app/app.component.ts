import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TaskService } from './services/task.service';
import { Task } from './models/task';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [
    RouterModule,
  ]
})
export class AppComponent {
  
  isAuthenticated = false;

  constructor(private authService: AuthService, private router: Router) {
  
    this.authService.currentUser$.subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}