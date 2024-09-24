import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from '../app/Components/LoginComponent/login/login.component';
import { RegistrationComponent } from './Components/registration/registration/registration.component';
import { WarehouseComponent } from './Components/Admin/warehouse/warehouse.component';
import { ManagerPageComponent } from './Components/Manager/manager-page/manager-page.component';
import { OperatorPageComponent } from './Components/Operator/operator-page/operator-page.component';
import { AuthGuardService } from './Guards/auth-guard-service.service';
import { RemovedProductsComponent } from './Components/Removed_Products/removed-products/removed-products.component';


const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'register', component: RegistrationComponent},
  {path: 'admin', component: WarehouseComponent, canActivate:[AuthGuardService]},
  {path:'manager', component :ManagerPageComponent,canActivate:[AuthGuardService]},
  {path:'operator', component:OperatorPageComponent,canActivate:[AuthGuardService]},
  {path:'removedproduct', component:RemovedProductsComponent,canActivate:[AuthGuardService]}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
