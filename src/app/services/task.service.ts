import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Task } from '../models/task';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl: string;

  constructor(private http: HttpClient, private baseService: BaseService) { 
    this.apiUrl = `${this.baseService.getApiUrl()}/tasks`;
  }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  addTask(task: Omit<Task, 'id' | 'completed'>): Observable<Task> {
    return this.http.post<{id: number}>(this.apiUrl, task).pipe(
      map(response => ({
        id: response.id,
        title: task.title,
        description: task.description,
        completed: false
      }))
    );
  }

  deleteTask(id: number): Observable<{message: string}> {
    return this.http.delete<{message: string}>(`${this.apiUrl}/${id}`);
  }

  toggleTaskComplete(id: number): Observable<Task> {
    return this.http.put<{message: string, completed: boolean}>(`${this.apiUrl}/${id}/toggle`, {}).pipe(
      map(response => ({
        id,
        completed: response.completed
      } as Task))
    );
  }

  updateTask(id: number, task: Partial<Task>): Observable<Task> {
    return this.http.put<{message: string}>(`${this.apiUrl}/${id}`, task).pipe(
      map(() => ({ 
        id, 
        ...task,
        completed: task.completed
      } as Task))
    );
  }
}