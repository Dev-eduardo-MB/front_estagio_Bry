import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CompanyesService {

  private apiUrl = 'http://127.0.0.1:8000/api/companies';

  constructor(private http: HttpClient) {}

  // LISTAR TODAS AS EMPRESAS
  getAll(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getEmployeesByCompany(companyId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${companyId}`);
  }

  // CRIAR EMPRESA
  create(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  // ATUALIZAR
  update(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  // DELETAR
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
