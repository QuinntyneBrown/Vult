import type { Meta, StoryObj } from '@storybook/angular';
import { PageHeaderComponent } from './page-header.component';

const meta: Meta<PageHeaderComponent> = {
  title: 'Components/PageHeader',
  component: PageHeaderComponent,
  tags: ['autodocs'],
  argTypes: {
    alignment: {
      control: 'select',
      options: ['left', 'center'],
    },
  },
};

export default meta;
type Story = StoryObj<PageHeaderComponent>;

export const Default: Story = {
  args: {
    title: "Men's New Releases",
    alignment: 'left',
  },
};

export const WithCount: Story = {
  args: {
    title: "Men's Shoes",
    count: 234,
    alignment: 'left',
  },
};

export const WithSubtitle: Story = {
  args: {
    title: "Men's Running Shoes",
    subtitle: 'Run faster, go further with our latest collection of running shoes designed for performance.',
    alignment: 'left',
  },
};

export const Centered: Story = {
  args: {
    title: 'New Arrivals',
    subtitle: 'Discover the latest styles and innovations.',
    alignment: 'center',
  },
};

export const FullExample: Story = {
  args: {
    title: "Women's Air Max",
    subtitle: 'Explore our collection of iconic <a href="#">Air Max</a> sneakers.',
    count: 48,
    alignment: 'left',
  },
};
