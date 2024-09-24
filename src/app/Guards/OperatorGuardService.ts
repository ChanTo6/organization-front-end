import { Injectable } from "@angular/core";
import { AuthService } from "./AuthService";
import { CanActivate } from "@angular/router";
import { Router } from '@angular/router';  
@Injectable({
    providedIn: 'root'
  })
  export class OperatorGuardService implements CanActivate {
  
    constructor(private authService: AuthService, private router: Router) { }
  
    canActivate(): boolean {
      const role = this.authService.getUserRole();
      if (role === 'operator') {
        return true;
      } else {
        this.router.navigate(['/']);
        return false;
      }
    }
  }
  