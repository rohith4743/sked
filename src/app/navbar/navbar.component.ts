import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  constructor(public router: Router, private auth :AuthService){};
  username:string = '';

  ngOnInit(): void {
    
    this.auth.userName$.subscribe((userName: string) => {
      this.username = userName;
    });
    
  }

  logout() {
    this.auth.logout();
  }
}
