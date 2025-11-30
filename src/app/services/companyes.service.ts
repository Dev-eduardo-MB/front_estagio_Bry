import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CompanyesService {

  private apiUrl = 'http://127.0.0.1:8000/api/companies';

  constructor(private http: HttpClient) {}

  private wrap<T>(method: string, obs: Observable<T>): Observable<any> {
    return obs.pipe(

      map(response => ({
        method,
        success: true,
        status: 200,
        data: response
      })),

      catchError(err => {
        return of({
          method,
          success: false,
          status: err.status || 0,
          data: err.error || null,  
          message: err.error?.message || 'Request failed'
        });
      })
    );
  }

  getAll(): Observable<any> {
    return this.wrap('GET', this.http.get(this.apiUrl));
  }

  getEmployeesByCompany(companyId: number): Observable<any> {
    return this.wrap('GET', this.http.get(`${this.apiUrl}/${companyId}`));
  }

  create(data: any): Observable<any> {
    return this.wrap('POST', this.http.post(this.apiUrl, data));
  }

  update(id: number, data: any): Observable<any> {
    return this.wrap('PUT', this.http.put(`${this.apiUrl}/${id}`, data));
  }

  delete(id: number): Observable<any> {
    return this.wrap('DELETE', this.http.delete(`${this.apiUrl}/${id}`));
  }
}
