import type { Meta, StoryObj } from '@storybook/angular';
import { FilterSidebarComponent, FilterSection } from './filter-sidebar.component';

const meta: Meta<FilterSidebarComponent> = {
  title: 'Components/FilterSidebar',
  component: FilterSidebarComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<FilterSidebarComponent>;

const filterSections: FilterSection[] = [
  {
    id: 'gender',
    title: 'Gender',
    type: 'checkbox',
    expanded: true,
    options: [
      { id: 'men', label: 'Men', count: 456 },
      { id: 'women', label: 'Women', count: 389 },
      { id: 'unisex', label: 'Unisex', count: 67 },
    ],
  },
  {
    id: 'brand',
    title: 'Brand',
    type: 'checkbox',
    expanded: true,
    options: [
      { id: 'nike', label: 'Nike', count: 234 },
      { id: 'jordan', label: 'Jordan', count: 89 },
      { id: 'converse', label: 'Converse', count: 45 },
    ],
  },
  {
    id: 'category',
    title: 'Category',
    type: 'checkbox',
    expanded: false,
    options: [
      { id: 'running', label: 'Running', count: 156 },
      { id: 'basketball', label: 'Basketball', count: 78 },
      { id: 'lifestyle', label: 'Lifestyle', count: 234 },
      { id: 'training', label: 'Training & Gym', count: 89 },
    ],
  },
  {
    id: 'price',
    title: 'Shop by Price',
    type: 'checkbox',
    expanded: false,
    options: [
      { id: 'under-50', label: 'Under $50' },
      { id: '50-100', label: '$50 - $100' },
      { id: '100-150', label: '$100 - $150' },
      { id: 'over-150', label: 'Over $150' },
    ],
  },
];

export const Default: Story = {
  args: {
    title: 'Filters',
    sections: filterSections,
    showClearButton: true,
    showCloseButton: false,
  },
};

export const WithCloseButton: Story = {
  args: {
    title: 'Filters',
    sections: filterSections,
    showClearButton: true,
    showCloseButton: true,
  },
};

export const WithSelectedFilters: Story = {
  args: {
    title: 'Filters',
    sections: filterSections.map((section, i) => ({
      ...section,
      options: section.options?.map((opt, j) => ({
        ...opt,
        checked: i === 0 && j === 0,
      })),
    })),
    showClearButton: true,
  },
};

export const AllExpanded: Story = {
  args: {
    title: 'Filters',
    sections: filterSections.map(s => ({ ...s, expanded: true })),
    showClearButton: true,
  },
};
