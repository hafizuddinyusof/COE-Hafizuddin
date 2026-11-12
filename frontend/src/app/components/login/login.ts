import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  isSignUp = false;

  form = {
    username: '',
    email: '',
    contactNo: '',
    password: '',
    role: 'USER'
  };

  submit(): void {
    if (this.isSignUp) {
      this.authService.signup(this.form).subscribe({
        next: () => {
          alert('Registration successful! Please log in.');
          this.isSignUp = false;
        },
        error: (err) => alert(err.error || 'Signup failed')
      });
    } else {
      this.authService.login({ username: this.form.username, password: this.form.password }).subscribe({
        next: () => {
          if (this.authService.isAdmin()) {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/products']);
          }
        },
        error: (err) => alert(err.error || 'Invalid credentials')
      });
    }
  }
}