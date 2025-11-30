import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../../services/employee.service';
import { CompanyesService } from '../../../services/companyes.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-employee-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './employee-edit.html',
  styleUrl: './employee-edit.scss',
})
export class EmployeeEditComponent implements OnInit {

  form!: FormGroup;
  employeeId!: number;
  companies: any[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private employeesService: EmployeeService,
    private companyesService: CompanyesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.employeeId = Number(this.route.snapshot.paramMap.get('id'));

    this.form = this.fb.group({
      login: [''],
      name: [''],
      cpf: [''],
      email: [''],
      password: [''],
      company_ids: [[]]
    });

    this.loadEmployee();
    this.loadCompanies();
  }

  loadEmployee() {
    this.employeesService.get(this.employeeId).subscribe((employee: any) => {
      this.form.patchValue({
        login: employee.login,
        name: employee.name,
        cpf: employee.cpf,
        email: employee.email,
        password: '',
        company_ids: employee.companies ? employee.companies.map((c: any) => c.id) : []
      });
    });
  }

  get selectedCompanies() {
    return this.form.get('company_ids')?.value || [];
  }

  loadCompanies() {
    this.companyesService.getAll().subscribe((res) => {
      this.companies = res;
      this.cdr.detectChanges();
    });
  }

  toggleCompany(id: number) {
    const selected = this.form.value.company_ids as number[];

    if (selected.includes(id)) {
      this.form.patchValue({
        company_ids: selected.filter(c => c !== id)
      });
    } else {
      this.form.patchValue({
        company_ids: [...selected, id]
      });
    }
  }

  save() {
    if (this.form.invalid) return;

    const payload: any = {
      login: this.form.value.login,
      name: this.form.value.name,
      cpf: this.form.value.cpf,
      email: this.form.value.email,
      company_ids: this.form.value.company_ids
    };

    if (this.form.value.password && this.form.value.password.trim() !== '') {
      payload.password = this.form.value.password;
    }

    this.employeesService.update(this.employeeId, payload).subscribe(() => {
      this.router.navigate(['/employees']);
    });
  }

  cancel() {
    this.router.navigate(['/employees']);
  }
}
