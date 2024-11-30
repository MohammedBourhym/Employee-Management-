import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { EmployeeService } from '../services/employee.service';
import { employee, employeeRecords } from '../models/employee.model';
import { EmployeeApiService } from '../services/employee-api.service';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AddEmployeeComponent } from "../add-employee/add-employee.component";
import { Router } from '@angular/router';
import { ExportComponent } from "../export/export.component";


interface PageEvent {
  first?: number;
  rows?: number;
  page?: number;
  pageCount?: number;
}

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, PaginationComponent, FormsModule, RouterLink, AddEmployeeComponent, ExportComponent],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
})
export class EmployeeListComponent implements OnInit {
  employees: employeeRecords[] = [];
  displayedEmployees: employeeRecords[] = [];
  currentPage: number = 0;
  searchTerm: string = '';
  totalRecords = 0;
  rowsPerPage = 10;
  isCreateEmployeeVisible = false;
  export=false;
  updatedEmployee?: employee;
  isDeleting: boolean=false;

  constructor(
    private apiService: EmployeeApiService,
    private cdr: ChangeDetectorRef,
    private router:Router
  ) {


  }

  ngOnInit(): void {
    this.apiService.changeNotifier$.subscribe(() => {
      this.loadEmployees();
    });
    this.loadEmployees();
  }

  departmentColors = [
     '#4CAF50', // Green
 '#FF9800', // Orange
     '#2196F3', // Blue
    ' #F44336', // Red
     '#9C27B0', // Purple
     '#3F51B5', // Indigo
    // Add more department-color pairs as needed
 
]


loadEmployees() {
  this.apiService.getAllEmployees().subscribe({
    next: (data) => {
      this.employees = data;
      this.totalRecords = this.employees.length;
      this.currentPage = 0; // Reset to the first page on reload
      this.applyPagination();
      this.cdr.detectChanges();
    },
    error: (error) => {
      console.error('Failed to load employees:', error);
    }
  });
}

  searchEmployees() {
    const term = this.searchTerm.toLowerCase();
    const filteredEmployees = this.employees.filter((employee) =>
      employee.name?.toLowerCase().includes(term) ||
      employee.email?.toLowerCase().includes(term) ||
      employee.position?.toLowerCase().includes(term) ||
    
      (employee.id && employee.id.toString().includes(term))
    );
    this.totalRecords = filteredEmployees.length;
    this.displayedEmployees = filteredEmployees;
    this.applyPagination();
  }

  onFormSubmit(isValid: boolean) {
    if (isValid) {
      this.isCreateEmployeeVisible = false;
      this.applyPagination();
    }
  }

  closeForm() {
    this.isCreateEmployeeVisible = false;
  }
  closeExport(){
    this.export=false
  }

  applyPagination() {
    const start = this.currentPage * this.rowsPerPage;
    const end = start + this.rowsPerPage;
    this.displayedEmployees = this.employees.slice(start, end);
  }

  changePage(page: PageEvent) {
    this.currentPage = page.page ?? 0;
    const start = page.first ?? 0;
    const end = start + (page.rows ?? this.rowsPerPage);
    this.displayedEmployees = this.employees.slice(start, end);
  }

  onUpdateEmployee(e:employee){
     // Only activate update if delete isn't active
      this.updatedEmployee = e;
      this.isCreateEmployeeVisible = true;
   
  }

  openAddEmployeeForm() {
    this.updatedEmployee = undefined;
    this.isCreateEmployeeVisible = true;
  }


  navigateProfile(id :number){
    if(!this.isDeleting && !this.updatedEmployee && !this.isCreateEmployeeVisible){
      this.router.navigateByUrl('/profile/'+id)
    }
    this.isDeleting = false; 
  }

  deleteEmployee(e: employeeRecords) {
    this.isDeleting = true;
  
    this.apiService.deleteEmployee(e.id, e.name).subscribe({
      next: () => {
        // Remove the deleted employee from the array
        this.employees = this.employees.filter(emp => emp.id !== e.id);
        
        // Update total records
        this.totalRecords = this.employees.length;
  
        // Notify other components
        this.apiService.notifyChange();
  
        // Reapply pagination for the current page
        this.applyPagination();
      },
      error: (err) => {
        console.error('Failed to delete employee:', err);
      }
    });
  }
}
