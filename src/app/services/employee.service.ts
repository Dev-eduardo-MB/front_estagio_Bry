import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EmployeeService {

  private apiUrl = 'http://127.0.0.1:8000/api/employees';

  constructor(private http: HttpClient) {}

  getAllEmployees(): Observable<any> {
    const result= this.http.get(this.apiUrl);
    console.log('result',result);
    return result;
  }

    
  get(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
  
  create(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  update(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
