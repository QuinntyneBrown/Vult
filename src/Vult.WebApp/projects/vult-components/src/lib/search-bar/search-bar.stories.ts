import type { Meta, StoryObj } from '@storybook/angular';
import { SearchBarComponent, SearchSuggestion } from './search-bar.component';

const meta: Meta<SearchBarComponent> = {
  title: 'Components/SearchBar',
  component: SearchBarComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['compact', 'full'],
    },
  },
};

export default meta;
type Story = StoryObj<SearchBarComponent>;

export const Compact: Story = {
  args: {
    variant: 'compact',
    placeholder: 'Search',
  },
};

export const FullWidth: Story = {
  args: {
    variant: 'full',
    placeholder: 'Search',
  },
};

const suggestions: SearchSuggestion[] = [
  { id: '1', text: 'air max', type: 'recent' },
  { id: '2', text: 'running shoes', type: 'recent' },
  { id: '3', text: 'jordan', type: 'trending' },
  { id: '4', text: 'dunks', type: 'trending' },
  { id: '5', text: 'Air Max 90', type: 'product', imageUrl: 'https://placehold.co/56x56', category: "Men's Shoes", price: 130 },
];

export const WithSuggestions: Story = {
  args: {
    variant: 'full',
    placeholder: 'Search',
    suggestions: suggestions,
  },
};
