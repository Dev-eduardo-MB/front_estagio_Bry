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
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './company-edit.html',
  styleUrls: ['./company-edit.scss']
})
export class CompanyEditComponent implements OnInit {

  form!: FormGroup;
  companyId!: number;

  employees: any[] = [];
  companyEmployeesIds: number[] = [];

  loading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private companyService: CompanyesService,
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

    // ✔️ BLOQUEAR qualquer caractere que não seja número
    this.form.get('cnpj')?.valueChanges.subscribe(value => {
      const onlyDigits = (value || '').replace(/\D/g, '');
      if (value !== onlyDigits) {
        this.form.get('cnpj')?.setValue(onlyDigits, { emitEvent: false });
      }
    });

    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.error = null;

    this.employeesService.getAllEmployees().subscribe(resEmp => {
      this.employees = resEmp;

      this.companyService.getEmployeesByCompany(this.companyId).subscribe(res => {

        if (!res.success) {
          this.error = `Erro ${res.status}: ${res.message}`;
          this.loading = false;
          return;
        }

        const company = res.data;

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
      });
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
    const cnpjControl = this.form.get('cnpj');
    const digits = (cnpjControl?.value || '').replace(/\D/g, '');

    // ✔️ VALIDAR 14 DÍGITOS e MESCLAR ERROS
    if (digits.length !== 14) {
      cnpjControl?.setErrors({
        ...(cnpjControl.errors || {}),
        invalidLength: true
      });
      cnpjControl?.markAsTouched();
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = {
      name: this.form.value.name,
      cnpj: this.form.value.cnpj,
      address: this.form.value.address,
      employee_ids: this.form.value.employees
    };

    this.loading = true;

    this.companyService.update(this.companyId, payload).subscribe(res => {

      this.loading = false;

      if (res.success) {
        this.router.navigate(['/companies']);
        return;
      }

      // ✔️ CNPJ duplicado
      if (res.status === 422 && res.data?.errors?.cnpj) {
        cnpjControl?.setErrors({
          ...(cnpjControl.errors || {}),
          exists: true
        });
        return;
      }

      this.error = `Erro ${res.status}: ${res.message}`;
      this.form.setErrors({ requestFailed: true });
    });
  }
}
