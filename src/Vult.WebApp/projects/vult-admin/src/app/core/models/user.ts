// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

export type UserStatus = 'Active' | 'Inactive' | 'Locked' | 'Deleted';

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

export interface GetUserByIdQueryResult {
  user?: UserDto;
  found: boolean;
}

export interface GetUserRolesQueryResult {
  roles: RoleDto[];
  userFound: boolean;
}

export interface UserCommandResult {
  user?: UserDto;
  success: boolean;
  errors: string[];
}

export interface DeleteUserCommandResult {
  success: boolean;
  errors: string[];
}

// Type alias for backwards compatibility
export type User = UserDto;
export type Role = RoleDto;

// Legacy interfaces for backwards compatibility
export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  roleIds?: string[];
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  roleIds?: string[];
}
