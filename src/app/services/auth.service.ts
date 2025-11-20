import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  login(userData: any) {
    localStorage.setItem('token', userData.jwt);
    localStorage.setItem('name', userData.name);
    localStorage.setItem('email', userData.email);
  }

  isLoggedIn() {
    return localStorage.getItem('token') !== null;
  }

  logout() {
    localStorage.clear();
  }

  getUserName() {
    return localStorage.getItem('name');
  }

  getUserEmail() {
    return localStorage.getItem('email');
  }
}
