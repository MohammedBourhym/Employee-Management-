import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { eventsData } from '../models/events.model';
import { ChangeDetectorRef } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class ApiEventsService {
  baseUrl = 'http://localhost:3000/api/events';
  constructor(private http: HttpClient) {}
  private changeNotifier = new Subject<void>();
  changeNotifier$ = this.changeNotifier.asObservable();
  getAllEvents(): Observable<eventsData[]> {
    return this.http.get<eventsData[]>(this.baseUrl);
  }

  getAllDates(): Observable<string[]> {
    return this.http.get<string[]>(this.baseUrl + '/dates');
  }

  addEvent(event: eventsData): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/add', event);
  }

  deleteEvent(eventId: number): Observable<any> {
   
    return this.http.delete<any>(this.baseUrl+'/delete/'+eventId) ;
  }

  updateEvent(event: eventsData): Observable<any> {
  
    return this.http.put<any>(this.baseUrl + '/update/' + event.id, event);
  }
  notifyChange() {
    this.changeNotifier.next();
  }
}
