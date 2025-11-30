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
  error: string | null = null;

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

    
    this.form.get('cnpj')?.valueChanges.subscribe(value => {
      const onlyDigits = (value || '').replace(/\D/g, '');
      if (value !== onlyDigits) {
        this.form.get('cnpj')?.setValue(onlyDigits, { emitEvent: false });
      }
    });

    
    this.employeeService.getAllEmployees().subscribe({
      next: employees => {
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
  this.error = null;

  const cnpjControl = this.form.get('cnpj');

  
  this.form.markAllAsTouched();


  if (this.form.invalid) {
    return;
  }

  const digits = (cnpjControl?.value || '').replace(/\D/g, '');

  if (digits.length !== 14) {
    cnpjControl?.setErrors({
      ...(cnpjControl?.errors || {}),
      invalidLength: true
    });
    return;
  }

  const payload = {
    ...this.form.value,
    employee_ids: this.selectedEmployees
  };

  this.loading = true;

  this.companyService.create(payload).subscribe(res => {

    this.loading = false;

  
    if (res.success) {
      this.router.navigate(['/companies']);
      return;
    }

    
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


  cancel() {
    this.router.navigate(['/companies']);
  }
}
