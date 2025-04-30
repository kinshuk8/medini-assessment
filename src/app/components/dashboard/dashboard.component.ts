import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
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
  imports: [CommonModule, NavbarComponent, RouterModule, FormsModule]
})
export class DashboardComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm: string = '';
  selectedCountry: string = '';
  selectedState: string = '';
  selectedStatus: string = '';
  uniqueCountries: string[] = [];
  uniqueStates: string[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      this.users = JSON.parse(storedUsers);
      this.filteredUsers = [...this.users];
      this.updateUniqueValues();
    }
  }

  updateUniqueValues(): void {
    this.uniqueCountries = [...new Set(this.users.map(user => user.country))];
    this.uniqueStates = [...new Set(this.users.map(user => user.state))];
  }

  applyFilters(): void {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = !this.searchTerm ||
        user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.mobileNo.includes(this.searchTerm);

      const matchesCountry = !this.selectedCountry || user.country === this.selectedCountry;
      const matchesState = !this.selectedState || user.state === this.selectedState;
      const matchesStatus = !this.selectedStatus || user.status === this.selectedStatus;

      return matchesSearch && matchesCountry && matchesState && matchesStatus;
    });
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedCountry = '';
    this.selectedState = '';
    this.selectedStatus = '';
    this.filteredUsers = [...this.users];
  }

  getTotalUsers(): number {
    return this.filteredUsers.length;
  }

  getActiveUsers(): number {
    return this.filteredUsers.filter(user => user.status === 'active').length;
  }

  getInactiveUsers(): number {
    return this.filteredUsers.filter(user => user.status === 'inactive').length;
  }

  toggleStatus(user: User): void {
    user.status = user.status === 'active' ? 'inactive' : 'active';
    this.saveUsers();
    this.applyFilters(); // Reapply filters after status change
  }

  saveUsers(): void {
    localStorage.setItem('users', JSON.stringify(this.users));
  }

  callAPI(): void {
    this.router.navigate(['/api-users']);
  }

  editUser(user: User): void {
    this.router.navigate(['/edit-user', user.id]);
  }

  deleteUser(userId: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.users = this.users.filter(user => user.id !== userId);
      this.saveUsers();
      this.applyFilters(); // Reapply filters after deletion
    }
  }
}
