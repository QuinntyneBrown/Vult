import { Meta, StoryObj } from '@storybook/angular';
import { AddToBagButton } from './add-to-bag-button';

const meta: Meta<AddToBagButton> = {
  title: 'Components/AddToBagButton',
  component: AddToBagButton,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    state: {
      control: 'select',
      options: ['default', 'loading', 'success', 'error']
    },
    fullWidth: { control: 'boolean' },
    showIcon: { control: 'boolean' },
    ariaLabel: { control: 'text' },
    errorMessage: { control: 'text' }
  }
};

export default meta;
type Story = StoryObj<AddToBagButton>;

export const Default: Story = {
  args: {
    disabled: false,
    state: 'default',
    fullWidth: true,
    showIcon: false,
    ariaLabel: 'Add to bag',
    errorMessage: ''
  }
};

export const WithIcon: Story = {
  args: {
    disabled: false,
    state: 'default',
    fullWidth: true,
    showIcon: true,
    ariaLabel: 'Add to bag',
    errorMessage: ''
  }
};

export const Loading: Story = {
  args: {
    disabled: false,
    state: 'loading',
    fullWidth: true,
    showIcon: false,
    ariaLabel: 'Adding to bag',
    errorMessage: ''
  }
};

export const Success: Story = {
  args: {
    disabled: false,
    state: 'success',
    fullWidth: true,
    showIcon: false,
    ariaLabel: 'Added to bag',
    errorMessage: ''
  }
};

export const Error: Story = {
  args: {
    disabled: false,
    state: 'error',
    fullWidth: true,
    showIcon: false,
    ariaLabel: 'Add to bag',
    errorMessage: 'Something went wrong. Please try again.'
  }
};

export const Disabled: Story = {
  args: {
    disabled: true,
    state: 'default',
    fullWidth: true,
    showIcon: false,
    ariaLabel: 'Add to bag - please select a size',
    errorMessage: ''
  }
};

export const AllStates: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
        <v-add-to-bag-button [state]="'default'"></v-add-to-bag-button>
        <v-add-to-bag-button [state]="'default'" [showIcon]="true"></v-add-to-bag-button>
        <v-add-to-bag-button [state]="'loading'"></v-add-to-bag-button>
        <v-add-to-bag-button [state]="'success'"></v-add-to-bag-button>
        <v-add-to-bag-button [disabled]="true"></v-add-to-bag-button>
        <v-add-to-bag-button [state]="'error'" errorMessage="Something went wrong. Please try again."></v-add-to-bag-button>
      </div>
    `
  })
};
