import {
  Component,
  Output,
  EventEmitter,
  Input,
  OnInit,
  effect,
  ChangeDetectorRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../shared/toast.service';
import { ApiEventsService } from '../services/apiEvents.service';
import { eventsData } from '../models/events.model';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'], // Corrected property name from styleUrl to styleUrls
})
export class EventsComponent implements OnInit {
  @Output() formSubmit = new EventEmitter<boolean>();
  @Output() close = new EventEmitter<void>();
  @Input() eventDate!: string; // Ensure this is passed from the parent component
  @Input() eventToUpdate?: eventsData;
  isUpdateMode: boolean = false;
  // Form data properties
  date: string = '';
  location: string = '';
  description: string = '';
  title: string = '';
  time: string = '';
  hours!: number;
  minutes!: number;

  // New Event Object to hold submission data
  event: eventsData = {
    title: '',
    date: '',
    time: '',
    duration: '',
    location: this.location,
    description: this.description,
  };

  constructor(
    public toastService: ToastService,
    private apiEventsService: ApiEventsService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    effect(() => {
      if (this.eventToUpdate) {
        console.log(this.eventToUpdate.date);
        this.isUpdateMode = true;
        this.title = this.eventToUpdate.title || '';
        this.date = this.formatDateToUpdate(this.eventToUpdate.date) || '';
        this.location = this.eventToUpdate.location || '';
        this.description = this.eventToUpdate.description || '';
        this.time = this.formatTimeToUpdate(this.eventToUpdate.time) || '';
        console.log(this.eventToUpdate.date);
        if (this.eventToUpdate.duration) {
          const durationParts = this.eventToUpdate.duration.match(
            /(\d+)\s?h\s?:\s?(\d+)\s?m/
          );
          if (durationParts) {
            this.hours = +durationParts[1] || 0;
            this.minutes = +durationParts[2] || 0;
          }
        }
      } else {
        this.isUpdateMode = false;
      }
    });
  }
  ngOnInit(): void {
    this.date = this.eventDate;
  }

  resetFormFields() {
    this.title = '';
    this.date = '';
    this.time = '';
    this.location = '';
    this.description = '';
    this.hours = 0;
    this.minutes = 0;
  }

  onSubmit(eventForm: any) {
    if (!eventForm.valid) {
      this.toastService.showToast('Please fill all required fields', 'error');
      return;
    }

    const [year, month, day] = this.date.split('-');
    var formattedDate = `${day} ${this.getMonthAbbreviation(+month)} ${year}`;
    const formattedTime = this.formatTime(this.time);

    if (this.isUpdateMode) {
      formattedDate != this.eventToUpdate?.date;
    }
    this.event = {
      title: this.title,
      date: formattedDate,
      time: formattedTime,
      duration: `${this.hours} h : ${this.minutes} m`,
      location: this.location,
      description: this.description,
    };

    this.formSubmit.emit(true);
    this.resetFormFields();

    console.log('Formatted Event Data:', this.event);

    if (this.isUpdateMode) {
      this.apiEventsService
        .updateEvent({ id: this.eventToUpdate?.id, ...this.event })
        .subscribe({
          next: (res) => {
           
            this.toastService.showToast(
              'Event updated successfully!',
              'success'
            ); // Update message
            this.apiEventsService.notifyChange();
            this.changeDetectorRef.detectChanges();
          },
          error: (e) => {
            console.error(e);
            this.toastService.showToast('Error updating event!', 'error'); // Update message
          },
        });


    } else {
      this.apiEventsService.addEvent(this.event).subscribe({
        next: (res) => {
       
          this.toastService.showToast('Event created successfully!', 'success');
          this.changeDetectorRef.detectChanges();
          this.apiEventsService.notifyChange();
        },
        error: (e) => {
          console.error(e);
          this.toastService.showToast('Error creating event!', 'error');
        },
      });
      console.log(this.event);
    }

    this.toastService.showToast('Event added successfully!', 'success');
  }

  getMonthAbbreviation(monthNumber: number): string {
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return monthNames[monthNumber - 1] || 'Invalid Month';
  }

  formatTime(timeString: string): string {
    const [hour, minute] = timeString.split(':');
    const dateForTime = new Date();
    dateForTime.setHours(+hour, +minute);

    return dateForTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  }

  onClose() {
    this.close.emit(); // Emit close event
    this.resetFormFields();
  }

  formatTimeToUpdate(eventime: string) {
    let [time, period] = eventime.split(' ');

    // Separate hour and minute from time
    let [hour, minute] = time.split(':').map(Number);

    // Convert PM hour to 24-hour format (add 12 if it's PM and hour isn't 12)
    if (period === 'PM' && hour < 12) {
      hour += 12;
    } else if (period === 'AM' && hour === 12) {
      hour = 0; // Midnight case
    }

    eventime =
      String(hour).padStart(2, '0') + ':' + String(minute).padStart(2, '0');

    return eventime;
  }

  formatDateToUpdate(date: string) {
    const d = new Date(date);
    const [day, month, year] = [d.getDate(), d.getMonth() + 1, d.getFullYear()];
    console.log(
      year.toString() +
        '-' +
        String(month).padStart(2, '0') +
        '-' +
        String(day).padStart(2, '0')
    );
    return (
      year.toString() +
      '-' +
      String(month).padStart(2, '0') +
      '-' +
      String(day).padStart(2, '0')
    );
  }
}
