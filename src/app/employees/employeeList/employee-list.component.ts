import { Component, OnInit } from '@angular/core';
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
  searchTerm: string = '';
  totalRecords = 0;
  rowsPerPage = 10;
  isCreateEmployeeVisible = false;
  export=false;
  updatedEmployee?: employee;
  isDeleting: boolean=false;

  constructor(
    private apiService: EmployeeApiService,
    private employeeService: EmployeeService,
    private router:Router
  ) {}

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
        this.displayedEmployees=data
        this.applyPagination();
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
      employee.cin?.toLowerCase().includes(term) ||
      (employee.id && employee.id.toString().includes(term))
    );
    this.totalRecords = filteredEmployees.length;
    this.displayedEmployees = filteredEmployees;
    this.applyPagination();
  }

  onFormSubmit(isValid: boolean) {
    if (isValid) {
      this.isCreateEmployeeVisible = false;
    }
  }

  closeForm() {
    this.isCreateEmployeeVisible = false;
  }
  closeExport(){
    this.export=false
  }

  applyPagination() {
    this.displayedEmployees = this.displayedEmployees.slice(0, this.rowsPerPage);
  }

  changePage(page: PageEvent) {
    const start = page.first ?? 0;
    const end = start + (page.rows ?? this.rowsPerPage);
    this.displayedEmployees = this.employees.slice(start, end);
  }

  openAddEmployeeForm() {
    this.updatedEmployee = undefined;
    this.isCreateEmployeeVisible = true;
  }


  navigateProfile(id :number){
    if(!this.isDeleting){
      this.router.navigateByUrl('/profile/'+id)
    }
    this.isDeleting = false; 
  }

  deleteEmployee(e:employeeRecords){
    this.isDeleting=true;
    this.apiService.deleteEmployee(e.id,e.name).subscribe({
    next :()=>{
      this.apiService.notifyChange()
    }
  })
  }
}
