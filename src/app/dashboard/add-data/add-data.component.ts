import {Component, OnInit} from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { StoreService } from '../../shared/store.service';
import { SharedModule } from '../../shared/shared.module';
import { BackendService } from '../../shared/backend.service';
import { MatFormFieldModule} from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSelectModule } from "@angular/material/select";

@Component({
  selector: 'app-add-data',
  standalone: true,
  imports: [
    SharedModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
  ],
  templateUrl: './add-data.component.html',
  styleUrls: ['./add-data.component.css']
})
export class AddDataComponent implements OnInit {
  public registrationForm: any;
  public showToast: boolean = false;

  constructor(
    private formbuilder: FormBuilder,
    public storeService: StoreService,
    private backendService: BackendService) {}

  ngOnInit(): void {
    this.registrationForm = this.formbuilder.group({
      name: ['', [Validators.required]],
      birthdate: ['', Validators.required],
      email: [{ value: '', disabled: true }, [Validators.email]],
      newsletter: [false],
      courseId: ['', Validators.required],
    })

    this.registrationForm.get('newsletter')?.valueChanges.subscribe((checked: boolean) => {
      this.toggleEmailField(checked);
    });
  }

  onSubmit() {
    if(this.registrationForm.valid) {
      try {
        this.backendService.addRegistration(this.registrationForm.value, this.storeService.currentPage, this.storeService.sortOrder);
        this.showToast = true;
        setTimeout(() => {
          this.hideToast();
          this.resetForm();
        }, 5000);
      } catch(err) {
          console.error('Fehler bei der Registrierung:', err);
      }
    }
  }

  hideToast() {
    this.showToast = false;
  }

  resetForm() {
    this.registrationForm.reset();
    Object.keys(this.registrationForm.controls).forEach(controlName => {
      const control = this.registrationForm.get(controlName);
      if (control) {
        control.markAsPristine();
        control.markAsUntouched();
        control.setErrors(null);
      }
    });
  }

  toggleEmailField(checked: boolean): void {
    const emailControl = this.registrationForm.get('email');

    if (checked) {
      emailControl?.enable();
      emailControl?.setValidators([Validators.required, Validators.email]);
    } else {
      emailControl?.disable();
      emailControl?.clearValidators();
    }

    emailControl?.updateValueAndValidity();
  }
}
