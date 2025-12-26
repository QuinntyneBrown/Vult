import type { Meta, StoryObj } from '@storybook/angular';
import { PrimaryButtonComponent } from './primary-button.component';

const meta: Meta<PrimaryButtonComponent> = {
  title: 'Components/PrimaryButton',
  component: PrimaryButtonComponent,
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
type Story = StoryObj<PrimaryButtonComponent>;

export const Default: Story = {
  args: {
    size: 'medium',
    theme: 'dark',
    disabled: false,
    loading: false,
  },
  render: (args) => ({
    props: args,
    template: `<lib-primary-button [size]="size" [theme]="theme" [disabled]="disabled" [loading]="loading">Shop Now</lib-primary-button>`,
  }),
};

export const Small: Story = {
  args: {
    size: 'small',
    theme: 'dark',
  },
  render: (args) => ({
    props: args,
    template: `<lib-primary-button [size]="size" [theme]="theme">Shop</lib-primary-button>`,
  }),
};

export const Large: Story = {
  args: {
    size: 'large',
    theme: 'dark',
  },
  render: (args) => ({
    props: args,
    template: `<lib-primary-button [size]="size" [theme]="theme">Add to Bag</lib-primary-button>`,
  }),
};

export const LightTheme: Story = {
  args: {
    size: 'medium',
    theme: 'light',
  },
  render: (args) => ({
    props: args,
    template: `<lib-primary-button [size]="size" [theme]="theme">Shop Now</lib-primary-button>`,
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
    template: `<lib-primary-button [size]="size" [theme]="theme" [disabled]="disabled">Sold Out</lib-primary-button>`,
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
    template: `<lib-primary-button [size]="size" [theme]="theme" [loading]="loading">Adding...</lib-primary-button>`,
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
    template: `<lib-primary-button [size]="size" [theme]="theme" [fullWidth]="fullWidth">Add to Bag</lib-primary-button>`,
  }),
};
