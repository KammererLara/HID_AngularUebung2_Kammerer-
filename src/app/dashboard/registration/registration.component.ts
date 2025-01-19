import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { StoreService } from '../../shared/store.service';
import { BackendService } from '../../shared/backend.service';
import {LoadingSpinnerComponent} from "../../loading-spinner/loading-spinner.component";

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [SharedModule, LoadingSpinnerComponent],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
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

  cancelRegistration(registrationId: string) {
    this.loadingStates[registrationId] = true;

    this.backendService.deleteRegistration(registrationId)
      .subscribe({
        next: () => {
          this.loadingStates[registrationId] = false;
        },
        error: () => {
          this.loadingStates[registrationId] = false;
        }
      });
  }

  toggleSortOrder() {
    this.storeService.sortOrder = this.storeService.sortOrder === 'asc' ? 'desc' : 'asc';
    this.backendService.getRegistrations(this.storeService.currentPage, this.storeService.sortOrder);
  }
}
