import {
  Component,
  Output,
  EventEmitter,
  Input,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../shared/toast.service';
import { ApiTasksService } from '../api.service';
import { task } from '../models/task.model';

@Component({
  selector: 'app-new-task',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.css'],
})
export class NewTaskComponent implements OnInit {
  @Output() formSubmit = new EventEmitter<boolean>();
  @Output() close = new EventEmitter<void>();
  @Input() taskToUpdate?: task;

  isUpdateMode = false;

  // Form fields
  title: string = '';
  start_time: string = ''; // User-entered time in HH:mm format
  description: string = '';

  constructor(
    private apiTasksService: ApiTasksService,
    private toastService: ToastService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (this.taskToUpdate) {
      this.isUpdateMode = true;
      this.title = this.taskToUpdate.title;
      this.description = this.taskToUpdate.description;
      this.start_time = this.extractTime(this.taskToUpdate.start_time);
    }
  }

  onSubmit(taskForm: any): void {
    if (!taskForm.valid) {
      this.toastService.showToast('Please fill in all required fields.', 'error');
      return;
    }

    const today = new Date();
    const [hours, minutes] = this.start_time.split(':').map(Number);
    const startTimestamp = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      hours,
      minutes
    ).toISOString();

    const newTask: task = {
      title: this.title,
      start_time: startTimestamp,
      description: this.description,
    };

    if (this.isUpdateMode && this.taskToUpdate) {
      this.apiTasksService.updateTask({ ...this.taskToUpdate, ...newTask }).subscribe({
        next: () => {
          this.toastService.showToast('Task updated successfully!', 'success');
          this.formSubmit.emit(true);
        },
        error: () => {
          this.toastService.showToast('Failed to update task.', 'error');
        },
      });
    } else {
      this.apiTasksService.createTask(newTask).subscribe({
        next: () => {
          this.toastService.showToast('Task created successfully!', 'success');
          this.formSubmit.emit(true);
        },
        error: () => {
          this.toastService.showToast('Failed to create task.', 'error');
        },
      });
    }

    this.resetFormFields();
  }

  onClose(): void {
    this.close.emit();
    this.resetFormFields();
  }

  resetFormFields(): void {
    this.title = '';
    this.start_time = '';
    this.description = '';
  }

  private extractTime(timestamp: string): string {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
}
