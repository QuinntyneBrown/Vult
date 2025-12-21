// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, input, output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
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
    MatProgressSpinnerModule,
    MatChipsModule
  ],
  templateUrl: './user-edit.html',
  styleUrls: ['./user-edit.scss']
})
export class UserEdit implements OnChanges {
  user = input<User | null>(null);
  isCreating = input(false);
  isSaving = input(false);
  errorMessage = input<string | null>(null);

  save = output<CreateUserRequest | UpdateUserRequest>();
  cancel = output<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      roles: ['']
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user'] || changes['isCreating']) {
      this.initForm();
    }
  }

  private initForm(): void {
    if (this.isCreating()) {
      this.form.reset();
      this.form.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.form.get('username')?.enable();
      this.form.get('email')?.enable();
    } else if (this.user()) {
      const user = this.user()!;
      this.form.patchValue({
        username: user.username,
        email: (user as any).email || '',
        roles: user.roles.map(r => r.name).join(', ')
      });
      this.form.get('password')?.clearValidators();
      this.form.get('username')?.disable();
      this.form.get('email')?.disable();
    }
    this.form.get('password')?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const rolesValue = this.form.get('roles')?.value || '';
    const roles = rolesValue.split(',').map((r: string) => r.trim()).filter((r: string) => r);

    if (this.isCreating()) {
      const request: CreateUserRequest = {
        username: this.form.get('username')?.value,
        password: this.form.get('password')?.value,
        roles: roles
      };
      this.save.emit(request);
    } else {
      const request: UpdateUserRequest = {
        roles: roles
      };
      this.save.emit(request);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
