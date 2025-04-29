import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [NavbarComponent]
})
export class ProfileComponent {
  currentUser: any;

  constructor(private authService: AuthService) {
    this.currentUser = this.authService.getCurrentUser();
  }
}
