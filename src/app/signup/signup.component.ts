import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  signupForm = new FormGroup({
    "username" : new FormControl(''),
    'password' : new FormControl(''),
    'firstname' : new FormControl(''),
    'lastname' : new FormControl(''),
    'phone' : new FormControl(''),
    'confirmPassword' : new FormControl('')
  })

  constructor(private router: Router) {}

  signup() {
    this.router.navigate(["/home"])
  }

}
