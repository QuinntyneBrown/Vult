import type { Meta, StoryObj } from '@storybook/angular';
import { Badge } from './badge';

const meta: Meta<Badge> = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'new', 'sale', 'member', 'sustainable', 'bestseller'],
    },
  },
};

export default meta;
type Story = StoryObj<Badge>;

export const Default: Story = {
  args: {
    variant: 'default',
  },
  render: (args) => ({
    props: args,
    template: `<v-badge [variant]="variant">Just In</v-badge>`,
  }),
};

export const New: Story = {
  args: {
    variant: 'new',
  },
  render: (args) => ({
    props: args,
    template: `<v-badge [variant]="variant">New</v-badge>`,
  }),
};

export const Sale: Story = {
  args: {
    variant: 'sale',
  },
  render: (args) => ({
    props: args,
    template: `<v-badge [variant]="variant">20% Off</v-badge>`,
  }),
};

export const Member: Story = {
  args: {
    variant: 'member',
  },
  render: (args) => ({
    props: args,
    template: `<v-badge [variant]="variant">Member Exclusive</v-badge>`,
  }),
};

export const Sustainable: Story = {
  args: {
    variant: 'sustainable',
  },
  render: (args) => ({
    props: args,
    template: `<v-badge [variant]="variant">Sustainable</v-badge>`,
  }),
};

export const Bestseller: Story = {
  args: {
    variant: 'bestseller',
  },
  render: (args) => ({
    props: args,
    template: `<v-badge [variant]="variant">Best Seller</v-badge>`,
  }),
};
