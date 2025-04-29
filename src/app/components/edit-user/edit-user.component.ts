import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
  standalone: true,
  imports: [NavbarComponent, CommonModule, ReactiveFormsModule]
})
export class EditUserComponent implements OnInit {
  editForm: FormGroup;
  countries = ['USA', 'Canada', 'UK', 'Australia', 'India'];
  states: string[] = [];
  selectedFile: File | null = null;
  previewImage: string | null = null;
  userId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.editForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobileNo: ['', Validators.required],
      dob: ['', Validators.required],
      gender: ['', Validators.required],
      country: ['', Validators.required],
      state: ['', Validators.required],
      address: ['', Validators.required],
      profilePicture: ['']
    });
  }

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.userId) {
      this.loadUserData();
    }
  }

  loadUserData(): void {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.id === this.userId);

    if (user) {
      this.editForm.patchValue({
        name: user.name,
        email: user.email,
        mobileNo: user.mobileNo,
        dob: user.dob,
        gender: user.gender,
        country: user.country,
        state: user.state,
        address: user.address,
        profilePicture: user.profilePicture
      });
      this.previewImage = user.profilePicture;
      this.onCountryChange();
    } else {
      alert('User not found');
      this.router.navigate(['/dashboard']);
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.compressAndConvertImage(file);
    }
  }

  private compressAndConvertImage(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const img = new Image();
      img.src = e.target.result;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Calculate new dimensions (max 300px width/height)
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > 300) {
            height *= 300 / width;
            width = 300;
          }
        } else {
          if (height > 300) {
            width *= 300 / height;
            height = 300;
          }
        }

        canvas.width = width;
        canvas.height = height;

        ctx?.drawImage(img, 0, 0, width, height);

        // Convert to compressed JPEG
        const compressedImage = canvas.toDataURL('image/jpeg', 0.6);
        this.previewImage = compressedImage;
        this.editForm.patchValue({
          profilePicture: compressedImage
        });
      };
    };
    reader.readAsDataURL(file);
  }

  onCountryChange(): void {
    const country = this.editForm.get('country')?.value;
    if (country === 'USA') {
      this.states = ['California', 'Texas', 'New York', 'Florida'];
    } else if (country === 'India') {
      this.states = ['Maharashtra', 'Karnataka', 'Tamil Nadu', 'Delhi'];
    } else {
      this.states = ['State 1', 'State 2', 'State 3'];
    }
  }

  onSubmit(): void {
    if (this.editForm.valid) {
      try {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const formValue = this.editForm.value;

        // Convert Date object to ISO string for storage
        if (formValue.dob instanceof Date) {
          formValue.dob = formValue.dob.toISOString().split('T')[0];
        }

        const index = users.findIndex((user: any) => user.id === this.userId);
        if (index !== -1) {
          users[index] = {
            ...users[index],
            ...formValue
          };
          localStorage.setItem('users', JSON.stringify(users));
          this.router.navigate(['/dashboard']);
        } else {
          alert('User not found. Please try again.');
        }
      } catch (error) {
        console.error('Error updating user:', error);
        alert('Failed to update user data. Please try again.');
      }
    } else {
      Object.keys(this.editForm.controls).forEach(key => {
        const control = this.editForm.get(key);
        control?.markAsTouched();
      });
    }
  }
}
