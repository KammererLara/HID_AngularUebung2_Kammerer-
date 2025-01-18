import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { BackendService } from './shared/backend.service';
import { SharedModule } from './shared/shared.module';
import { StoreService } from './shared/store.service';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SharedModule, LoadingSpinnerComponent],
  providers: [BackendService, StoreService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  constructor(private backendService: BackendService, public storeService: StoreService) {}

  ngOnInit() {
    this.backendService.getCourses();
    this.backendService.getRegistrations(this.storeService.currentPage, this.storeService.sortOrder);
  }
}
