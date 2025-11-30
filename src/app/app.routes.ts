import { Routes } from '@angular/router';

export const routes: Routes = [
  // Home → Redireciona para Employees
  {   path: 'home',
  loadComponent: () =>
    import('./components/home/home')
      .then(m => m.HomeComponent) },

  // EMPLOYEES
  {
    path: 'employees',
    loadComponent: () =>
      import('./components/employees/employee-list/employee-list')
        .then(m => m.EmployeeListComponent)
  },
  {
    path: 'employees/new',
    loadComponent: () =>
      import('./components/employees/employee-form/employee-form')
        .then(m => m.EmployeeForm)
  },
  {
    path: 'employees/:id',
    loadComponent: () =>
      import('./components/employees/employee-edit/employee-edit')
        .then(m => m.EmployeeEditComponent)
  },

  // COMPANIES
  {
    path: 'companies',
    loadComponent: () =>
      import('./components/companies/company-list/company-list')
        .then(m => m.CompanyList)
  },
  {
    path: 'companies/new',
    loadComponent: () =>
      import('./components/companies/company-form/company-form')
        .then(m => m.CompanyForm)
  },
  {
    path: 'companies/:id',
    loadComponent: () =>
      import('./components/companies/company-edit/company-edit')
        .then(m => m.CompanyEditComponent)
  },

  {
  path: 'companies/:id/info',
  loadComponent: () =>
    import('./components/companies/company-info/company-info')
      .then(m => m.CompanyInfoComponent)
},
  

  // Fallback
  { path: '**', redirectTo: 'home' }
];
