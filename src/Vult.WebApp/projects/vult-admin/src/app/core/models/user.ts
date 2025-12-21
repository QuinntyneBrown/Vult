// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

export interface User {
  userId: string;
  username: string;
  email?: string;
  defaultProfileId?: string;
  isActive?: boolean;
  roles: Role[];
}

export interface Role {
  roleId: string;
  name: string;
  privileges: Privilege[];
}

export interface Privilege {
  privilegeId: string;
  roleId: string;
  aggregate: string;
  accessRight: AccessRight;
}

export enum AccessRight {
  None = 0,
  Read = 1,
  Write = 2,
  Create = 3,
  Delete = 4
}

export interface CreateUserRequest {
  username: string;
  password: string;
  roles: string[];
}

export interface UpdateUserRequest {
  username?: string;
  roles?: string[];
}
