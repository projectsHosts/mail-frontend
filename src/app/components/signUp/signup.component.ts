import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signup',
  standalone: true,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
  imports: [CommonModule, FormsModule,RouterLink]
})
export class SignupComponent {


successMessage = "";
showSuccessToast = false;
countdown = 3;

  name = '';
  email = '';
  password = '';
  confirmPassword = '';

  loading = false;
  errorMessage = '';
  passwordMismatch = false;

  constructor(private http: HttpClient, private router: Router) {}

signup(form: NgForm) {

  this.errorMessage = "";
  this.passwordMismatch = false;

  if (form.invalid) {
    form.control.markAllAsTouched();
    return;
  }

  if (this.password !== this.confirmPassword) {
    this.passwordMismatch = true;
    return;
  }

  this.loading = true;

  this.http.post<any>("http://localhost:8080/api/auth/signup", {
    name: this.name,
    email: this.email,
    password: this.password
  }).subscribe({
    next: (res) => {
      this.loading = false;

      form.resetForm(); // form clear

      let timerInterval: any;

      Swal.fire({
        title: "Successfully Registered 🎉",
        html: "Redirecting in <b></b> seconds...",
        icon: "success",
        timer: 3000,
        timerProgressBar: true,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
          const b = Swal.getHtmlContainer()?.querySelector("b");
         if (b) {
          timerInterval = setInterval(() => {
           b.textContent = String(Math.ceil(Swal.getTimerLeft()! / 1000));
           }, 100);
         }

        },
        willClose: () => {
          clearInterval(timerInterval);
          this.router.navigate(['/login']);
        }
      });
    },

    error: (err) => {
      this.loading = false;

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err.error?.message || "Something went wrong!",
      });
    }
  });

}



}
