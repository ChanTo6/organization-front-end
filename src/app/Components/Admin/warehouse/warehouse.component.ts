import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../../../service/service.service';
import { Employee } from '../../../Models/Employee';
import { Router } from '@angular/router';  

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.css']
})
export class WarehouseComponent implements OnInit {
  employees: Employee[] = [];
  loading: boolean = true;
  displayDialog: boolean = false;
  displayRegisterDialog: boolean = false;
  selectedEmployee: Employee | null = null;
  roles = [
    { label: 'Admin', value: 'admin' },
    { label: 'Operator', value: 'operator' },
    { label: 'Manager', value: 'manager' }
  ];
  organizationNames: { label: string, value: string }[] = []; 

  constructor(private service: ServiceService, private router: Router) {}

  ngOnInit() {
    this.fetchEmployees();
    this.fetchOrganizationNames();
  }

  fetchEmployees() {
    this.service.GetAllProjectUsersAsync().subscribe({
      next: (employees: Employee[]) => {
        console.log(employees);
        this.employees = employees.map(({ password, orgId, ...filteredEmployee }) => filteredEmployee as Employee);
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error fetching employees:', err);
        this.loading = false;
      }
    });
  }

  fetchOrganizationNames() {
    this.service.getAllOrganizationNames().subscribe({
      next: (data) => {
        this.organizationNames = data.map(orgName => ({ label: orgName, value: orgName }));
      },
      error: (err: any) => {
        console.error('Error fetching organization names:', err);
      }
    });
  }

  onAdd() {
    this.displayRegisterDialog=true;
    
    console.log('Add employee clicked');
  }

  saveEmployee() {
    if (this.selectedEmployee) {
        const updateRequest = {
            personId: this.selectedEmployee.personId,
            employeeName: this.selectedEmployee.employeeName,
            employeeSurname: this.selectedEmployee.employeeSurname,
            password: this.selectedEmployee.password,
            role: this.selectedEmployee.role,
            telephone: this.selectedEmployee.telephone,
            orgName: this.selectedEmployee.orgName,
            orgEmail: this.selectedEmployee.orgEmail || '',  
            orgTelephone: this.selectedEmployee.orgTelephone || '', 
            userId: this.selectedEmployee.userId || 0, 
            username: this.selectedEmployee.username || '', 
            isActive: this.selectedEmployee.isActive || true 
        };

        console.log(updateRequest); 
        this.service.UpdateEmployeeAsync(updateRequest).subscribe({
            next: () => {
                this.fetchEmployees(); 
                this.displayDialog = false; 
                alert('Employee updated successfully!'); 
            },
            error: (err: any) => {
                console.error('Error updating employee:', err);
                alert('Failed to update employee. Please try again later.');
            }
        });
    }
}


  

  onUpdate(employee: Employee) {
    this.selectedEmployee = { ...employee }; 
    this.displayDialog = true; 
  }

  onCancel() {
    this.selectedEmployee = null; 
    this.displayRegisterDialog = false; 
  }

  onDelete(userId: number) {
    if (confirm('Are you sure you want to delete this employee?')) {
      console.log(userId);
      this.service.DeleteEmployeeAsync(userId).subscribe({
        error: (err: any) => {
          console.error('Error deleting employee:', err);
          alert('Failed to delete employee. Please try again later.'); 
        }
      });
    }
  }

  logOff() {
    localStorage.clear(); 
    this.router.navigate(['']); 
  }

  newUser: any = {}; 
  registerEmployee() {
    console.log(this.newUser); 
    this.service.register(this.newUser).subscribe({
      next: () => {
        this.fetchEmployees(); 
        this.displayDialog = false; 
        alert('Employee registered successfully!');
      },
      error: (err: any) => {
        console.error('Error registering employee:', err);
        alert('Failed to register employee. Please try again later.');
      }
    });
  }

  
}
