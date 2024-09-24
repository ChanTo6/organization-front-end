import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';  
import { ServiceService } from '../../../service/service.service';
import { UserData } from '../../../Models/UserData';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private service: ServiceService, private router: Router) { }

  ngOnInit(): void {
    localStorage.clear();
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;
      this.service.login(loginData).subscribe({
        next: (response: any) => {

          const role = response.role; 
          const userId = response.userId;
          
      
          localStorage.setItem('role', role);
  
    
          if (role === 'admin') {
            this.router.navigate(['/admin']);
          } else if (role === 'operator') {
            this.router.navigate(['/operator']);
          } else if (role === 'manager') {
            this.router.navigate(['/manager']);
          } else {
            console.error('Unknown role:', role);
            alert('Login successful, but unable to navigate due to unknown role');
          }
        },
        error: (error: any) => {
          console.error('Login failed', error);
          alert('Invalid username or password');
        }
      });
    }
  }
  
  
  
  navigateToRegistration() {
    this.router.navigate(['/register']);
  }
}
