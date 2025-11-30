import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CompanyesService } from '../../../services/companyes.service';
import { EmployeeService } from '../../../services/employee.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-company-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './company-edit.html',
  styleUrls: ['./company-edit.scss']
})
export class CompanyEditComponent implements OnInit {

  form!: FormGroup;
  companyId!: number;

  employees: any[] = [];
  companyEmployeesIds: number[] = [];

  loading = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private companyesService: CompanyesService,
    private employeesService: EmployeeService,
    private router: Router 
  ) {}

  ngOnInit(): void {
    this.companyId = Number(this.route.snapshot.paramMap.get('id'));

    this.form = this.fb.group({
      name: ['', Validators.required],
      cnpj: ['', Validators.required],
      address: ['', Validators.required],
      employees: [[]]
    });

    this.loadData();
  }

  loadData() {
    this.loading = true;

    this.employeesService.getAllEmployees().subscribe({
      next: (employees: any[]) => {
        this.employees = employees;

        this.companyesService.getAll().subscribe({
          next: (companies: any[]) => {
            const company = companies.find((c: any) => c.id == this.companyId);

            if (!company) return;

            this.companyEmployeesIds = company.employees
              ? company.employees.map((e: any) => e.id)
              : [];

            this.form.patchValue({
              name: company.name,
              cnpj: company.cnpj,
              address: company.address,
              employees: this.companyEmployeesIds
            });

            this.loading = false;
          },
          error: () => {
            this.loading = false;
          }
        });
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  toggleEmployee(id: number, event: any) {
    const list = [...this.form.value.employees];

    if (event.target.checked) {
      if (!list.includes(id)) list.push(id);
    } else {
      const idx = list.indexOf(id);
      if (idx !== -1) list.splice(idx, 1);
    }

    this.form.patchValue({ employees: list });
  }

  cancel() {
    history.back();
  }

  save() {
    if (this.form.invalid) return;

    const payload = {
      name: this.form.value.name,
      cnpj: this.form.value.cnpj,
      address: this.form.value.address,
      employee_ids: this.form.value.employees
    };

    this.companyesService.update(this.companyId, payload).subscribe({
      next: () => {
        this.router.navigate(['/companies']);
      }
    });
  }
}
