import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { task } from './models/task.model';

@Injectable({
  providedIn: 'root',
})
export class ApiTasksService {
  baseUrl = 'http://localhost:3000/api/task'; 
  private changeNotifier = new Subject<void>();
  changeNotifier$ = this.changeNotifier.asObservable();

  constructor(private http: HttpClient) {}


  getAllTasks(): Observable<task[]> {
    return this.http.get<task[]>(this.baseUrl);
  }

  
  createTask(newTask: task): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/add`, newTask);
  }

 
  deleteTask(taskId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/delete/${taskId}`);
  }

 
  updateTask(updatedTask: task): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/update/${updatedTask.id}`, updatedTask);
  }

  
  completeTask(taskId: number): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/complete/${taskId}`, {});
  }


  notifyChange() {
    this.changeNotifier.next();
  }
}
