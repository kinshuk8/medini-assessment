import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class NavbarComponent implements OnInit {
  currentUser: any = {};

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Get the first user from users list in localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.length > 0) {
      this.currentUser = users[0];
    }
  }

  onLogoutClick(): void {
    // Clear all localStorage data
    localStorage.clear();
    // Navigate to login page
    this.router.navigate(['/login']);
  }
}
