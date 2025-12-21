// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import {
  CatalogItem,
  CreateCatalogItemRequest,
  UpdateCatalogItemRequest,
  Gender,
  ItemType,
  GenderLabels,
  ItemTypeLabels,
  CreateCatalogItemImageRequest
} from '../../../../core/models';

@Component({
  selector: 'app-catalog-item-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatExpansionModule
  ],
  templateUrl: './catalog-item-edit.html',
  styleUrls: ['./catalog-item-edit.scss']
})
export class CatalogItemEdit implements OnInit, OnChanges {
  @Input() catalogItem: CatalogItem | null = null;
  @Input() isCreating: boolean = false;
  @Input() isSaving: boolean = false;
  @Input() errorMessage: string | null = null;

  @Output() save = new EventEmitter<CreateCatalogItemRequest | UpdateCatalogItemRequest>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;
  genderOptions = Object.entries(GenderLabels).map(([value, label]) => ({
    value: parseInt(value),
    label
  }));
  itemTypeOptions = Object.entries(ItemTypeLabels).map(([value, label]) => ({
    value: parseInt(value),
    label
  }));

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['catalogItem'] || changes['isCreating']) {
      this.initForm();
    }
  }

  private initForm(): void {
    const item = this.catalogItem;

    this.form = this.fb.group({
      brandName: [item?.brandName || '', [Validators.maxLength(200)]],
      description: [item?.description || '', [Validators.maxLength(1000)]],
      size: [item?.size || '', [Validators.maxLength(50)]],
      gender: [item?.gender ?? null],
      itemType: [item?.itemType ?? null],
      estimatedMSRP: [item?.estimatedMSRP ?? null, [Validators.min(0), Validators.max(100000)]],
      estimatedResaleValue: [item?.estimatedResaleValue ?? null, [Validators.min(0), Validators.max(100000)]],
      catalogItemImages: this.fb.array([])
    });

    if (this.isCreating && item?.catalogItemImages) {
      item.catalogItemImages.forEach(image => this.addImage(image.imageData, image.description));
    }
  }

  get imagesArray(): FormArray {
    return this.form.get('catalogItemImages') as FormArray;
  }

  addImage(imageData: string = '', description: string = ''): void {
    const imageGroup = this.fb.group({
      imageData: [imageData, [Validators.required]],
      description: [description, [Validators.maxLength(500)]]
    });
    this.imagesArray.push(imageGroup);
  }

  removeImage(index: number): void {
    this.imagesArray.removeAt(index);
  }

  onFileSelect(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        this.imagesArray.at(index).patchValue({ imageData: base64 });
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.value;

    if (this.isCreating) {
      const images: CreateCatalogItemImageRequest[] = formValue.catalogItemImages
        .filter((img: { imageData: string }) => img.imageData)
        .map((img: { imageData: string; description?: string }) => ({
          imageData: img.imageData,
          description: img.description || undefined
        }));

      const request: CreateCatalogItemRequest = {
        brandName: formValue.brandName || undefined,
        description: formValue.description || undefined,
        size: formValue.size || undefined,
        gender: formValue.gender ?? undefined,
        itemType: formValue.itemType ?? undefined,
        estimatedMSRP: formValue.estimatedMSRP ?? undefined,
        estimatedResaleValue: formValue.estimatedResaleValue ?? undefined,
        catalogItemImages: images.length > 0 ? images : undefined
      };
      this.save.emit(request);
    } else {
      const request: UpdateCatalogItemRequest = {
        brandName: formValue.brandName || undefined,
        description: formValue.description || undefined,
        size: formValue.size || undefined,
        gender: formValue.gender ?? undefined,
        itemType: formValue.itemType ?? undefined,
        estimatedMSRP: formValue.estimatedMSRP ?? undefined,
        estimatedResaleValue: formValue.estimatedResaleValue ?? undefined
      };
      this.save.emit(request);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
