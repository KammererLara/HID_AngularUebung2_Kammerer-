import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { StoreService } from '../../shared/store.service';
import { BackendService } from '../../shared/backend.service';
import {HttpClient} from "@angular/common/http";
import {LoadingSpinnerComponent} from "../../loading-spinner/loading-spinner.component";

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [SharedModule, LoadingSpinnerComponent],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
  loading = false;
  loadingStates: { [id: string]: boolean } = {};

  constructor(public storeService: StoreService, private backendService: BackendService) {}

  public page: number = 0;

  selectPage(i: number) {
    let currentPage = i;
    this.storeService.currentPage = i;
    this.backendService.getRegistrations(currentPage, this.storeService.sortOrder);
  }

  public returnAllPages() {
    var pagesCount = Math.ceil(this.storeService.registrationTotalCount / this.backendService.pageSize);
    return Array.from({ length: pagesCount }, (_, i) => i + 1);
  }

  // cancelRegistration(registrationId: string) {
  //   this.loading = true;
  //   this.backendService.deleteRegistration(registrationId, this.storeService.currentPage, this.storeService.sortOrder);
  //   this.loading = false;
  // }

  cancelRegistration(registrationId: string) {
    // Setzt den Ladezustand auf true für die betroffene Zeile, um die Zeile während des Löschvorgangs auszugrauen
    this.loadingStates[registrationId] = true;

    // Löscht die Registrierung
    this.backendService.deleteRegistration(registrationId, this.storeService.currentPage, this.storeService.sortOrder);

    // Nach dem Löschen wird die betroffene Zeile zurückgesetzt (wenn sie gelöscht wurde)
    this.loadingStates[registrationId] = false;
  }


  toggleSortOrder() {
    this.storeService.sortOrder = this.storeService.sortOrder === 'asc' ? 'desc' : 'asc';
    this.backendService.getRegistrations(this.storeService.currentPage, this.storeService.sortOrder);
  }

  //TODO: sorted by birthdate
  sortedRegistrations() {
    return this.storeService.registrations.sort((a, b) => {
      const dateA = new Date(a.birthdate).getTime();
      const dateB = new Date(b.birthdate).getTime();
      return this.storeService.sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }
}
