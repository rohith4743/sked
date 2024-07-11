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

  private loggedIn: boolean = false;

  login(username: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/users/api/login`, { username, password }).pipe(
      tap(res => {
        sessionStorage.setItem('token', res.jwtToken);
        sessionStorage.setItem('id', res.id);
        this.loggedIn = true;
      })
    );
  }

  signup(userData: any) {
    return this.http.post<any>(`${this.apiUrl}/users/api/create`, userData);
  }

  logout() {
    sessionStorage.removeItem('token');
    this.router.navigate(['login']);
    this.loggedIn = false
  }

  getToken() {
    return sessionStorage.getItem('token');
  }

  getId() {
    return sessionStorage.getItem('id');
  }

  isLoggedIn() {
    return this.loggedIn;
  }

}
