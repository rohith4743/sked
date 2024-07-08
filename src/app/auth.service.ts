import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/users/api/login`, { username, password }).pipe(
      tap(res => {
        sessionStorage.setItem('token', res.jwtToken);
      })
    );
  }

  logout() {
    sessionStorage.removeItem('token');
    this.router.navigate(['login']);
  }

  getToken() {
    return sessionStorage.getItem('token');
  }

}
