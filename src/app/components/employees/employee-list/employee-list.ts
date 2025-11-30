import { Component, OnInit, OnChanges, DoCheck ,AfterContentChecked, AfterViewChecked} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EmployeeService } from '../../../services/employee.service';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './employee-list.html',
  styleUrls: ['./employee-list.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeListComponent implements OnInit, OnChanges, DoCheck, AfterContentChecked, AfterViewChecked {
  employees: any[] = [];
  loading = false;
  error: any = null;
  

  /*constructor(private employeeService: EmployeeService) {}*/
  
 
constructor(
  private employeeService: EmployeeService,
  private cdr: ChangeDetectorRef,
  private router: Router  
) {}
  ngOnInit(): void {
    console.log('EmployeeList iniciado');
    this.loadEmployees();
  }
  ngOnChanges(): void {
    console.log('EmployeeLis ngON',this.employees);
  }
  ngDoCheck(): void {
    console.log('EmployeeLis check',this.employees);
  }

  ngAfterContentChecked(): void{
    console.log('EmployeeLis after',this.employees);
  }

  ngAfterViewChecked(): void {
    console.log('test', this.employees);
    
  }
  goToEdit(id: number) {
  this.router.navigate(['/employees/edit', id]);
}


  // ngAfter

  loadEmployees(): any {
    this.loading = true;

    this.employeeService.getAllEmployees().subscribe({
      next: (data) => {
       /* console.log('API retornou:', data);
        this.employees = Array.isArray(data) ? data : (data.data ?? []);
        console.log('emplloy',this.employees)
        this.loading = false;
        console.log('this.loading',this.loading)*/

        console.log('API retornou:', data);
        this.employees = data;
        this.loading = false;
        this.cdr.detectChanges();  // ⬅️ forces Angular to update the view

        

      },
      error: (err) => {
        console.error('Erro API:', err);
        this.error = err;
        this.loading = false;
      }
    });
  }

  deleteEmployee(id: number): void {
    if (!confirm('Confirm delete?')) return;

    this.employeeService.delete(id).subscribe({
      next: () => this.loadEmployees(),
      error: () => alert('Erro ao deletar')
    });
  }
}

