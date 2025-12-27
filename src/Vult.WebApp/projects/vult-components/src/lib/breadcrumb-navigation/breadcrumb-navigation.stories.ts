import type { Meta, StoryObj } from '@storybook/angular';
import { BreadcrumbNavigation, BreadcrumbItem } from './breadcrumb-navigation';

const meta: Meta<BreadcrumbNavigation> = {
  title: 'Components/BreadcrumbNavigation',
  component: BreadcrumbNavigation,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<BreadcrumbNavigation>;

const defaultItems: BreadcrumbItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Men', href: '/men' },
  { label: 'Shoes', href: '/men/shoes' },
  { label: 'Running', isActive: true },
];

export const Default: Story = {
  args: {
    items: defaultItems,
  },
};

export const TwoLevels: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'New Releases', isActive: true },
    ],
  },
};

export const ManyLevels: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Men', href: '/men' },
      { label: 'Shoes', href: '/men/shoes' },
      { label: 'Running', href: '/men/shoes/running' },
      { label: 'Air Max', href: '/men/shoes/running/air-max' },
      { label: 'Air Max 90', isActive: true },
    ],
  },
};
