import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EmployeeService } from '../../../services/employee.service';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './employee-list.html',
  styleUrls: ['./employee-list.scss'],
})
export class EmployeeListComponent implements OnInit {

  employees: any[] = [];
  loading = false;
  error: any = null;

  constructor(
    private employeeService: EmployeeService,
    private cdr: ChangeDetectorRef,
    private router: Router  
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  goToEdit(id: number) {
    this.router.navigate(['/employees/edit', id]);
  }

  loadEmployees(): void {
    this.loading = true;

    this.employeeService.getAllEmployees().subscribe({
      next: (data) => {
        this.employees = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err;
        this.loading = false;
      }
    });
  }

  deleteEmployee(id: number): void {
    if (!confirm('Confirm delete?')) return;

    this.employeeService.delete(id).subscribe({
      next: () => this.loadEmployees(),
    });
  }
}
