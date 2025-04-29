import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [RouterLink, CommonModule]
})
export class NavbarComponent {
  isDropdownOpen = false;
  currentUser: any;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  onProfileClick(): void {
    this.isDropdownOpen = false;
    this.router.navigate(['/profile']);
  }

  onLogoutClick(): void {
    this.isDropdownOpen = false;
    this.authService.logout();
  }
}
