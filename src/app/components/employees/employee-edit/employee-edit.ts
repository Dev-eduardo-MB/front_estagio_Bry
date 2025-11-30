import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
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
  loading = false;

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
      login: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9_-]+$/)]],
      name: ['', Validators.required],
      cpf: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.minLength(6)],
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

  loadCompanies() {
    this.companyesService.getAll().subscribe((res) => {
      this.companies = res.data ?? res;
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
    this.form.markAllAsTouched();

    const rawCpf = this.form.get('cpf')?.value || '';
    const cpf = rawCpf.replace(/\D/g, '');
    this.form.get('cpf')?.setValue(cpf);

    if (cpf.length !== 11) {
      this.form.get('cpf')?.setErrors({ invalidLength: true });
    }

    if (this.form.invalid) return;

    const payload: any = {
      login: this.form.value.login,
      name: this.form.value.name,
      cpf,
      email: this.form.value.email,
      company_ids: this.form.value.company_ids
    };

    if (this.form.value.password?.trim() !== '') {
      payload.password = this.form.value.password;
    }

    this.loading = true;

    this.employeesService.update(this.employeeId, payload).subscribe((res: any) => {
      this.loading = false;

      if (res?.id) {
        this.router.navigate(['/employees']);
        return;
      }

      if (res?.status === 422 && res?.data?.errors) {
        if (res.data.errors.login) {
          this.form.get('login')?.setErrors({ exists: true });
        }
        if (res.data.errors.cpf) {
          this.form.get('cpf')?.setErrors({ exists: true });
        }
        if (res.data.errors.email) {
          this.form.get('email')?.setErrors({ exists: true });
        }
        return;
      }

      this.form.setErrors({ requestFailed: true });
    });
  }

  cancel() {
    this.router.navigate(['/employees']);
  }
}
