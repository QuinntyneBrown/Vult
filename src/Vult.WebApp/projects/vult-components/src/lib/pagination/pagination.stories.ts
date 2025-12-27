import type { Meta, StoryObj } from '@storybook/angular';
import { Pagination } from './pagination';

const meta: Meta<Pagination> = {
  title: 'Components/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['numbered', 'load-more'],
    },
  },
};

export default meta;
type Story = StoryObj<Pagination>;

export const Numbered: Story = {
  args: {
    variant: 'numbered',
    totalPages: 10,
    page: 1,
  },
};

export const NumberedMiddlePage: Story = {
  args: {
    variant: 'numbered',
    totalPages: 10,
    page: 5,
  },
};

export const NumberedLastPage: Story = {
  args: {
    variant: 'numbered',
    totalPages: 10,
    page: 10,
  },
};

export const FewPages: Story = {
  args: {
    variant: 'numbered',
    totalPages: 3,
    page: 1,
  },
};

export const LoadMore: Story = {
  args: {
    variant: 'load-more',
    showingCount: 24,
    totalCount: 120,
    loadMoreText: 'Load More',
  },
};

export const LoadMoreLoading: Story = {
  args: {
    variant: 'load-more',
    showingCount: 24,
    totalCount: 120,
    loading: true,
  },
};
