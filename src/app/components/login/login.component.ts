import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [CommonModule, FormsModule,RouterLink]
})
export class LoginComponent {

  email = '';
  password = '';
  loading = false;
  errorMessage = '';

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private router: Router
  ) {}

  login(form: NgForm) {
    this.errorMessage = '';

    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.loading = true;

    this.http.post<any>("http://localhost:8080/api/auth/login", {
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res) => {
        this.loading = false;
        if (res && res.jwt) {
          this.auth.login(res);
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = "Invalid credentials. Please try again.";
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || err.error || "Invalid credentials. Please try again.";
      }
    });
  }
}
