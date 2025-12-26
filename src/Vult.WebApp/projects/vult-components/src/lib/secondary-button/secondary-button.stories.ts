import type { Meta, StoryObj } from '@storybook/angular';
import { SecondaryButtonComponent } from './secondary-button.component';

const meta: Meta<SecondaryButtonComponent> = {
  title: 'Components/SecondaryButton',
  component: SecondaryButtonComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['outlined', 'text', 'ghost'],
    },
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
type Story = StoryObj<SecondaryButtonComponent>;

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    size: 'medium',
    theme: 'dark',
  },
  render: (args) => ({
    props: args,
    template: `<lib-secondary-button [variant]="variant" [size]="size" [theme]="theme">Learn More</lib-secondary-button>`,
  }),
};

export const Text: Story = {
  args: {
    variant: 'text',
    size: 'medium',
    theme: 'dark',
  },
  render: (args) => ({
    props: args,
    template: `<lib-secondary-button [variant]="variant" [size]="size" [theme]="theme">View All</lib-secondary-button>`,
  }),
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    size: 'medium',
    theme: 'dark',
  },
  render: (args) => ({
    props: args,
    template: `<lib-secondary-button [variant]="variant" [size]="size" [theme]="theme">Cancel</lib-secondary-button>`,
  }),
};

export const LightTheme: Story = {
  args: {
    variant: 'outlined',
    size: 'medium',
    theme: 'light',
  },
  render: (args) => ({
    props: args,
    template: `<lib-secondary-button [variant]="variant" [size]="size" [theme]="theme">Learn More</lib-secondary-button>`,
  }),
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

export const Disabled: Story = {
  args: {
    variant: 'outlined',
    size: 'medium',
    disabled: true,
  },
  render: (args) => ({
    props: args,
    template: `<lib-secondary-button [variant]="variant" [size]="size" [disabled]="disabled">Disabled</lib-secondary-button>`,
  }),
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 16px; align-items: center;">
        <lib-secondary-button variant="outlined" size="medium">Outlined</lib-secondary-button>
        <lib-secondary-button variant="text" size="medium">Text</lib-secondary-button>
        <lib-secondary-button variant="ghost" size="medium">Ghost</lib-secondary-button>
      </div>
    `,
  }),
};
