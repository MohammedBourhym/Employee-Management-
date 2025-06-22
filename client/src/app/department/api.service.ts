import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { department } from '../shared/components/sidebar/department.model.ts/departement.model';
import { employeeRecords } from '../employees/models/employee.model';
import { DepartmentResponse } from './depa.models';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  baseUrl = 'http://localhost:3000/api/department';
  constructor(private http: HttpClient) {}
  private changeNotifier = new Subject<void>();
  changeNotifier$ = this.changeNotifier.asObservable();



  getDepartmentEmployees(id: number): Observable<employeeRecords[]> {
    return this.http.get<employeeRecords[]>(`${this.baseUrl}/employees/${id}`);
  }
  getDepartment(id:number) :Observable<department[]> {
    return this.http.get<department[]>(`${this.baseUrl}/${id}`);
  }

 
  

  notifyChange() {
    this.changeNotifier.next();
  }
}
