import { Component } from '@angular/core';
import { employeeRecords } from '../employees/models/employee.model';
import { EmployeeApiService } from '../employees/services/employee-api.service';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { ApiService } from './api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';



interface PageEvent {
  first?: number;
  rows?: number;
  page?: number;
  pageCount?: number;
}


@Component({
  selector: 'app-department',
  standalone: true,
  imports: [FormsModule,CommonModule,RouterLink,RouterOutlet],
  templateUrl: './department.component.html',
  styleUrl: './department.component.css'
})
export class DepartmentComponent {
  employees: employeeRecords[] = [];
  displayedEmployees: employeeRecords[] = [];
  searchTerm: string = '';
  totalRecords = 0;
  rowsPerPage = 10;
  id: number | null = null;
  department: any;
  constructor(
    private apiService: ApiService,
    private router:Router,
    private route: ActivatedRoute
  ) {}


  ngOnInit(): void {
    // Subscribe to the route parameter changes
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      if (id !== this.id) {
        this.id = id;  // Update the department id
        this.loadEmployees(id);
        this.loadDepartment(id);
      }
    });
  }


  loadDepartment(id :number) {
    this.apiService.getDepartment(id).subscribe({
      next: (data) => {
       this.department=data
       console.log(data)
      },
      error: (error) => {
        console.error('Failed to load dep info:', error);
      }
    });
  }


  loadEmployees(id :number) {
    this.apiService.getDepartmentEmployees(id).subscribe({
      next: (data) => {
        this.employees = data;
        this.totalRecords = this.employees.length;
        this.displayedEmployees=data;
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
 
      (employee.id && employee.id.toString().includes(term))
    );
    this.totalRecords = filteredEmployees.length;
    this.displayedEmployees = filteredEmployees;
    this.applyPagination();
  }

  applyPagination() {
    this.displayedEmployees = this.displayedEmployees.slice(0, this.rowsPerPage);
  }

  changePage(page: PageEvent) {
    const start = page.first ?? 0;
    const end = start + (page.rows ?? this.rowsPerPage);
    this.displayedEmployees = this.employees.slice(start, end);
  }
   
  navigateProfile(id :number){
    this.router.navigateByUrl('/profile/'+id)
    this.apiService.notifyChange();

}
}
