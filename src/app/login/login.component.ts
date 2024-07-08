import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm = new FormGroup({
    "username" : new FormControl(''),
    'password' : new FormControl('')
  })
  logInSuccess : boolean = false;
  logInFail : boolean = false;

  constructor(private router: Router) {}

  login() {
    this.logInSuccess = false;
    this.logInFail = false;
    this.router.navigate(["/home"])
  }
}
