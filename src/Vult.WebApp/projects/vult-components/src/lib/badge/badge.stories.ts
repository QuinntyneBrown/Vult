import type { Meta, StoryObj } from '@storybook/angular';
import { BadgeComponent } from './badge.component';

const meta: Meta<BadgeComponent> = {
  title: 'Components/Badge',
  component: BadgeComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'new', 'sale', 'member', 'sustainable', 'bestseller'],
    },
  },
};

export default meta;
type Story = StoryObj<BadgeComponent>;

export const Default: Story = {
  args: {
    variant: 'default',
  },
  render: (args) => ({
    props: args,
    template: `<lib-badge [variant]="variant">Just In</lib-badge>`,
  }),
};

export const New: Story = {
  args: {
    variant: 'new',
  },
  render: (args) => ({
    props: args,
    template: `<lib-badge [variant]="variant">New</lib-badge>`,
  }),
};

export const Sale: Story = {
  args: {
    variant: 'sale',
  },
  render: (args) => ({
    props: args,
    template: `<lib-badge [variant]="variant">20% Off</lib-badge>`,
  }),
};

export const Member: Story = {
  args: {
    variant: 'member',
  },
  render: (args) => ({
    props: args,
    template: `<lib-badge [variant]="variant">Member Exclusive</lib-badge>`,
  }),
};

export const Sustainable: Story = {
  args: {
    variant: 'sustainable',
  },
  render: (args) => ({
    props: args,
    template: `<lib-badge [variant]="variant">Sustainable</lib-badge>`,
  }),
};

export const Bestseller: Story = {
  args: {
    variant: 'bestseller',
  },
  render: (args) => ({
    props: args,
    template: `<lib-badge [variant]="variant">Best Seller</lib-badge>`,
  }),
};
