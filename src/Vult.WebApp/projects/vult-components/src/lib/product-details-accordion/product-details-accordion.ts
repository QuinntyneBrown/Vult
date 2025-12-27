import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, signal, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface AccordionSection {
  id: string;
  title: string;
  content: string;
  isExpanded?: boolean;
  disabled?: boolean;
}

@Component({
  selector: 'v-product-details-accordion',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="accordion" role="region" [attr.aria-label]="ariaLabel">
      @for (section of sections; track section.id) {
        <div
          class="accordion-item"
          [class.is-expanded]="expandedIds().includes(section.id)"
        >
          <button
            class="accordion-header"
            [class.is-disabled]="section.disabled"
            [attr.aria-expanded]="expandedIds().includes(section.id)"
            [attr.aria-controls]="'panel-' + section.id"
            [disabled]="section.disabled"
            (click)="toggleSection(section)"
          >
            <span class="accordion-title">{{ section.title }}</span>
            <svg class="accordion-chevron" viewBox="0 0 24 24">
              <polyline points="6 9 12 15 18 9" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"></polyline>
            </svg>
          </button>
          <div
            class="accordion-panel"
            [id]="'panel-' + section.id"
            [attr.aria-hidden]="!expandedIds().includes(section.id)"
          >
            <div class="accordion-content">
              <div class="accordion-content-inner" [innerHTML]="section.content"></div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .accordion {
      border-top: 1px solid #e5e5e5;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    }

    .accordion-item {
      border-bottom: 1px solid #e5e5e5;
    }

    .accordion-header {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 0;
      background: none;
      border: none;
      cursor: pointer;
      text-align: left;
      font-family: inherit;
      transition: opacity 0.15s ease;
    }

    .accordion-header:hover .accordion-title {
      text-decoration: underline;
    }

    .accordion-header:focus {
      outline: none;
    }

    .accordion-header:focus-visible {
      outline: 2px solid #111111;
      outline-offset: 2px;
    }

    .accordion-header.is-disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .accordion-header.is-disabled:hover .accordion-title {
      text-decoration: none;
    }

    .accordion-title {
      font-size: 18px;
      font-weight: 500;
      color: #111111;
      flex: 1;
      margin: 0;
    }

    .accordion-chevron {
      width: 24px;
      height: 24px;
      stroke: #111111;
      flex-shrink: 0;
      transition: transform 0.2s ease;
    }

    .accordion-item.is-expanded .accordion-chevron {
      transform: rotate(180deg);
    }

    .accordion-panel {
      display: grid;
      grid-template-rows: 0fr;
      transition: grid-template-rows 0.2s ease;
    }

    .accordion-item.is-expanded .accordion-panel {
      grid-template-rows: 1fr;
    }

    .accordion-content {
      overflow: hidden;
    }

    .accordion-content-inner {
      padding-bottom: 24px;
      font-size: 16px;
      color: #111111;
      line-height: 1.7;
    }

    .accordion-content-inner p {
      margin-bottom: 12px;
    }

    .accordion-content-inner p:last-child {
      margin-bottom: 0;
    }

    .accordion-content-inner ul {
      list-style: disc;
      padding-left: 20px;
      margin: 12px 0;
    }

    .accordion-content-inner li {
      margin-bottom: 8px;
    }

    .accordion-content-inner li:last-child {
      margin-bottom: 0;
    }

    .accordion-content-inner a {
      color: #111111;
      text-decoration: underline;
      transition: color 0.15s ease;
    }

    .accordion-content-inner a:hover {
      color: #757575;
    }

    @media (max-width: 768px) {
      .accordion-title {
        font-size: 16px;
      }

      .accordion-content-inner {
        font-size: 14px;
        padding-bottom: 16px;
      }

      .accordion-header {
        padding: 16px 0;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .accordion-chevron,
      .accordion-panel {
        transition: none;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailsAccordion {
  @Input() sections: AccordionSection[] = [];
  @Input() mode: 'single' | 'multiple' = 'multiple';
  @Input() ariaLabel = 'Product information';
  @Input() set initialExpandedIds(value: string[]) {
    this.expandedIds.set(value);
  }

  @Output() sectionToggle = new EventEmitter<{ id: string; isExpanded: boolean }>();
  @Output() expandedChange = new EventEmitter<string[]>();

  expandedIds = signal<string[]>([]);

  toggleSection(section: AccordionSection): void {
    if (section.disabled) return;

    const currentExpanded = this.expandedIds();
    const isCurrentlyExpanded = currentExpanded.includes(section.id);

    let newExpanded: string[];

    if (this.mode === 'single') {
      // In single mode, close all others and toggle current
      newExpanded = isCurrentlyExpanded ? [] : [section.id];
    } else {
      // In multiple mode, toggle current section
      if (isCurrentlyExpanded) {
        newExpanded = currentExpanded.filter(id => id !== section.id);
      } else {
        newExpanded = [...currentExpanded, section.id];
      }
    }

    this.expandedIds.set(newExpanded);
    this.sectionToggle.emit({ id: section.id, isExpanded: !isCurrentlyExpanded });
    this.expandedChange.emit(newExpanded);
  }
}
