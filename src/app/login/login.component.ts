import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm = new FormGroup({
    "username" : new FormControl('', Validators.required),
    'password' : new FormControl('', Validators.required)
  })
  logInSuccess : boolean = false;
  logInFail : boolean = false;

  constructor(private router: Router, private auth: AuthService) {}

  login() {
    this.logInSuccess = false;
    this.logInFail = false;

    const username = this.loginForm.value.username;
    const password = this.loginForm.value.password;

    if (!username && !password) {
      this.logInFail = false
    } 
    
    
    this.auth.login(username ?? '', password ?? '').subscribe(
      {
        next : () => {
          this.logInSuccess = true
          this.logInFail = false
          this.router.navigate(["/home"])
        },
        error : err => {
          this.logInFail = true
          this.logInSuccess = false
          console.log(err)
        }
      }
    )
    
  }
}
