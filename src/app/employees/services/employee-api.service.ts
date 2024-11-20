import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { employee, employeeRecords } from '../models/employee.model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeApiService {
  baseUrl = 'http://localhost:3000/api/employees';
  constructor(private http: HttpClient) {}

  private changeNotifier = new Subject<void>();
  changeNotifier$ = this.changeNotifier.asObservable();

  /**
   * Get all employees.
   */
  getAllEmployees(): Observable<employeeRecords[]> {
    return this.http.get<employeeRecords[]>(this.baseUrl);
  }

  /**
   * Add a new employee. Uses FormData for handling file uploads.
   * @param employeeData - FormData object containing employee details and files.
   */
  addEmployee(employeeData: FormData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/add`, employeeData);
  }

  /**
   * Update an existing employee. Uses FormData for handling file uploads.
   * @param employeeData - FormData object containing employee details and files.
   */
  updateEmployee(employeeData: FormData): Observable<any> {
    const id = employeeData.get('id');
    if (!id) {
      throw new Error('Employee ID is required for update');
    }
    return this.http.put<any>(`${this.baseUrl}/update/${id}`, employeeData);
  }

  /**
   * Delete an employee by ID and name.
   * @param id - Employee ID.
   * @param name - Employee name (used in query parameters).
   */
  deleteEmployee(id: number, name: string): Observable<any> {
    const url = `${this.baseUrl}/delete/${id}?name=${encodeURIComponent(name)}`;
    return this.http.delete<any>(url);
  }

  /**
   * Notify components of a change in employee data.
   */
  notifyChange() {
    this.changeNotifier.next();
  }
}
