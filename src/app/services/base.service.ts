import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  protected apiUrl = environment.apiUrl;

  constructor() { 
    
  }

  getApiUrl(): string {
    return this.apiUrl;
  }
}
