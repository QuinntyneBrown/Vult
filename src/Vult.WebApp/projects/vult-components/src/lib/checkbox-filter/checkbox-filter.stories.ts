import type { Meta, StoryObj } from '@storybook/angular';
import { CheckboxFilterComponent, CheckboxOption } from './checkbox-filter.component';

const meta: Meta<CheckboxFilterComponent> = {
  title: 'Components/CheckboxFilter',
  component: CheckboxFilterComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<CheckboxFilterComponent>;

const brandOptions: CheckboxOption[] = [
  { id: 'nike', label: 'Nike', count: 234 },
  { id: 'jordan', label: 'Jordan', count: 89 },
  { id: 'converse', label: 'Converse', count: 45 },
  { id: 'hurley', label: 'Hurley', count: 23 },
];

const categoryOptions: CheckboxOption[] = [
  { id: 'running', label: 'Running', count: 156 },
  { id: 'basketball', label: 'Basketball', count: 78 },
  { id: 'lifestyle', label: 'Lifestyle', count: 234 },
  { id: 'training', label: 'Training & Gym', count: 89 },
  { id: 'soccer', label: 'Soccer', count: 45 },
];

export const Default: Story = {
  args: {
    label: 'Brand',
    options: brandOptions,
    collapsible: true,
  },
};

export const WithSelectedOptions: Story = {
  args: {
    label: 'Category',
    options: categoryOptions.map((opt, i) => ({ ...opt, checked: i < 2 })),
    collapsible: true,
  },
};

export const NonCollapsible: Story = {
  args: {
    label: 'Gender',
    options: [
      { id: 'men', label: 'Men', count: 456 },
      { id: 'women', label: 'Women', count: 389 },
      { id: 'unisex', label: 'Unisex', count: 67 },
    ],
    collapsible: false,
  },
};

export const WithoutCounts: Story = {
  args: {
    label: 'Features',
    options: [
      { id: 'waterproof', label: 'Waterproof' },
      { id: 'sustainable', label: 'Sustainable Materials' },
      { id: 'reflective', label: 'Reflective' },
    ],
    collapsible: true,
  },
};
