import type { Meta, StoryObj } from '@storybook/angular';
import { ResultCounter } from './result-counter';

const meta: Meta<ResultCounter> = {
  title: 'Components/ResultCounter',
  component: ResultCounter,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<ResultCounter>;

export const Default: Story = {
  args: {
    count: 234,
    singularLabel: 'Result',
    pluralLabel: 'Results',
  },
};

export const SingleResult: Story = {
  args: {
    count: 1,
    singularLabel: 'Result',
    pluralLabel: 'Results',
  },
};

export const ZeroResults: Story = {
  args: {
    count: 0,
    singularLabel: 'Result',
    pluralLabel: 'Results',
  },
};

export const CustomLabels: Story = {
  args: {
    count: 48,
    singularLabel: 'Product',
    pluralLabel: 'Products',
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    singularLabel: 'Result',
    pluralLabel: 'Results',
  },
};

export const Updating: Story = {
  args: {
    count: 234,
    updating: true,
    animated: true,
    singularLabel: 'Result',
    pluralLabel: 'Results',
  },
};
