import { Meta, StoryObj } from '@storybook/angular';
import { FavoritesButton } from './favorites-button';

const meta: Meta<FavoritesButton> = {
  title: 'Components/FavoritesButton',
  component: FavoritesButton,
  tags: ['autodocs'],
  argTypes: {
    isFavorited: { control: 'boolean' },
    loading: { control: 'boolean' },
    variant: {
      control: 'select',
      options: ['icon-only', 'full-width']
    }
  }
};

export default meta;
type Story = StoryObj<FavoritesButton>;

export const IconOnly: Story = {
  args: {
    isFavorited: false,
    loading: false,
    variant: 'icon-only'
  }
};

export const IconOnlyFavorited: Story = {
  args: {
    isFavorited: true,
    loading: false,
    variant: 'icon-only'
  }
};

export const IconOnlyLoading: Story = {
  args: {
    isFavorited: false,
    loading: true,
    variant: 'icon-only'
  }
};

export const FullWidth: Story = {
  args: {
    isFavorited: false,
    loading: false,
    variant: 'full-width'
  }
};

export const FullWidthFavorited: Story = {
  args: {
    isFavorited: true,
    loading: false,
    variant: 'full-width'
  }
};

export const FullWidthLoading: Story = {
  args: {
    isFavorited: false,
    loading: true,
    variant: 'full-width'
  }
};

export const IconOnlyAllStates: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 16px; align-items: center;">
        <div style="text-align: center;">
          <v-favorites-button [isFavorited]="false" variant="icon-only"></v-favorites-button>
          <div style="font-size: 12px; color: #757575; margin-top: 8px;">Default</div>
        </div>
        <div style="text-align: center;">
          <v-favorites-button [isFavorited]="true" variant="icon-only"></v-favorites-button>
          <div style="font-size: 12px; color: #757575; margin-top: 8px;">Favorited</div>
        </div>
        <div style="text-align: center;">
          <v-favorites-button [loading]="true" variant="icon-only"></v-favorites-button>
          <div style="font-size: 12px; color: #757575; margin-top: 8px;">Loading</div>
        </div>
      </div>
    `
  })
};

export const WithAddToBagButton: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 12px; max-width: 400px; align-items: stretch;">
        <v-add-to-bag-button style="flex: 1;"></v-add-to-bag-button>
        <v-favorites-button [isFavorited]="false" variant="icon-only"></v-favorites-button>
      </div>
    `
  })
};
