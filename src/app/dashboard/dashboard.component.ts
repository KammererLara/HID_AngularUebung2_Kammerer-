import { Component } from '@angular/core';
import { RegistrationComponent } from './registration/registration.component';
import { AddDataComponent } from './add-data/add-data.component';
import { ButtonComponent } from './button/button.component';
import { CommonModule } from '@angular/common';
import {CourseComponent} from "./course/course.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RegistrationComponent, AddDataComponent, ButtonComponent, CommonModule, CourseComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  public showForm = true;

  buttonClicked() {
    this.showForm = !this.showForm;
  }
}
