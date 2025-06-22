import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { activity } from './models/activity.model';

@Injectable({
  providedIn: 'root',
})
export class ActivityApiService {
  baseUrl = 'http://localhost:3000/api/activity';
  constructor(private http: HttpClient) {}
  private changeNotifier = new Subject<void>();
  changeNotifier$ = this.changeNotifier.asObservable();

  getAllActivities(): Observable<any> {
    return this.http.get<activity[]>(this.baseUrl);
  }

  getActivtyById(id: number): Observable<any> {
    return this.http.get<activity[]>(this.baseUrl + '/' + id);
  }

  getAverageWorkTime(): Observable<number[]> {
    return this.http.get<number[]>(this.baseUrl + '/average');
  }

  getDayActivity(date: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}?date=${date}`);
  }
  

  notifyChange() {
    this.changeNotifier.next();
  }
}
