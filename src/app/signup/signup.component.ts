import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  return password && confirmPassword && password.value !== confirmPassword.value ? { 'passwordMismatch': true } : null;
};

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  errorMessage:string = "";
  success: boolean = false;
  error: boolean = false;
  formValid: boolean = true;

  ngOnInit(): void {
    this.errorMessage = "some thing";
    this.success = false;
    this.error = false;
  }

  signupForm = new FormGroup({
    "username" : new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20), Validators.pattern('^[a-zA-Z0-9_-]*$')]),
    'password' : new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,}$')]),
    'firstname' : new FormControl('', [Validators.required]),
    'lastname' : new FormControl('', [Validators.required]),
    'phone' : new FormControl('', [Validators.required]),
    'email' : new FormControl('', [Validators.required, Validators.email]),
    'confirmPassword' : new FormControl('', [Validators.required])
  },{ validators: confirmPasswordValidator })

  constructor(private router: Router, private authService: AuthService) {}

  signup() {
    if (this.signupForm.valid) {
      const value = this.signupForm.value;
      const user = {
        firstName : value.firstname,
        lastName : value.lastname,
        email: value.email,
        userName: value.username,
        password: value.password,
        mobileNumber: value.phone
      }

      this.authService.signup(user).subscribe({
        next: (res) => {
          this.success = true;
          this.error = false;
          setTimeout(() => this.login(user.userName ?? '', user.password ?? ''), 1000);
        },
        error: (err) => {
          this.error = true;
          this.success = false;
          this.errorMessage = err.error.message || 'Failed to create account';

        }
      })
      
    } else {
      this.formValid = false;
    }
  }

  disableWarn(){
    this.formValid= true;
  }

  login(username: string, password: string) {

    this.authService.login(username, password).subscribe({
      next: (response) => {
       
        console.log('Login successful, redirecting to home...');
        this.router.navigate(['/home']);  
      },
      error: (err) => {
        console.error('Login failed:', err);
        this.router.navigate(['/login']);  
      }
    });
  }

}
