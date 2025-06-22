import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LoginComponent } from "./auth/login/login.component";
import { SidebarComponent } from "./shared/components/sidebar/sidebar.component";
import { EmployeeListComponent } from './employees/employeeList/employee-list.component';
import { AddEmployeeComponent } from "./employees/add-employee/add-employee.component";
import { MonthComponent } from "./calendar/month/month.component";
import { CalendarComponent } from "./calendar/calendar.component";
import { ToastComponent } from "./shared/components/toast/toast.component";
import { OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginComponent, SidebarComponent, EmployeeListComponent, AddEmployeeComponent, MonthComponent, CalendarComponent, ToastComponent,RouterLink,RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'management-app';
  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit() {
    // this.authService.isLoggedIn().subscribe((isLoggedIn) => {
    //   if (!isLoggedIn) {
    //     this.router.navigate(['/login']);
    //   } else {
    //     // Proceed to the authenticated page
    //     this.router.navigate(['/events']);
    //   }
    // })
  }
}
