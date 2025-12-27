import type { Meta, StoryObj } from '@storybook/angular';
import { IconButton } from './icon-button';

const meta: Meta<IconButton> = {
  title: 'Components/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    variant: {
      control: 'select',
      options: ['default', 'filled', 'outlined'],
    },
  },
};

export default meta;
type Story = StoryObj<IconButton>;

const heartIcon = `
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M10 17.5L8.79167 16.4167C4.5 12.5417 1.66667 10 1.66667 6.875C1.66667 4.34167 3.68333 2.5 6.25 2.5C7.7 2.5 9.09167 3.175 10 4.24167C10.9083 3.175 12.3 2.5 13.75 2.5C16.3167 2.5 18.3333 4.34167 18.3333 6.875C18.3333 10 15.5 12.5417 11.2083 16.425L10 17.5Z" stroke="currentColor" stroke-width="1.5"/>
  </svg>
`;

const closeIcon = `
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  </svg>
`;

export const Default: Story = {
  args: {
    size: 'medium',
    variant: 'default',
    ariaLabel: 'Favorite',
  },
  render: (args) => ({
    props: args,
    template: `<v-icon-button [size]="size" [variant]="variant" [ariaLabel]="ariaLabel">${heartIcon}</v-icon-button>`,
  }),
};

export const Filled: Story = {
  args: {
    size: 'medium',
    variant: 'filled',
    ariaLabel: 'Favorite',
  },
  render: (args) => ({
    props: args,
    template: `<v-icon-button [size]="size" [variant]="variant" [ariaLabel]="ariaLabel">${heartIcon}</v-icon-button>`,
  }),
};

export const Outlined: Story = {
  args: {
    size: 'medium',
    variant: 'outlined',
    ariaLabel: 'Close',
  },
  render: (args) => ({
    props: args,
    template: `<v-icon-button [size]="size" [variant]="variant" [ariaLabel]="ariaLabel">${closeIcon}</v-icon-button>`,
  }),
};

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 16px; align-items: center;">
        <v-icon-button size="small" ariaLabel="Small">${heartIcon}</v-icon-button>
        <v-icon-button size="medium" ariaLabel="Medium">${heartIcon}</v-icon-button>
        <v-icon-button size="large" ariaLabel="Large">${heartIcon}</v-icon-button>
      </div>
    `,
  }),
};

export const Active: Story = {
  args: {
    size: 'medium',
    variant: 'filled',
    active: true,
    ariaLabel: 'Favorited',
  },
  render: (args) => ({
    props: args,
    template: `<v-icon-button [size]="size" [variant]="variant" [active]="active" [ariaLabel]="ariaLabel">${heartIcon}</v-icon-button>`,
  }),
};

export const Disabled: Story = {
  args: {
    size: 'medium',
    variant: 'default',
    disabled: true,
    ariaLabel: 'Disabled',
  },
  render: (args) => ({
    props: args,
    template: `<v-icon-button [size]="size" [variant]="variant" [disabled]="disabled" [ariaLabel]="ariaLabel">${heartIcon}</v-icon-button>`,
  }),
};
