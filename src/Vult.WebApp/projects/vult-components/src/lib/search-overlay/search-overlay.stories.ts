import { Meta, StoryObj, moduleMetadata, applicationConfig } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';
import { SearchOverlay, SearchOverlaySuggestion } from './search-overlay';

const meta: Meta<SearchOverlay> = {
  title: 'Components/Search Overlay',
  component: SearchOverlay,
  decorators: [
    moduleMetadata({
      imports: [SearchOverlay],
    }),
    applicationConfig({
      providers: [provideAnimations()],
    }),
  ],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Whether the overlay is open',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the search input',
    },
    close: { action: 'close' },
    search: { action: 'search' },
    suggestionSelect: { action: 'suggestionSelect' },
    clearRecents: { action: 'clearRecents' },
  },
};

export default meta;
type Story = StoryObj<SearchOverlay>;

const sampleTrendingSearches: SearchOverlaySuggestion[] = [
  { id: '1', text: 'Running Shoes', type: 'trending' },
  { id: '2', text: 'Basketball', type: 'trending' },
  { id: '3', text: 'Jordan', type: 'trending' },
  { id: '4', text: 'Training Gear', type: 'trending' },
  { id: '5', text: 'New Arrivals', type: 'trending' },
];

const sampleRecentSearches: SearchOverlaySuggestion[] = [
  { id: '1', text: 'Air Max', type: 'recent' },
  { id: '2', text: 'Women\'s Sneakers', type: 'recent' },
  { id: '3', text: 'Black Running Shoes', type: 'recent' },
];

const sampleProductSuggestions: SearchOverlaySuggestion[] = [
  {
    id: '1',
    text: 'Air Max 90',
    type: 'product',
    category: 'Men\'s Shoes',
    imageUrl: 'https://placehold.co/200x200/f5f5f5/111111?text=Air+Max+90',
  },
  {
    id: '2',
    text: 'Pegasus 41',
    type: 'product',
    category: 'Running Shoes',
    imageUrl: 'https://placehold.co/200x200/f5f5f5/111111?text=Pegasus+41',
  },
  {
    id: '3',
    text: 'Dunk Low',
    type: 'product',
    category: 'Men\'s Shoes',
    imageUrl: 'https://placehold.co/200x200/f5f5f5/111111?text=Dunk+Low',
  },
  {
    id: '4',
    text: 'Air Force 1',
    type: 'product',
    category: 'Men\'s Shoes',
    imageUrl: 'https://placehold.co/200x200/f5f5f5/111111?text=Air+Force+1',
  },
];

export const Default: Story = {
  args: {
    isOpen: true,
    placeholder: 'Search',
    trendingSearches: sampleTrendingSearches,
    recentSearches: sampleRecentSearches,
    productSuggestions: sampleProductSuggestions,
  },
};

export const WithTrendingOnly: Story = {
  args: {
    isOpen: true,
    placeholder: 'Search',
    trendingSearches: sampleTrendingSearches,
    recentSearches: [],
    productSuggestions: [],
  },
};

export const WithRecentOnly: Story = {
  args: {
    isOpen: true,
    placeholder: 'Search',
    trendingSearches: [],
    recentSearches: sampleRecentSearches,
    productSuggestions: [],
  },
};

export const WithProductsOnly: Story = {
  args: {
    isOpen: true,
    placeholder: 'Search',
    trendingSearches: [],
    recentSearches: [],
    productSuggestions: sampleProductSuggestions,
  },
};

export const Empty: Story = {
  args: {
    isOpen: true,
    placeholder: 'Search',
    trendingSearches: [],
    recentSearches: [],
    productSuggestions: [],
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
    placeholder: 'Search',
    trendingSearches: sampleTrendingSearches,
    recentSearches: sampleRecentSearches,
    productSuggestions: sampleProductSuggestions,
  },
};
