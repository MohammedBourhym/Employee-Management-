import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiTasksService } from './api.service';
import { task } from './models/task.model';
import { CommonModule } from '@angular/common';
import { NewTaskComponent } from "./new-task/new-task.component";

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, NewTaskComponent],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'], // Corrected typo from `styleUrl` to `styleUrls`
})
export class TasksComponent implements OnInit {
  isTaskFormVisible: boolean = false;
  tasks: task[] = [];
  taskDate: string = new Date().toISOString().substring(0, 10);
  updatedTask?: task; 
  isDeleting: boolean = false;
  constructor(private apiService: ApiTasksService,  private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.apiService.changeNotifier$.subscribe(() => {
    this.loadTasks();
  });
  this.loadTasks();
  }

  loadTasks() {
    this.apiService.getAllTasks().subscribe({
      next: (data) => {
        this.tasks = data;
        this.cdr.detectChanges();
      },
    });
  }
  onTaskFormSubmit(isValid: boolean) {
    if (isValid) {
      this.isTaskFormVisible = false;
    }
  }

  closeTaskForm() {
    this.isTaskFormVisible = false;
  }

  onAddTask(date: string) {
    this.updatedTask = undefined;
    this.isTaskFormVisible = true;
    this.taskDate = date;
  }


  formatDate(dateString: string | null): string {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }); // Example: 19 Apr 2024
  }

  formatTimeRange(start: string | null, end: string | null): string {
    if (!start) return '-';
    const startTime = new Date(start).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });

    if (!end) {
      return `${startTime}`; // Only show the start time if the end is null
    }

    const endTime = new Date(end).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });

    return `${startTime} - ${endTime}`;
  }



  onTaskClick(task: task) {
    if (!this.isDeleting) {
      this.updatedTask = task;
      this.isTaskFormVisible = true;
    }
    this.isDeleting = false;
  }

}
