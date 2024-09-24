import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../../../service/service.service';
import { WareHouse } from '../../../Models/WareHouse';
import { Router } from '@angular/router';  
@Component({
  selector: 'app-manager-page',
  templateUrl: './manager-page.component.html',
  styleUrls: ['./manager-page.component.css']
})
export class ManagerPageComponent implements OnInit {
  product!: WareHouse[]; 
  loading: boolean = true;

  constructor(private service: ServiceService,  private router: Router) {}

  ngOnInit(): void {
    this.get();
  }

  get() {
    this.loading = true; 
    this.service.FetchProducts().subscribe({
      next: (data: WareHouse[]) => {
        this.product = data; 
   //     console.log(this.product); 
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching data', err);
        this.loading = false; 
      }
    });
  }
  logOff() {
    localStorage.clear(); 
    this.router.navigate(['']);  
  }
  goToRemovedProducts() {
    this.router.navigate(['/removedproduct']);
  }
  
}
