// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';
import { CatalogItemEdit } from './catalog-item-edit';
import { CatalogItem, Gender, ItemType } from '../../../../core/models';

describe('CatalogItemEdit', () => {
  let component: CatalogItemEdit;
  let fixture: ComponentFixture<CatalogItemEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogItemEdit, ReactiveFormsModule],
      providers: [provideAnimations()]
    }).compileComponents();

    fixture = TestBed.createComponent(CatalogItemEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have all required form fields', () => {
    expect(component.form.contains('brandName')).toBeTruthy();
    expect(component.form.contains('description')).toBeTruthy();
    expect(component.form.contains('size')).toBeTruthy();
    expect(component.form.contains('gender')).toBeTruthy();
    expect(component.form.contains('itemType')).toBeTruthy();
    expect(component.form.contains('estimatedMSRP')).toBeTruthy();
    expect(component.form.contains('estimatedResaleValue')).toBeTruthy();
  });

  it('should validate MSRP minimum value', () => {
    const msrpControl = component.form.get('estimatedMSRP');
    msrpControl?.setValue(-10);
    expect(msrpControl?.hasError('min')).toBeTruthy();
  });

  it('should validate MSRP maximum value', () => {
    const msrpControl = component.form.get('estimatedMSRP');
    msrpControl?.setValue(200000);
    expect(msrpControl?.hasError('max')).toBeTruthy();
  });

  it('should populate form when editing existing item', () => {
    const mockItem: CatalogItem = {
      catalogItemId: '1',
      brandName: 'Test Brand',
      description: 'Test description',
      size: 'L',
      gender: Gender.Mens,
      itemType: ItemType.Shirt,
      estimatedMSRP: 50,
      estimatedResaleValue: 30,
      createdDate: '2024-01-01',
      updatedDate: '2024-01-01'
    };

    fixture.componentRef.setInput('catalogItem', mockItem);
    fixture.componentRef.setInput('isCreating', false);
    fixture.detectChanges();

    expect(component.form.get('brandName')?.value).toBe('Test Brand');
    expect(component.form.get('description')?.value).toBe('Test description');
    expect(component.form.get('size')?.value).toBe('L');
    expect(component.form.get('gender')?.value).toBe(Gender.Mens);
    expect(component.form.get('itemType')?.value).toBe(ItemType.Shirt);
  });

  it('should emit save event with UpdateCatalogItemRequest when editing', () => {
    const saveSpy = jest.fn();
    component.save.subscribe(saveSpy);

    fixture.componentRef.setInput('isCreating', false);
    fixture.detectChanges();

    component.form.patchValue({
      brandName: 'Updated Brand',
      size: 'XL',
      estimatedResaleValue: 100
    });

    component.onSubmit();

    expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining({
      brandName: 'Updated Brand',
      size: 'XL',
      estimatedResaleValue: 100
    }));
  });

  it('should be able to add images when creating', () => {
    fixture.componentRef.setInput('isCreating', true);
    fixture.detectChanges();

    expect(component.imagesArray.length).toBe(0);

    component.addImage('base64data', 'Test image');

    expect(component.imagesArray.length).toBe(1);
    expect(component.imagesArray.at(0).get('imageData')?.value).toBe('base64data');
    expect(component.imagesArray.at(0).get('description')?.value).toBe('Test image');
  });

  it('should be able to remove images', () => {
    fixture.componentRef.setInput('isCreating', true);
    fixture.detectChanges();

    component.addImage('image1', 'desc1');
    component.addImage('image2', 'desc2');

    expect(component.imagesArray.length).toBe(2);

    component.removeImage(0);

    expect(component.imagesArray.length).toBe(1);
    expect(component.imagesArray.at(0).get('imageData')?.value).toBe('image2');
  });

  it('should emit cancel event', () => {
    const cancelSpy = jest.fn();
    component.cancel.subscribe(cancelSpy);

    component.onCancel();

    expect(cancelSpy).toHaveBeenCalled();
  });
});
