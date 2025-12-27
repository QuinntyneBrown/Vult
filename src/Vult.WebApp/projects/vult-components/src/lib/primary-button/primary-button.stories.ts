import type { Meta, StoryObj } from '@storybook/angular';
import { PrimaryButton } from './primary-button';

const meta: Meta<PrimaryButton> = {
  title: 'Components/PrimaryButton',
  component: PrimaryButton,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    theme: {
      control: 'select',
      options: ['dark', 'light'],
    },
  },
};

export default meta;
type Story = StoryObj<PrimaryButton>;

export const Default: Story = {
  args: {
    size: 'medium',
    theme: 'dark',
    disabled: false,
    loading: false,
  },
  render: (args) => ({
    props: args,
    template: `<v-primary-button [size]="size" [theme]="theme" [disabled]="disabled" [loading]="loading">Shop Now</v-primary-button>`,
  }),
};

export const Small: Story = {
  args: {
    size: 'small',
    theme: 'dark',
  },
  render: (args) => ({
    props: args,
    template: `<v-primary-button [size]="size" [theme]="theme">Shop</v-primary-button>`,
  }),
};

export const Large: Story = {
  args: {
    size: 'large',
    theme: 'dark',
  },
  render: (args) => ({
    props: args,
    template: `<v-primary-button [size]="size" [theme]="theme">Add to Bag</v-primary-button>`,
  }),
};

export const LightTheme: Story = {
  args: {
    size: 'medium',
    theme: 'light',
  },
  render: (args) => ({
    props: args,
    template: `<v-primary-button [size]="size" [theme]="theme">Shop Now</v-primary-button>`,
  }),
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

export const Disabled: Story = {
  args: {
    size: 'medium',
    theme: 'dark',
    disabled: true,
  },
  render: (args) => ({
    props: args,
    template: `<v-primary-button [size]="size" [theme]="theme" [disabled]="disabled">Sold Out</v-primary-button>`,
  }),
};

export const Loading: Story = {
  args: {
    size: 'medium',
    theme: 'dark',
    loading: true,
  },
  render: (args) => ({
    props: args,
    template: `<v-primary-button [size]="size" [theme]="theme" [loading]="loading">Adding...</v-primary-button>`,
  }),
};

export const FullWidth: Story = {
  args: {
    size: 'large',
    theme: 'dark',
    fullWidth: true,
  },
  render: (args) => ({
    props: args,
    template: `<v-primary-button [size]="size" [theme]="theme" [fullWidth]="fullWidth">Add to Bag</v-primary-button>`,
  }),
};
