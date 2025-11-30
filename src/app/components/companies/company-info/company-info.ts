import {
  Component, OnInit, OnChanges, DoCheck,
  AfterContentChecked, AfterViewChecked
} from '@angular/core';
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
export class CompanyInfoComponent implements
  OnInit, OnChanges, DoCheck, AfterContentChecked, AfterViewChecked {

  companyId!: number;
  employees: any[] = [];
  loading = true;
  error: any = null;

  constructor(
    private route: ActivatedRoute,
    private companyesService: CompanyesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.companyId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadEmployees();
  }

  ngOnChanges(): void {}
  ngDoCheck(): void {}
  ngAfterContentChecked(): void {}
  ngAfterViewChecked(): void {}

  loadEmployees() {
    this.loading = true;

    this.companyesService.getEmployeesByCompany(this.companyId).subscribe({
      next: (company) => {
        console.log("EMPRESA RECEBIDA:", company);

        this.employees = company?.employees || [];
        this.loading = false;

        // força re-renderização da tabela
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar funcionários:', err);
        this.error = err;
        this.loading = false;

        this.cdr.detectChanges();
      }
    });
  }
}
