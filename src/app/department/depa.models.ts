import { employeeRecords } from "../employees/models/employee.model";
import { department } from "../shared/components/sidebar/department.model.ts/departement.model";

export interface DepartmentResponse {
    department: department;
    employees: employeeRecords[];
  }