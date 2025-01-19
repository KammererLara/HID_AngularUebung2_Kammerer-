import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StoreService } from './store.service';
import { Course } from './Interfaces/Course';
import { Registration } from './Interfaces/Registration';
import {catchError, Observable, tap, throwError} from "rxjs";

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
        _sort: 'registrationTimestamp',
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
    this.storeService.registrationsLoading = true;
    this.http.post('http://localhost:5000/registrations', registration).subscribe(_ => {
      this.getRegistrations(page, sortOrder);
    })
  }

  //INFO: die Methodensignatur ist nur mit page und sortOrder, damit durch einfaches Aus- und Einkommentieren dieser
  // Variante der Loading Spinner wieder gezeigt wird
  // das hier ist die performantere Variante, wodurch der Loading Spinner nie angezeigt wird
  // die Signatur ist somit nur gleich, dass nicht auch noch zusätzlich der Aufruf in registration.component.ts
  // angepasst werden muss - in dieser Variante werden die jedoch garnicht benötigt
  // public deleteRegistration(registrationId: string, page: number, sortOrder: 'asc' | 'desc'): Observable<void> {
  //   const index = this.storeService.registrations.findIndex(reg => reg.id === registrationId);
  //   if (index !== -1) {
  //     this.storeService.registrations.splice(index, 1);
  //   }
  //   return this.http.delete<void>(`http://localhost:5000/registrations/${registrationId}`).pipe(
  //     catchError(error => {
  //       console.error('Fehler beim Löschen der Registrierung', error);
  //       return throwError(error);
  //     })
  //   );
  // }

  public deleteRegistration(registrationId: string, page: number, sortOrder: 'asc' | 'desc'): Observable<void> {
    return this.http.delete<void>(`http://localhost:5000/registrations/${registrationId}`).pipe(
      tap(() => {
        this.getRegistrations(page, sortOrder);
      })
    );
  }
}
