import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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

  addTask(task: Omit<Task, 'id'>): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}