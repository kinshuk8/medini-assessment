import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

interface UserForm {
  // Basic Details
  name: string;
  email: string;
  password: string;

  // Personal Details
  mobileNo: string;
  dob: string;
  gender: 'Male' | 'Female' | 'others';
  profilePic: string;
  country: string;
  state: string;
  address: string;
}

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
  standalone: true,
  imports: [NavbarComponent, CommonModule, ReactiveFormsModule]
})
export class CreateUserComponent implements OnInit {
  currentStep = 1;
  userForm: FormGroup;
  countries = ['USA', 'Canada', 'UK', 'Australia', 'India'];
  states: string[] = [];
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder, private router: Router) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
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
    // Clear users data when component initializes
    if (!localStorage.getItem('users')) {
      localStorage.setItem('users', JSON.stringify([]));
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
        this.userForm.patchValue({
          profilePicture: compressedImage
        });
      };
    };
    reader.readAsDataURL(file);
  }

  onCountryChange(): void {
    const country = this.userForm.get('country')?.value;
    // Simplified example - in real app you'd fetch states based on country
    if (country === 'USA') {
      this.states = [
        'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
        'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
        'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
        'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
        'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
        'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
        'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
        'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
        'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
        'West Virginia', 'Wisconsin', 'Wyoming'
      ];
    } else if (country === 'India') {
      this.states = [
        'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
        'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
        'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
        'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim',
        'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
        'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh',
        'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir',
        'Ladakh', 'Lakshadweep', 'Puducherry'
      ];
    }
  }

  nextStep(): void {
    if (this.currentStep < 3 && this.isCurrentStepValid()) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  onSubmit(): void {
    console.log('Form submitted', this.userForm.value);

    if (this.userForm.valid) {
      try {
        // Get existing users from localStorage
        let existingUsers = [];
        const storedUsers = localStorage.getItem('users');

        if (storedUsers) {
          existingUsers = JSON.parse(storedUsers);
        }

        const userData = {
          ...this.userForm.value,
          id: Date.now(),
          createdAt: new Date().toISOString(),
          status: 'inactive'
        };

        // Add new user to array
        existingUsers.push(userData);

        try {
          // Try to save to localStorage
          localStorage.setItem('users', JSON.stringify(existingUsers));
          console.log('Saved to localStorage:', existingUsers);
          this.router.navigate(['/dashboard']);
        } catch (storageError) {
          // If storage fails, try saving without the profile picture
          console.warn('Storage failed, saving without profile picture');
          userData.profilePicture = null;
          existingUsers[existingUsers.length - 1] = userData;
          localStorage.setItem('users', JSON.stringify(existingUsers));
          this.router.navigate(['/dashboard']);
        }
      } catch (error) {
        console.error('Error saving user:', error);
        alert('Failed to save user data. Please try again with a smaller profile picture.');
      }
    } else {
      console.log('Form is invalid', this.userForm.errors);
      Object.keys(this.userForm.controls).forEach(key => {
        const control = this.userForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  // Helper method to check if the current step form is valid
  isCurrentStepValid(): boolean {
    if (this.currentStep === 1) {
      return (this.userForm.get('name')?.valid ?? false) &&
             (this.userForm.get('email')?.valid ?? false) &&
             (this.userForm.get('password')?.valid ?? false);
    } else if (this.currentStep === 2) {
      return (this.userForm.get('mobileNo')?.valid ?? false) &&
             (this.userForm.get('dob')?.valid ?? false) &&
             (this.userForm.get('gender')?.valid ?? false) &&
             (this.userForm.get('country')?.valid ?? false) &&
             (this.userForm.get('state')?.valid ?? false) &&
             (this.userForm.get('address')?.valid ?? false);
    }
    return true;
  }
}
