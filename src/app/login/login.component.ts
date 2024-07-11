import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm = new FormGroup({
    "username" : new FormControl('', [Validators.required]),
    'password' : new FormControl('', [Validators.required])
  })
  logInSuccess : boolean = false;
  logInFail : boolean = false;
  errorMessage: string = '';
  formValid: boolean = true;

  constructor(private router: Router, private auth: AuthService) {}

  change(){
    this.formValid = true;
  }

  login() {
    this.logInSuccess = false;
    this.logInFail = false;

    const username = this.loginForm.value.username;
    const password = this.loginForm.value.password;

    if (!this.loginForm.valid) {
      this.formValid = false
    } else {
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
            console.log(err.error.message || 'Failed to Login')
          }
        }
      )
    }

    
  }
}
