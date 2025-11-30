import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeService } from '../../../services/employee.service';
import { CompanyesService } from '../../../services/companyes.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './employee-form.html',
  styleUrl: './employee-form.scss',
})
export class EmployeeForm implements OnInit {

  form!: FormGroup;
  companies: any[] = [];
  selectedCompanies: number[] = [];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private companyService: CompanyesService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      login: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9_-]+$/)]],
      name: ['', Validators.required],
      cpf: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.loadCompanies();
  }

  loadCompanies() {
    this.companyService.getAll().subscribe((res) => {
      this.companies = res.data ?? res; // compatibilidade
      this.cdr.detectChanges();
    });
  }

  toggleCompany(id: number, event: any) {
    if (event.target.checked) {
      this.selectedCompanies.push(id);
    } else {
      this.selectedCompanies = this.selectedCompanies.filter(c => c !== id);
    }
  }

  save() {

  // Marca tudo como touched para exibir required
  this.form.markAllAsTouched();

  // ➤ VALIDAR CPF (somente números + 11 dígitos)
  const rawCpf = this.form.get('cpf')?.value || '';
  const cpf = rawCpf.replace(/\D/g, '');
  this.form.get('cpf')?.setValue(cpf);

  if (cpf.length !== 11) {
    this.form.get('cpf')?.setErrors({ invalidLength: true });
  }

  if (this.form.invalid) return;

  const payload = {
    ...this.form.value,
    cpf,
    company_ids: this.selectedCompanies,
  };

  this.loading = true;

  this.employeeService.create(payload).subscribe({
   next: (res) => {
  this.loading = false;

  // Laravel retorna o funcionário (ID = alguém foi criado/atualizado com sucesso)
  if (res?.id) {
    this.router.navigate(['/employees']);
    return;
  }

  // Erros 422 (validação)
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

  // Outros erros
  this.form.setErrors({ requestFailed: true });
}
    
  });
}


  cancel() {
    this.router.navigate(['/employees']);
  }
}
