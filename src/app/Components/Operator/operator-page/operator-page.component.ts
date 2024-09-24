import { Component } from '@angular/core';
import { ServiceService } from '../../../service/service.service';
import { WareHouse } from '../../../Models/WareHouse';
import { Product } from '../../../Models/Product';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';  
@Component({
  selector: 'app-operator-page',
  templateUrl: './operator-page.component.html',
  styleUrls: ['./operator-page.component.css'] 
})
export class OperatorPageComponent {
  product!: Product[]; 
  loading: boolean = true;
  userId: number | null = Number(localStorage.getItem('userId'));
  productForm!: FormGroup; 
  removeProductForm!: FormGroup;

  constructor(private service: ServiceService, private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.get();  
    this.initForm();  
  }
  initForm() {
    this.productForm = this.fb.group({
      productName: ['', Validators.required],
      quantity: [0, [Validators.required, Validators.min(1)]],
      userId: [this.userId]  
    });

    // Form for removing product
    this.removeProductForm = this.fb.group({
      barcode: ['', Validators.required], 
      quantity: [0, [Validators.required, Validators.min(1)]], 
    });
  }
  get() {
    this.loading = true;
    if (this.userId !== null) { 
      this.service.getDataForOperator(this.userId).subscribe({
        next: (data: WareHouse[] | null) => {
          if (data && data.length > 0) {
            this.product = data;
          } else {
            console.warn('No data found for the given user ID or data is null');
            this.product = []; 
          }
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching data', err);
          this.loading = false; 
        }
      });
    } else {
      console.error('User ID is null');
      this.loading = false;
    }
  }
  addProduct() {
    if (this.productForm.valid) {
      const productData = this.productForm.value;
      this.service.addProduct(productData).subscribe({
        next: (response) => {
          console.log('Product added:', response);
          this.get();  
        },
        error: (err) => {
          console.error('Error adding product', err);
        }
      });
    } else {
      console.error('Form is invalid');
    }
  }
  submitRemoveProduct() {
    if (this.removeProductForm.valid) {
      const { barcode, quantity } = this.removeProductForm.value;
      console.log("Form Barcode:", barcode); 
      this.removeProduct(barcode, quantity);
    } else {
      console.error('Remove form is invalid');
    }
  }
  removeProduct(barcode: string, quantity: number) {
    this.service.removeProduct(barcode, quantity).subscribe( 
      response => {
        console.log(response);
        this.get(); 
      },
      error => {
        console.error(error); 
      }
    );
  }

  logOff() {
    localStorage.clear(); 
    this.router.navigate(['']);  
  }

  updateStatus(status: number) {
    const userIdString = localStorage.getItem('userId');
    if (userIdString) {
      const userId = parseInt(userIdString, 10);
  
      if (!isNaN(userId)) {
        this.service.updateUserStatus(userId, status).subscribe(
          response => {
            console.log('Status updated:', response.message);
          },
          error => {
            console.error('Error updating status:', error);
          }
        );
      } else {
        console.error('Invalid user ID');
      }
    } else {
      console.error('User ID is not available');
    }
  }
  
  
  
  
}
