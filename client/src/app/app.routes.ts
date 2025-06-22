import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { EmployeeListComponent } from './employees/employeeList/employee-list.component';
import { CalendarComponent } from './calendar/calendar.component';
import { AuthGuard } from './auth/auth-guard.guard';
import { LogGuard } from './auth/login-out-guard.guard';
import { ActivityComponent } from './employees/activity/activity.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { TasksComponent } from './tasks/tasks.component';
import { DepartmentComponent } from './department/department.component';
import { Component } from '@angular/core';

export const routes: Routes = [
  // 1. Login route with LogGuard to prevent logged-in users from accessing it
  {
    path: 'login',
    component: LoginComponent,
  canActivate: [LogGuard], // Prevent access if user is logged in
  },

  // 2. Default route redirects to dashboard (so login page won't be shown)
  {
    path: '',
    redirectTo: '/dashboard', // Default to /dashboard after login
    pathMatch: 'full',
  },

  // 3. Sidebar route containing protected child routes
  {
    path: '', 
    component: SidebarComponent,
   canActivate: [AuthGuard], // Protect the whole sidebar and its children
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent, // Protected route
      },
      {
        path: 'events',
        component: CalendarComponent, // Protected route
      },
      {
        path: 'employees',
        component: EmployeeListComponent, // Protected route
      },
      {
        path: 'profile/:id',
        component: ActivityComponent, // Protected route
      },
      {
        path: 'tasks',
        component: TasksComponent, // Protected route
      },
      {
        path: 'department/:id',
        component: DepartmentComponent, // Protected route
      }
    ],
  },
];
