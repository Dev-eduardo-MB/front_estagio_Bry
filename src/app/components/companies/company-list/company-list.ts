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
})                          //cliclos de vida testado
export class CompanyList /*implements OnInit, OnChanges, DoCheck, AfterContentChecked, AfterViewChecked*/ {

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
/*todos os ciclos de vida abaixo foram testados todavia eles nao conseguem renderizar a lista, 
a maneira que a lista rederisou foi por cdr
acredito se tratar de um problema relacionado a verção do angula mais recente*/

  //ngOnChanges(): void {}
  //ngDoCheck(): void {}
  //ngAfterContentChecked(): void {}
  //ngAfterViewChecked(): void {}

  loadCompanies(): void {
    this.loading = true;

    this.companyService.getAll().subscribe({
      next: (data: any) => {
        this.companies = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.error = err;
        this.loading = false;
      }
    });
  }

  deleteCompany(id: number): void {
    if (!confirm('Confirm delete?')) return;

    this.companyService.delete(id).subscribe({
      next: () => this.loadCompanies(),
    });
  }
}
