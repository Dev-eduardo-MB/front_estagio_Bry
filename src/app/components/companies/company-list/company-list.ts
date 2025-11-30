import {
  ChangeDetectionStrategy, Component, OnInit, OnChanges, DoCheck,
  AfterContentChecked, AfterViewChecked
} from '@angular/core';
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
export class CompanyList implements OnInit, OnChanges, DoCheck, AfterContentChecked, AfterViewChecked {

  companies: any[] = [];
  loading = false;
  error: any = null;

  constructor(
    private companyService: CompanyesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCompanies();
  }

  ngOnChanges(): void {}
  ngDoCheck(): void {}
  ngAfterContentChecked(): void {}
  ngAfterViewChecked(): void {}

  loadCompanies(): void {
    this.loading = true;

    this.companyService.getAll().subscribe({
      next: (data: any) => {
        console.log('API retornou:', data);
        this.companies = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Erro API:', err);
        this.error = err;
        this.loading = false;
      }
    });
  }

  deleteCompany(id: number): void {
    if (!confirm('Confirm delete?')) return;

    this.companyService.delete(id).subscribe({
      next: () => this.loadCompanies(),
      error: () => alert('Erro ao deletar empresa')
    });
  }
}
