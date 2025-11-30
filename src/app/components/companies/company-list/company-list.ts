import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CompanyesService } from '../../../services/companyes.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-companyes-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './company-list.html',
  styleUrls: ['./company-list.scss'],
})
export class CompanyList implements OnInit {

  companies: any[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private companyService: CompanyesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.loading = true;
    this.error = null;

    this.companyService.getAll().subscribe(res => {

      this.loading = false;

      if (res.success) {
        this.companies = res.data;
        this.cdr.detectChanges();  // Necessário para Angular 17+
        return;
      }

      // ERRO — mas sem console.error
      this.error = `Error ${res.status}: Could not load companies.`;
      this.companies = [];
      this.cdr.detectChanges();
    });
  }

  deleteCompany(id: number): void {
    if (!confirm('Confirm delete?')) return;

    this.companyService.delete(id).subscribe(res => {

      if (res.success) {
        this.loadCompanies();
        return;
      }

      // Erro na deleção sem console
      this.error = `Error ${res.status}: Unable to delete.`;
    });
  }
}
