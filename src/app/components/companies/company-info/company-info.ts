import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CompanyesService } from '../../../services/companyes.service';
import { ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-company-info',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './company-info.html',
  styleUrls: ['./company-info.scss']
})
export class CompanyInfoComponent implements OnInit {

  companyId!: number;
  employees: any[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private companyService: CompanyesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.companyId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadEmployees();
  }

  loadEmployees() {
    this.loading = true;
    this.error = null;

    this.companyService.getEmployeesByCompany(this.companyId).subscribe(res => {

      this.loading = false;

     
      if (res.success) {
        this.employees = res.data?.employees || [];
        this.cdr.detectChanges();
        return;
      }

      
      this.error = `Erro ${res.status}: ${res.message}`;
      this.employees = [];
      this.cdr.detectChanges();
    });
  }
}
