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
    login: ['', Validators.required],
    name: ['', Validators.required],
    cpf: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required]
  });

  this.loadCompanies();
}

loadCompanies() {
  this.companyService.getAll().subscribe((res) => {
    this.companies = res;

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
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = {
      ...this.form.value,
      company_ids: this.selectedCompanies
    };


    this.loading = true;

    this.employeeService.create(payload).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/employees']);
      },
      error: (err) => {
        this.loading = false;
      }
    });
  }

  cancel() {
    this.router.navigate(['/employees']);
  }
}
