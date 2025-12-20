// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface UserDto {
  userId: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  status: UserStatus;
  createdDate: string;
  updatedDate: string;
  lastLoginDate?: string;
  activatedAt?: string;
  activationMethod?: string;
  deactivatedAt?: string;
  deactivationReason?: string;
  lockedAt?: string;
  lockReason?: string;
  lockExpiresAt?: string;
  deletedAt?: string;
  deletionType?: string;
  deletionReason?: string;
  canRecover: boolean;
  roles: RoleDto[];
}

export interface RoleDto {
  roleId: string;
  name: string;
  description?: string;
}

export type UserStatus = 'Active' | 'Inactive' | 'Locked' | 'Deleted';

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  roleIds?: string[];
}

export interface ActivateUserDto {
  activationMethod: string;
}

export interface DeactivateUserDto {
  reason: string;
}

export interface LockUserDto {
  reason: string;
  durationMinutes?: number;
}

export interface DeleteUserDto {
  reason: string;
  hardDelete: boolean;
}

export interface GetUsersQueryResult {
  users: UserDto[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface GetUserRolesQueryResult {
  roles: RoleDto[];
  userFound: boolean;
}
