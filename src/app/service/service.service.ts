import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, lastValueFrom, map, Observable, of, throwError } from 'rxjs';
import { LoginRequest } from '../Models/LoginRequest';
import { UserData } from '../Models/UserData';
import { Employee } from '../Models/Employee';
import { WareHouse } from '../Models/WareHouse';
import { Product } from '../Models/Product';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  baseApiUrl :string = "https://localhost:7022/api/Home";

   userId = localStorage.getItem('userId'); 

   removeProduct(barcode: string, quantity: number): Observable<any> {
    const userId = localStorage.getItem('userId'); 

    if (userId) {
      const body = { userId: Number(userId), barcode, quantity };
      console.log(body);
      return this.http.post<any>(`${this.baseApiUrl}/RemoveProduct`, body)
        .pipe(catchError(err => {
          console.error('Error occurred:', err);
          return throwError(err);
        }));
    } else {
      console.error('User ID is not available in localStorage.');
      return throwError('User ID is required'); 
    }
  }

  constructor(private http: HttpClient) { }
  DeleteEmployeeAsync(userId: number): Observable<void>{
    // const token = this.getToken(); 
    // const headers = new HttpHeaders({
    //   'Authorization': `Bearer ${token}` 
    // });
    return this.http.post<void>(`${this.baseApiUrl}/DeleteUser`,  userId 
     // { headers }
     );
}
  UpdateEmployeeAsync(employee: Employee): Observable<void> {
    // const token = this.getToken(); 
    // const headers = new HttpHeaders({
    //   'Authorization': `bearer ${token}`,
    //   'Content-Type': 'application/json'
    // });
    return this.http.post<void>(`${this.baseApiUrl}/UpdateUserByPersonId`, employee, 
  //    { headers }
    );
  }

  login(request: LoginRequest): Observable<any> {
    return this.http.post<any>(`${this.baseApiUrl}/Login`, request).pipe(
      map((response: any) => {
        if (response && response.token) {
          const token = response.token;
          const role = response.role;
          const userId = response.userId;


          localStorage.setItem('token', token);
          localStorage.setItem('role', role);
          localStorage.setItem('userId', userId.toString()); 

          // console.log('Token:', token);
          // console.log('Role:', role);
          // console.log('User ID:', userId);
          return response;
        } else {
          console.error('Login response is missing token');
          throw new Error('Login response is missing token');
        }
      })
    );
  }
  updateUserStatus(userId: number, status: number): Observable<any> {
    console.log(userId, status);
    return this.http.post(`${this.baseApiUrl}/UpdateUserStatus`, { userId, status }).pipe(
        catchError(error => {
            console.error('Error occurred:', error);
            return throwError('An error occurred while updating user status. Please try again later.');
        })
    );
}


  
  
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
  }
  register(formData: UserData): Observable<any> {
    console.log(formData);
    return this.http.post<any>(`${this.baseApiUrl}/CreateUser`,formData);
}

GetAllProjectUsersAsync(): Observable<any> {
    const token = localStorage.getItem('token'); 
    const headers = new HttpHeaders({
      'Authorization': `bearer ${token}` 
    });
    return this.http.get<any>(`${this.baseApiUrl}/GetAllProjectUsersAsync`, { headers });
  }

  getEmployees(): Observable<Employee[]> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `bearer ${token}`
    });
    return this.http.get<Employee[]>(`${this.baseApiUrl}/GetEmployees`, { headers });
  }
  

  FetchProducts(): Observable<WareHouse[]> {
    return this.http.get<WareHouse[]>(`${this.baseApiUrl}/FetchProducts`);
  }

  FetchTakenProducts(): Observable<WareHouse[]> {
    return this.http.get<WareHouse[]>(`${this.baseApiUrl}/FetchTakenProducts`);
  }

  getDataForOperator(userId: number): Observable<WareHouse[]> {
    return this.http.get<WareHouse[]>(`${this.baseApiUrl}/FetchProductbyuserId/${userId}`).pipe(
      catchError((error) => {
        if (error.status !== 404) {
          console.error('Error fetching data from API', error);
        }
        return of([]); 
      })
    );
  }


  addProduct(product: Product): Observable<any> {
     const token = this.getToken();
    const headers = new HttpHeaders({
       'Authorization': `bearer ${token}`,  
       'Content-Type': 'application/json'
     });
    return this.http.post<any>(`${this.baseApiUrl}/AddProduct`, product,
       { headers }
      );
  }


  getAllProjectUsersWithStatus(): Observable<any> {
    return this.http.get('/api/GetAllProjectUsersWithStatus');
  }

  getAllOrganizationNames(): Observable<string[]> {
    const token = this.getToken(); 
    const headers = new HttpHeaders({
        'Authorization': `bearer ${token}`,  
        'Content-Type': 'application/json'
    });

    return this.http.get<string[]>(`${this.baseApiUrl}/GetAllOrganizationNamesAsync`, { headers }).pipe(
        catchError((error) => {
            console.error('Error fetching organization names:', error);
            return throwError(() => new Error('Failed to fetch organization names. Please try again later.'));
        })
    );
}


}
