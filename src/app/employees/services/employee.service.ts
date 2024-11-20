import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { employee } from '../models/employee.model';


export interface Employee {
  id: number;
  name: string;
  position: string;
  department: string;
  status: string;
}


@Injectable({
  providedIn: 'root'
})




export class EmployeeService {
  paginate(data: employee[], start: number, end: number): employee[] {
    return data.slice(start, end);
  }

  filterBySearchTerm(data: employee[], term: string): employee[] {
    const lowerCaseTerm = term.toLowerCase();
    return data.filter(employee =>
      employee.name.toLowerCase().includes(lowerCaseTerm) ||
      employee.position.toLowerCase().includes(lowerCaseTerm)
    );
  }


}