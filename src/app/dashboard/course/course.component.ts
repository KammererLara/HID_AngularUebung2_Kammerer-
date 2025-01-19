import { Component } from '@angular/core';
import {DatePipe, NgForOf} from "@angular/common";
import {StoreService} from "../../shared/store.service";

@Component({
  selector: 'app-course',
  standalone: true,
  imports: [
    DatePipe,
    NgForOf
  ],
  templateUrl: './course.component.html',
  styleUrl: './course.component.css'
})
export class CourseComponent {
  constructor(public storeService: StoreService) {}
}
