import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CompanyesService } from '../../../services/companyes.service';
import { EmployeeService } from '../../../services/employee.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-company-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './company-form.html',
  styleUrl: './company-form.scss',
})
export class CompanyForm implements OnInit {

  form!: FormGroup;
  employees: any[] = [];
  selectedEmployees: number[] = [];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyesService,
    private employeeService: EmployeeService,
    private router: Router,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      cnpj: ['', Validators.required],
      address: ['', Validators.required],
    });

    // Carregar funcionários por cdr  (foram testados outros cliclos de vida mas sem sucesso acredito ser por conta da verçao do Angular)
    this.employeeService.getAllEmployees().subscribe({
      next: (employees: any[]) => {
        this.employees = employees;
        this.cdr.detectChanges();
      },
      error: () => {
        this.employees = [];
        this.cdr.detectChanges();
      }
    });
  }

  toggleEmployee(id: number, event: any) {
    if (event.target.checked) {
      this.selectedEmployees.push(id);
    } else {
      this.selectedEmployees = this.selectedEmployees.filter(e => e !== id);
    }
  }

  save() {
     if (this.form.invalid) {
       this.form.markAllAsTouched();
        return; }

        const payload = {
           ...this.form.value,
            employee_ids: this.selectedEmployees 
          };

          this.loading = true;
          this.companyService.create(payload).subscribe({
            next: () => {
              this.loading = false;
              this.router.navigate(['/companies']);
              },
              error: (err) => {
                this.loading = false;
              }
            });
          }

  cancel() {
    this.router.navigate(['/companies']);
  }
}
