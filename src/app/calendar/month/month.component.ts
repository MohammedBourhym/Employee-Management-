import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Needed for two-way binding
import { CommonModule } from '@angular/common';
import { CalendarService } from '../services/calendar.service';
import { EventsComponent } from '../events/events.component';
import { ApiEventsService } from '../services/apiEvents.service';
import { eventsData } from '../models/events.model';

interface DateInfo {
  id: number;
  day: number;
  weekDay: number;
  month: number;
  year: number;
}

@Component({
  selector: 'app-month',
  standalone: true, // Standalone component
  imports: [FormsModule, CommonModule, EventsComponent], // Import necessary modules
  templateUrl: './month.component.html',
  styleUrls: ['./month.component.css'],
})
export class MonthComponent {
  @Input() date!: Date;
  @Output() addEvents: EventEmitter<DateInfo> = new EventEmitter<DateInfo>();
  @Input() events: eventsData[] = [];
  cells: DateInfo[][] = [];
  highlightedDays: string[] = []; // Highlighted days as timestamps

  constructor(
    private calendarService: CalendarService,
   
  ) {}

  ngOnInit() {
    // Generate the calendar for the provided date
    this.cells = this.calendarService.getDaysInMonth(
      this.date.getMonth(),
      this.date.getFullYear()
    );
  }

  onDayClick(day: DateInfo) {
    this.addEvents.emit(day);
  }

  isToday(day: { day: number; month: number; year: number }): boolean {
    const today = new Date();
    return (
      day.day === today.getDate() &&
        day.month-1 ===today.getMonth()            &&
      day.year === today.getFullYear()
    );
  }
  
  hasEvent(day: { day: number; month: number; year: number }): boolean {
    
    return this.events.some(event =>
      new Date(event.date).toDateString() ===
      new Date(day.year, day.month - 1, day.day).toDateString()
    );
  }

  getDateType(date: string): boolean {
    const digitalDate = new Date(date).setHours(0, 0, 0, 0);
    const today = new Date().setHours(0, 0, 0, 0);
    return today >= digitalDate;
  }
}
