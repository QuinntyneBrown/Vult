// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, input, output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { Role, AccessRight } from '../../../../core/models';
import { CreateRoleRequest, UpdateRoleRequest } from '../../../../core/services/role.service';

@Component({
  selector: 'app-role-edit',
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
    MatSelectModule
  ],
  templateUrl: './role-edit.html',
  styleUrls: ['./role-edit.scss']
})
export class RoleEdit implements OnChanges {
  role = input<Role | null>(null);
  isCreating = input(false);
  isSaving = input(false);
  errorMessage = input<string | null>(null);

  save = output<CreateRoleRequest | UpdateRoleRequest>();
  cancel = output<void>();

  form: FormGroup;

  aggregates = ['User', 'Role', 'CatalogItem', 'InvitationToken'];
  accessRights = [
    { value: AccessRight.Read, label: 'Read' },
    { value: AccessRight.Write, label: 'Write' },
    { value: AccessRight.Create, label: 'Create' },
    { value: AccessRight.Delete, label: 'Delete' }
  ];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      privileges: this.fb.array([])
    });
  }

  get privilegesFormArray(): FormArray {
    return this.form.get('privileges') as FormArray;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['role'] || changes['isCreating']) {
      this.initForm();
    }
  }

  private initForm(): void {
    this.privilegesFormArray.clear();

    if (this.isCreating()) {
      this.form.reset();
      this.form.get('name')?.enable();
    } else if (this.role()) {
      const role = this.role()!;
      this.form.patchValue({
        name: role.name
      });

      // Populate privileges
      for (const privilege of role.privileges || []) {
        this.privilegesFormArray.push(this.fb.group({
          privilegeId: [privilege.privilegeId],
          aggregate: [privilege.aggregate, Validators.required],
          accessRight: [privilege.accessRight, Validators.required]
        }));
      }
    }
  }

  addPrivilege(): void {
    this.privilegesFormArray.push(this.fb.group({
      privilegeId: [null],
      aggregate: ['', Validators.required],
      accessRight: [AccessRight.Read, Validators.required]
    }));
  }

  removePrivilege(index: number): void {
    this.privilegesFormArray.removeAt(index);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const privileges = this.privilegesFormArray.controls.map(control => ({
      privilegeId: control.get('privilegeId')?.value || undefined,
      aggregate: control.get('aggregate')?.value,
      accessRight: control.get('accessRight')?.value
    }));

    if (this.isCreating()) {
      const request: CreateRoleRequest = {
        name: this.form.get('name')?.value,
        privileges: privileges.map(p => ({
          aggregate: p.aggregate,
          accessRight: p.accessRight
        }))
      };
      this.save.emit(request);
    } else {
      const request: UpdateRoleRequest = {
        name: this.form.get('name')?.value,
        privileges: privileges
      };
      this.save.emit(request);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  getAccessRightLabel(value: AccessRight): string {
    return this.accessRights.find(ar => ar.value === value)?.label || '';
  }
}
