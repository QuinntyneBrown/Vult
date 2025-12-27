import type { Meta, StoryObj } from '@storybook/angular';
import { MobileFilterToggle } from './mobile-filter-toggle';

const meta: Meta<MobileFilterToggle> = {
  title: 'Components/MobileFilterToggle',
  component: MobileFilterToggle,
  tags: ['autodocs'],
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export default meta;
type Story = StoryObj<MobileFilterToggle>;

export const Default: Story = {
  args: {
    isActive: false,
    showText: 'Show Filters',
    hideText: 'Hide Filters',
    activeFilterCount: 0,
  },
};

export const Active: Story = {
  args: {
    isActive: true,
    showText: 'Show Filters',
    hideText: 'Hide Filters',
    activeFilterCount: 0,
  },
};

export const WithActiveFilters: Story = {
  args: {
    isActive: false,
    showText: 'Show Filters',
    hideText: 'Hide Filters',
    activeFilterCount: 3,
  },
};

export const CustomText: Story = {
  args: {
    isActive: false,
    showText: 'Filter & Sort',
    hideText: 'Close',
    activeFilterCount: 0,
  },
};
