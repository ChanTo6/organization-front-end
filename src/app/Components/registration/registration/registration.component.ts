import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from '../../../service/service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  registrationForm!: FormGroup;
  ngOnInit(): void {
    localStorage.clear();
    this.registrationForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      employeeName: ['', Validators.required],
      employeeLastName: ['', Validators.required],
      organizationName: ['', Validators.required],
      organizationAddress: ['', Validators.required],
      email: ['', [Validators.email]],
      phoneNumber: ['', Validators.required],
      personId: [0, Validators.required],
      role: ['operator'],  
    });
  }
  
  constructor(private fb: FormBuilder, private service: ServiceService, private router: Router) {}

  onSubmit() {
    console.log(this.registrationForm)
    if (this.registrationForm.valid) {
      console.log('Form Data:', this.registrationForm.value); 
      this.service.register(this.registrationForm.value).subscribe(
        (response: any) => {
          console.log('Registration successful', response);
          this.registrationForm.reset();
        },
        (error: any) => {
          console.error('Registration failed', error);
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }
  


  navigateToAuthorization() {
    this.router.navigate(['/']);
  }
}
