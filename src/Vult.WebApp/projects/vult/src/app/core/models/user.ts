// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

export interface User {
  userId: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isActive: boolean;
  createdDate: string;
  updatedDate: string;
  lastLoginDate?: string;
  roles?: Role[];
}

export interface Role {
  roleId: string;
  name: string;
  description?: string;
}
