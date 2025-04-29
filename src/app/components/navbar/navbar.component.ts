import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface User {
  name: string;
  // Add other user properties as needed
}

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
    // Get current user from localStorage
    const currentUserStr = localStorage.getItem('currentUser');
    if (currentUserStr) {
      this.currentUser = JSON.parse(currentUserStr);
    }
  }

  onLogoutClick(): void {
    // Clear all localStorage data
    localStorage.clear();
    // Navigate to login page
    this.router.navigate(['/login']);
  }
}
