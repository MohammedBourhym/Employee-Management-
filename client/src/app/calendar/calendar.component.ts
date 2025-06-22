import {
  Component,
  OnInit,
  signal,
  effect,
  ChangeDetectorRef,
  OnChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonthComponent } from './month/month.component';
import { Day } from './models/day.model';
import { EventsComponent } from './events/events.component';
import { ApiEventsService } from './services/apiEvents.service';
import { eventsData } from './models/events.model';
import { PaginationComponent } from '../shared/components/pagination/pagination.component';
import { FormsModule } from '@angular/forms';

interface PageEvent {
  first?: number;
  rows?: number;
  page?: number;
  pageCount?: number;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    MonthComponent,
    EventsComponent,
    PaginationComponent,
    FormsModule,
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit {
  isDayClicked!: boolean ;
  events: eventsData[] = [];
  filteredEvents: eventsData[] = [];
  paginatedEvents: eventsData[] = []; // Events to display in the current page
  rowsPerPage = 10;
  totalRecords = 0;
  start = 0;
  end = 7;
  eventDate: string = new Date().toISOString().substring(0, 10);
  monthPage = signal(1);
  selectedMonths: number[] = [];
  updatedEvent?: eventsData;
  eventType: string = 'All'; // Default is "All"
  searchedTerm: string = '';
  highlightedDays: string[] = [];
  changeDetectorRef: any;
  isDeleting: boolean = false;
  currentPage: number=0;
  constructor(
    private apiEventsService: ApiEventsService,
    private cdr: ChangeDetectorRef
  ) {
    effect(() => {
      this.selectedMonths = this.generateMonth(this.monthPage());
    });
  }

  ngOnInit(): void {
    this.apiEventsService.changeNotifier$.subscribe(() => {
      this.getEventsTable(); // Fetch updated events when notified
    });

    this.getEventsTable();
  }

  getEventsTable() {
    this.apiEventsService.getAllEvents().subscribe({
      next: (data) => {
        this.events = data;
        this.getHighlightedDays();
        this.filteredEvents = data;
        this.totalRecords = this.events.length;
        this.applyPagination();
        this.cdr.detectChanges();
      },
      error: (e) => {
        console.error(e);
      },
    });
  }

  getDateType(date: string) {
    const digitalDate = new Date(date);
    const today = new Date();
    return today < digitalDate ? 'Upcoming' : 'Past';
  }

  trackByEventId(index: number, event: eventsData): number {
    return event.id!;
  }

  getMonthDate(monthOffset: number): Date {
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() + monthOffset);
    return currentDate;
  }

  onAddEvents(e: Day) {
    this.updatedEvent = undefined;
    this.isDayClicked = true;
    this.eventDate =
      e.year +
      '-' +
      String(e.month).padStart(2, '0') +
      '-' +
      String(e.day).padStart(2, '0');
  }

  onFormSubmit(isValid: boolean) {
    if (isValid) {
      this.isDayClicked = false;
    }
  }

  closeForm() {
    this.isDayClicked = false;
  }

  generateMonth(index: number): number[] {
    const start = (index - 1) * 8; // Calculate the starting value based on the index
    return Array.from({ length: 8 }, (_, i) => start + i);
  }

  monthPagination(index: number) {
    this.monthPage.update((value) => value + index);
  }

  changePage(page: PageEvent) {
    this.currentPage = page.page ?? 0;
    this.start = page.first ?? 0;
    this.end = this.start + (page.rows ?? this.rowsPerPage);
    this.applyPagination();
 }

  onEventClick(event: eventsData) {
    if (!this.isDeleting) { // Only activate update if delete isn't active
      this.updatedEvent = event;
      this.isDayClicked = true;
    }
    this.isDeleting = false; // Reset delete status after handling click
  }

  onCreateEventClick() {
    this.isDayClicked = true;
  }

  onSelectChange() {
    // Filter events based on the selected type
    if (this.eventType === 'Past') {
      this.filteredEvents = this.events.filter(
        (e) => this.getDateType(e.date) === 'Past'
      );
    } else if (this.eventType === 'Upcoming') {
      this.filteredEvents = this.events.filter(
        (e) => this.getDateType(e.date) === 'Upcoming'
      );
    } else {
      this.filteredEvents = [...this.events]; // If 'All' is selected, show all events
    }

    // Update pagination

    this.updatePaginatedEvents();
  }

  applyPagination() {
    const start = this.currentPage * this.rowsPerPage;
    const end = start + this.rowsPerPage;
    this.paginatedEvents = this.events.slice(start, end);
  }
 
 

  updatePaginatedEvents() {
    this.totalRecords = this.filteredEvents.length;
    this.start = 0; 
    this.end = this.rowsPerPage;
    this.paginatedEvents = this.filteredEvents.slice(this.start, this.end);
 }
  onSearchTerm() {
    const term = this.searchedTerm.toLowerCase();

    this.filteredEvents = this.events.filter((event) => {
      return (
        event.title?.toLowerCase().includes(term) ||
        event.date?.toLowerCase().includes(term) ||
        event.location?.toLowerCase().includes(term) ||
        event.description?.toLowerCase().includes(term) ||
        (event.id && event.id.toString().includes(term)) // for numeric IDs
      );
    });
    this.updatePaginatedEvents();
  }

  getHighlightedDays() {
    this.highlightedDays = this.events.map((event) => event.date);
  }

  onDeleteEvent(id: number) {
    this.isDeleting = true; 
    this.apiEventsService.deleteEvent(id).subscribe({
      next: () => {
       
        this.apiEventsService.notifyChange();
     
       
      },
    });
  }
}
