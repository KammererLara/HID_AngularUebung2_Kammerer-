import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StoreService } from './store.service';
import { Course } from './Interfaces/Course';
import { Registration } from './Interfaces/Registration';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  public pageSize = 4;

  constructor(private http: HttpClient, private storeService: StoreService) { }

  public getCourses() {
      this.http.get<Course[]>('http://localhost:5000/courses?_expand=eventLocation').subscribe(data => {
        this.storeService.courses = data;
        this.storeService.coursesLoading = false;
        console.log('Kurse geladen:', data);
      });
  }

  public getRegistrations(page: number, sortOrder: 'asc' | 'desc') {
    const options = {
      observe: 'response' as const,
      params: {
        _expand: 'course',
        _page: page.toString(),
        _limit: this.pageSize.toString(),
        _sort: 'birthdate',
        _order: sortOrder
      }
    };

    this.http.get<Registration[]>('http://localhost:5000/registrations', options).subscribe(response => {
      this.storeService.registrations = response.body!;
      this.storeService.registrationTotalCount = Number(response.headers.get('X-Total-Count'));
      this.storeService.registrationsLoading = false;
    });
  }

  public addRegistration(registration: any, page: number, sortOrder: 'asc' | 'desc') {
    this.http.post('http://localhost:5000/registrations', registration).subscribe(_ => {
      this.getRegistrations(page, sortOrder);
    })
  }

  // public deleteRegistration(registrationId: string, page: number, sortOrder: 'asc' | 'desc') {
  //   this.http.delete(`http://localhost:5000/registrations/${registrationId}`).subscribe(_ => {
  //     this.getRegistrations(page, sortOrder);
  //   });
  // }
  public deleteRegistration(registrationId: string, page: number, sortOrder: 'asc' | 'desc') {
    return this.http.delete(`http://localhost:5000/registrations/${registrationId}`).subscribe(() => {
      // Nach erfolgreichem Löschen werden die Registrierungen neu geladen
      this.getRegistrations(page, sortOrder);
    });
  }

}
