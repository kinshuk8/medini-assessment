import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  displayedColumns: string[] = [
    'profilePicture',
    'name',
    'email',
    'mobileNo',
    'country',
    'status',
    'actions'
  ];

  constructor() {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    const storedUsers = localStorage.getItem('users');
    this.users = storedUsers ? JSON.parse(storedUsers) : [];
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

  deleteUser(userId: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.filter((user: any) => user.id !== userId);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      this.loadUsers();
    }
  }
}
