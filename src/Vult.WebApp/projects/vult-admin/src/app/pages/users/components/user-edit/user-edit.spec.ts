// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';
import { UserEdit } from './user-edit';
import { User } from '../../../../core/models';

describe('UserEdit', () => {
  let component: UserEdit;
  let fixture: ComponentFixture<UserEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserEdit, ReactiveFormsModule],
      providers: [provideAnimations()]
    }).compileComponents();

    fixture = TestBed.createComponent(UserEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have password field when creating', () => {
    fixture.componentRef.setInput('isCreating', true);
    fixture.detectChanges();

    expect(component.form.contains('password')).toBeTruthy();
  });

  it('should not have password field when editing', () => {
    const mockUser: User = {
      userId: '1',
      username: 'testuser',
      email: 'test@example.com',
      isActive: true,
      createdDate: '2024-01-01',
      updatedDate: '2024-01-01'
    };

    fixture.componentRef.setInput('user', mockUser);
    fixture.componentRef.setInput('isCreating', false);
    fixture.detectChanges();

    expect(component.form.contains('password')).toBeFalsy();
  });

  it('should validate required username', () => {
    fixture.componentRef.setInput('isCreating', true);
    fixture.detectChanges();

    const usernameControl = component.form.get('username');
    usernameControl?.setValue('');
    expect(usernameControl?.hasError('required')).toBeTruthy();
  });

  it('should validate required email', () => {
    fixture.componentRef.setInput('isCreating', true);
    fixture.detectChanges();

    const emailControl = component.form.get('email');
    emailControl?.setValue('');
    expect(emailControl?.hasError('required')).toBeTruthy();
  });

  it('should validate email format', () => {
    fixture.componentRef.setInput('isCreating', true);
    fixture.detectChanges();

    const emailControl = component.form.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBeTruthy();
  });

  it('should emit save event with CreateUserRequest when creating', () => {
    fixture.componentRef.setInput('isCreating', true);
    fixture.detectChanges();

    const saveSpy = jest.fn();
    component.save.subscribe(saveSpy);

    component.form.setValue({
      username: 'newuser',
      email: 'new@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe'
    });

    component.onSubmit();

    expect(saveSpy).toHaveBeenCalledWith({
      username: 'newuser',
      email: 'new@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe'
    });
  });

  it('should emit cancel event', () => {
    const cancelSpy = jest.fn();
    component.cancel.subscribe(cancelSpy);

    component.onCancel();

    expect(cancelSpy).toHaveBeenCalled();
  });
});
