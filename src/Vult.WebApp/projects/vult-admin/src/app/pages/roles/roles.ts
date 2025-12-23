// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BehaviorSubject } from 'rxjs';
import { RoleService, CreateRoleRequest, UpdateRoleRequest } from '../../core/services/role.service';
import { Role } from '../../core/models';
import { RoleList } from './components/role-list/role-list';
import { RoleEdit } from './components/role-edit/role-edit';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    RoleList,
    RoleEdit
  ],
  templateUrl: './roles.html',
  styleUrls: ['./roles.scss']
})
export class Roles implements OnInit {
  roles$ = new BehaviorSubject<Role[]>([]);
  selectedRole$ = new BehaviorSubject<Role | null>(null);
  isLoading$ = new BehaviorSubject<boolean>(false);
  isSaving$ = new BehaviorSubject<boolean>(false);
  isCreating$ = new BehaviorSubject<boolean>(false);
  errorMessage$ = new BehaviorSubject<string | null>(null);

  constructor(
    private roleService: RoleService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadRoles();

    this.route.params.subscribe(params => {
      const roleId = params['roleId'];
      if (roleId) {
        this.loadRole(roleId);
      } else {
        this.selectedRole$.next(null);
        this.isCreating$.next(false);
      }
    });
  }

  loadRoles(): void {
    this.isLoading$.next(true);
    this.roleService.getRoles().subscribe({
      next: (response) => {
        this.roles$.next(response.roles);
        this.isLoading$.next(false);
      },
      error: (error) => {
        this.errorMessage$.next(error.error?.message || 'Failed to load roles');
        this.isLoading$.next(false);
      }
    });
  }

  loadRole(roleId: string): void {
    this.isLoading$.next(true);
    this.roleService.getRoleById(roleId).subscribe({
      next: (role) => {
        this.selectedRole$.next(role);
        this.isLoading$.next(false);
      },
      error: () => {
        this.router.navigate(['/roles']);
        this.isLoading$.next(false);
      }
    });
  }

  onSelectRole(role: Role): void {
    this.router.navigate(['/roles', role.roleId]);
  }

  onCreate(): void {
    this.isCreating$.next(true);
    this.selectedRole$.next(null);
  }

  onSave(request: CreateRoleRequest | UpdateRoleRequest): void {
    this.isSaving$.next(true);
    this.errorMessage$.next(null);

    if (this.isCreating$.value) {
      this.roleService.createRole(request as CreateRoleRequest).subscribe({
        next: (role) => {
          this.loadRoles();
          this.router.navigate(['/roles', role.roleId]);
          this.isSaving$.next(false);
          this.isCreating$.next(false);
        },
        error: (error) => {
          this.errorMessage$.next(error.error?.message || 'Failed to create role');
          this.isSaving$.next(false);
        }
      });
    } else if (this.selectedRole$.value) {
      this.roleService.updateRole(this.selectedRole$.value!.roleId, request as UpdateRoleRequest).subscribe({
        next: (role) => {
          this.loadRoles();
          this.selectedRole$.next(role);
          this.isSaving$.next(false);
        },
        error: (error) => {
          this.errorMessage$.next(error.error?.message || 'Failed to update role');
          this.isSaving$.next(false);
        }
      });
    }
  }

  onDelete(role: Role): void {
    if (confirm(`Are you sure you want to delete role "${role.name}"?`)) {
      this.roleService.deleteRole(role.roleId).subscribe({
        next: () => {
          this.loadRoles();
          this.router.navigate(['/roles']);
        },
        error: (error) => {
          this.errorMessage$.next(error.error?.message || 'Failed to delete role');
        }
      });
    }
  }

  onCancel(): void {
    this.isCreating$.next(false);
    this.selectedRole$.next(null);
    this.errorMessage$.next(null);
    this.router.navigate(['/roles']);
  }
}
