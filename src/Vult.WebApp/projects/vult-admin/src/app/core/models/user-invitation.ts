// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { UserDto } from './user';

export interface UserInvitationDto {
  userInvitationId: string;
  email: string;
  invitedByUserId: string;
  invitedByUsername?: string;
  sentAt: string;
  expiresAt: string;
  acceptedAt?: string;
  acceptedByUserId?: string;
  isAccepted: boolean;
  isExpired: boolean;
  isCancelled: boolean;
  cancelledAt?: string;
  roleIds: string[];
  createdDate: string;
}

export interface SendUserInvitationDto {
  email: string;
  roleIds?: string[];
}

export interface AcceptUserInvitationDto {
  token: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface GetUserInvitationsQueryResult {
  invitations: UserInvitationDto[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface SendUserInvitationCommandResult {
  invitation?: UserInvitationDto;
  success: boolean;
  errors: string[];
}

export interface AcceptUserInvitationCommandResult {
  user?: UserDto;
  success: boolean;
  errors: string[];
}

export interface CancelUserInvitationCommandResult {
  success: boolean;
  errors: string[];
}
