import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { EmployeeListComponent } from './employees/employeeList/employee-list.component';
import { CalendarComponent } from './calendar/calendar.component';
import { AuthGuard } from './auth/auth-guard.guard';
import { LoginOutGuard } from './auth/login-out-guard.guard';
import { ActivityComponent } from './employees/activity/activity.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { TasksComponent } from './tasks/tasks.component';
import { DepartmentComponent } from './department/department.component';

export const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: 'login',
  //   pathMatch: 'full',
  // },
  {
    path: 'login',
    component: LoginComponent,
 
  },
  {
    path: '',
    component: SidebarComponent,
    // pathMatch: 'full',
  
    children: [
      {
        path: 'events',
        component: CalendarComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'employees',
        component: EmployeeListComponent,
       // canActivate: [AuthGuard],
      },
      {
        path: 'profile/:id',
        component: ActivityComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        // canActivate: [AuthGuard],
      }
      ,{
        path : 'tasks',
        component: TasksComponent
      }
      ,{
        path:'department/:id',
        component:DepartmentComponent
      }
    ],
  },
];
