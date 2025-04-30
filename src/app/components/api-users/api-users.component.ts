import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService, User } from '../../services/user.service';
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: 'app-api-users',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './api-users.component.html',
  styleUrl: './api-users.component.scss'
})
export class ApiUsersComponent implements OnInit {
  users: User[] = [];
  loading = false;
  error: string | null = null;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.error = null;
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users.map(user => ({
          ...user,
          status: 'active' // Adding default status
        }));
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load users. Please try again.';
        this.loading = false;
      }
    });
  }

  toggleStatus(user: User) {
    user.status = user.status === 'active' ? 'inactive' : 'active';
    this.userService.updateUser(user).subscribe({
      error: (err) => {
        user.status = user.status === 'active' ? 'inactive' : 'active'; // Revert on error
        this.error = 'Failed to update user status. Please try again.';
      }
    });
  }

  editUser(user: User) {
    // Navigate to edit page with user ID
    // This will be implemented in the routing module
  }

  deleteUser(id: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.users = this.users.filter(user => user.id !== id);
        },
        error: (err) => {
          this.error = 'Failed to delete user. Please try again.';
        }
      });
    }
  }
}
