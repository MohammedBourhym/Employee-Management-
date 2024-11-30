import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  effect,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastService } from '../../shared/toast.service';
import { EmployeeApiService } from '../services/employee-api.service';
import { employee } from '../models/employee.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css'], // Corrected property name
})
export class AddEmployeeComponent {
  isUpdateMode: boolean = false;

  @Input() employeeToUpdate?: employee;
  @Output() formSubmit = new EventEmitter<boolean>();
  @Output() close = new EventEmitter<void>();


  departmentMapping: { [key: string]: number } = {
    Engineering: 1,
    Marketing: 2,
    'Human Resources': 3,
    'Customer Support': 4,
    Quality: 5,
  };

  departmentList = Object.keys(this.departmentMapping);

  
  // Form fields
  avatar!: File;
  cin!: File;
  cnss!: File;
  name: string = '';
  email: string = '';
  number: string = '';
  position: string = '';
  departementName?: string;
  salary?: number;

  constructor(
    private toastService: ToastService,
    private apiService: EmployeeApiService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    effect(() => {
      if (this.employeeToUpdate) {
        this.populateEmployeeFields();
      } else {
        this.isUpdateMode = false;
      }
    });
  }

  /**
   * Populate form fields for update mode.
   */
  populateEmployeeFields() {
    this.isUpdateMode = true;
    this.name = this.employeeToUpdate!.name;
    this.email = this.employeeToUpdate!.email;
    this.number = this.employeeToUpdate!.number;
    this.position = this.employeeToUpdate!.position;
  
    // Find department name by department ID
    const departmentEntry = Object.entries(this.departmentMapping).find(
      ([, id]) => id === this.employeeToUpdate!.departement_id
    );
  
    this.departementName = departmentEntry ? departmentEntry[0] : ''; // Set department name
  
    this.salary = this.employeeToUpdate!.salary;
    this.cin = this.employeeToUpdate!.cin;
    this.cnss = this.employeeToUpdate!.cnss;
    this.avatar = this.employeeToUpdate!.avatar;
  }
  
  /**
   * Reset form fields to their default values.
   */
  resetFormFields() {
    this.name = '';
    this.email = '';
    this.number = '';
    this.position = '';
    this.departementName = '';
    this.salary = undefined;
    this.avatar = undefined!;
    this.cin = undefined!;
    this.cnss = undefined!;
    this.isUpdateMode = false;
  }

  /**
   * Handles file selection for avatar, CIN, and CNSS.
   */
  onFileSelect(event: Event, type: string): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      if (type === 'avatar') this.avatar = file;
      else if (type === 'cin') this.cin = file;
      else if (type === 'cnss') this.cnss = file;
    }
  }

  private getDepartmentId(): number | null {
    return this.departmentMapping[this.departementName!] || null;
  }

 onSubmit(employeeForm: NgForm) {
    if (!employeeForm.valid) {
      this.toastService.showToast('Please fill all required fields', 'error');
      return;
    }
    const departmentId = this.getDepartmentId();

    const formData = new FormData();
    formData.append('name', this.name);
    formData.append('email', this.email);
    formData.append('number', this.number);
    formData.append('position', this.position);
    formData.append('departement', departmentId?.toString() || ''); // Save department index
    formData.append('salary', this.salary?.toString() || '');

    if (this.avatar) formData.append('avatar', this.avatar);
    if (this.cin) formData.append('cin', this.cin);
    if (this.cnss) formData.append('cnss', this.cnss);

    if (this.isUpdateMode) {
      formData.append('id', this.employeeToUpdate!.id!.toString() || '');
      this.updateEmployee(formData);
    } else {
      this.addEmployee(formData);
    }
  }

  /**
   * Add a new employee.
   */
  addEmployee(employeeData: FormData) {
    this.apiService.addEmployee(employeeData).subscribe({
      next: () => {
        this.toastService.showToast('Employee created successfully!', 'success');
        this.apiService.notifyChange();
        this.resetFormFields();
        this.formSubmit.emit(true);
      },
      error: (error) => {
        console.error(error);
        this.toastService.showToast('Error creating employee!', 'error');
      },
    });
  }

  /**
   * Update an existing employee.
   */
  updateEmployee(employeeData: FormData) {
    this.apiService.updateEmployee(employeeData).subscribe({
      next: () => {
        this.toastService.showToast('Employee updated successfully!', 'success');
        this.apiService.notifyChange();
        this.resetFormFields();
        this.formSubmit.emit(true);
      },
      error: (error) => {
        console.error(error);
        this.toastService.showToast('Error updating employee!', 'error');
      },
    });
  }

  /**
   * Close the form and reset fields.
   */
  onClose() {
    this.resetFormFields();
    this.close.emit();
  }
}
