import type { Meta, StoryObj } from '@storybook/angular';
import { SortDropdownComponent, SortOption } from './sort-dropdown.component';

const meta: Meta<SortDropdownComponent> = {
  title: 'Components/SortDropdown',
  component: SortDropdownComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<SortDropdownComponent>;

const sortOptions: SortOption[] = [
  { id: 'featured', label: 'Featured' },
  { id: 'newest', label: 'Newest' },
  { id: 'price-high', label: 'Price: High-Low' },
  { id: 'price-low', label: 'Price: Low-High' },
  { id: 'bestselling', label: 'Best Selling' },
];

export const Default: Story = {
  args: {
    options: sortOptions,
    label: 'Sort By:',
    showLabel: true,
    selectedOptionId: 'featured',
  },
};

export const WithoutLabel: Story = {
  args: {
    options: sortOptions,
    showLabel: false,
    selectedOptionId: 'featured',
  },
};

export const NoSelection: Story = {
  args: {
    options: sortOptions,
    label: 'Sort By:',
    showLabel: true,
  },
};
