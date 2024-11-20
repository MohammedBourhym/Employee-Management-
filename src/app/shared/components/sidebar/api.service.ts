import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { department } from './department.model.ts/departement.model';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  baseUrl = 'http://localhost:3000/api/department';
  constructor(private http: HttpClient) {}
  private changeNotifier = new Subject<void>();
  changeNotifier$ = this.changeNotifier.asObservable();

  getAllDepartment():Observable<department[]>{
   return this.http.get<department[]>(this.baseUrl)
  }

  getDepartment(id:number): Observable<any> {
    return this.http.get<any>(this.baseUrl+"?id=" +id);
  }


 
  

  notifyChange() {
    this.changeNotifier.next();
  }
}
