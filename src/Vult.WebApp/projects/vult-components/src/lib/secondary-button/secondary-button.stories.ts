import type { Meta, StoryObj } from '@storybook/angular';
import { SecondaryButton } from './secondary-button';

const meta: Meta<SecondaryButton> = {
  title: 'Components/SecondaryButton',
  component: SecondaryButton,
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
type Story = StoryObj<SecondaryButton>;

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    size: 'medium',
    theme: 'dark',
  },
  render: (args) => ({
    props: args,
    template: `<v-secondary-button [variant]="variant" [size]="size" [theme]="theme">Learn More</v-secondary-button>`,
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
    template: `<v-secondary-button [variant]="variant" [size]="size" [theme]="theme">View All</v-secondary-button>`,
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
    template: `<v-secondary-button [variant]="variant" [size]="size" [theme]="theme">Cancel</v-secondary-button>`,
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
    template: `<v-secondary-button [variant]="variant" [size]="size" [theme]="theme">Learn More</v-secondary-button>`,
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
    template: `<v-secondary-button [variant]="variant" [size]="size" [disabled]="disabled">Disabled</v-secondary-button>`,
  }),
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 16px; align-items: center;">
        <v-secondary-button variant="outlined" size="medium">Outlined</v-secondary-button>
        <v-secondary-button variant="text" size="medium">Text</v-secondary-button>
        <v-secondary-button variant="ghost" size="medium">Ghost</v-secondary-button>
      </div>
    `,
  }),
};
