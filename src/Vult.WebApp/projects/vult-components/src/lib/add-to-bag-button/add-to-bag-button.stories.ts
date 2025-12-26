import { Meta, StoryObj } from '@storybook/angular';
import { AddToBagButtonComponent } from './add-to-bag-button.component';

const meta: Meta<AddToBagButtonComponent> = {
  title: 'Components/AddToBagButton',
  component: AddToBagButtonComponent,
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
  },
  decorators: [
    (story) => ({
      ...story,
      template: `<div style="max-width: 400px;">${story.template}</div>`
    })
  ]
};

export default meta;
type Story = StoryObj<AddToBagButtonComponent>;

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
        <lib-add-to-bag-button [state]="'default'"></lib-add-to-bag-button>
        <lib-add-to-bag-button [state]="'default'" [showIcon]="true"></lib-add-to-bag-button>
        <lib-add-to-bag-button [state]="'loading'"></lib-add-to-bag-button>
        <lib-add-to-bag-button [state]="'success'"></lib-add-to-bag-button>
        <lib-add-to-bag-button [disabled]="true"></lib-add-to-bag-button>
        <lib-add-to-bag-button [state]="'error'" errorMessage="Something went wrong. Please try again."></lib-add-to-bag-button>
      </div>
    `
  })
};
