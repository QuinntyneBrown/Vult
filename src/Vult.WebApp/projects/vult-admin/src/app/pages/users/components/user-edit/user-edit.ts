// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, input, output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { User, CreateUserRequest, UpdateUserRequest } from '../../../../core/models';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './user-edit.html',
  styleUrls: ['./user-edit.scss']
})
export class UserEdit implements OnInit, OnChanges {
  user = input<User | null>(null);
  isCreating = input(false);
  isSaving = input(false);
  errorMessage = input<string | null>(null);

  save = output<CreateUserRequest | UpdateUserRequest>();
  cancel = output<void>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user'] || changes['isCreating']) {
      this.initForm();
    }
  }

  private initForm(): void {
    if (this.isCreating()) {
      this.form = this.fb.group({
        username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
        email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        firstName: ['', Validators.maxLength(100)],
        lastName: ['', Validators.maxLength(100)]
      });
    } else {
      const user = this.user();
      this.form = this.fb.group({
        username: [{ value: user?.username || '', disabled: true }],
        email: [{ value: user?.email || '', disabled: true }],
        firstName: [user?.firstName || '', Validators.maxLength(100)],
        lastName: [user?.lastName || '', Validators.maxLength(100)]
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.isCreating()) {
      const request: CreateUserRequest = {
        username: this.form.value.username,
        email: this.form.value.email,
        password: this.form.value.password,
        firstName: this.form.value.firstName || undefined,
        lastName: this.form.value.lastName || undefined
      };
      this.save.emit(request);
    } else {
      const request: UpdateUserRequest = {
        firstName: this.form.value.firstName || undefined,
        lastName: this.form.value.lastName || undefined
      };
      this.save.emit(request);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
