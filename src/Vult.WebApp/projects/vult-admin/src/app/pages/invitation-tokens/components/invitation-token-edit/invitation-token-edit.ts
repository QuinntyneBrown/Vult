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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import {
  InvitationToken,
  InvitationTokenType,
  CreateInvitationTokenRequest,
  UpdateInvitationTokenRequest
} from '../../../../core/services/invitation-token.service';

@Component({
  selector: 'app-invitation-token-edit',
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
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule
  ],
  templateUrl: './invitation-token-edit.html',
  styleUrls: ['./invitation-token-edit.scss']
})
export class InvitationTokenEdit implements OnChanges {
  invitationToken = input<InvitationToken | null>(null);
  isCreating = input(false);
  isSaving = input(false);
  errorMessage = input<string | null>(null);

  save = output<CreateInvitationTokenRequest | UpdateInvitationTokenRequest>();
  cancel = output<void>();

  form: FormGroup;

  tokenTypes = [
    { value: InvitationTokenType.Standard, label: 'Standard' }
  ];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      value: ['', [Validators.required]],
      expiry: [null],
      type: [InvitationTokenType.Standard, [Validators.required]]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['invitationToken'] || changes['isCreating']) {
      this.initForm();
    }
  }

  private initForm(): void {
    if (this.isCreating()) {
      this.form.reset({
        value: this.generateToken(),
        expiry: null,
        type: InvitationTokenType.Standard
      });
      this.form.get('value')?.enable();
      this.form.get('type')?.enable();
    } else if (this.invitationToken()) {
      const token = this.invitationToken()!;
      this.form.patchValue({
        value: token.value,
        expiry: token.expiry ? new Date(token.expiry) : null,
        type: token.type
      });
      this.form.get('value')?.disable();
      this.form.get('type')?.disable();
    }
  }

  private generateToken(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const expiry = this.form.get('expiry')?.value;

    if (this.isCreating()) {
      const request: CreateInvitationTokenRequest = {
        value: this.form.get('value')?.value,
        expiry: expiry ? expiry.toISOString() : undefined,
        type: this.form.get('type')?.value
      };
      this.save.emit(request);
    } else {
      const request: UpdateInvitationTokenRequest = {
        expiry: expiry ? expiry.toISOString() : undefined
      };
      this.save.emit(request);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
