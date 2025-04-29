import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

interface User {
  id: number;
  name: string;
  email: string;
  dob: string;
  mobileNo: string;
  address: string;
  status: 'active' | 'inactive';
  country: string;
  state: string;
  gender: string;
  profilePicture?: string;
  createdAt: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterModule]
})
export class DashboardComponent implements OnInit {
  users: User[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      this.users = JSON.parse(storedUsers);
      console.log('Loaded users:', this.users); // Debug log
    }
  }

  getTotalUsers(): number {
    return this.users.length;
  }

  getActiveUsers(): number {
    return this.users.filter(user => user.status === 'active').length;
  }

  getInactiveUsers(): number {
    return this.users.filter(user => user.status === 'inactive').length;
  }

  toggleStatus(user: User): void {
    user.status = user.status === 'active' ? 'inactive' : 'active';
    this.saveUsers(); // Save changes back to localStorage
  }

  saveUsers(): void {
    localStorage.setItem('users', JSON.stringify(this.users));
  }

  filterUsers(filter: 'all' | 'active' | 'inactive'): void {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      const allUsers = JSON.parse(storedUsers);
      if (filter === 'all') {
        this.users = allUsers;
      } else {
        this.users = allUsers.filter((user: User) => user.status === filter);
      }
    }
  }

  callAPI(): void {
    // Implement API call logic here
    console.log('Calling API');
  }

  editUser(user: User): void {
    this.router.navigate(['/edit-user', user.id]);
  }

  deleteUser(userId: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.filter((user: any) => user.id !== userId);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      this.loadUsers();
    }
  }
}
