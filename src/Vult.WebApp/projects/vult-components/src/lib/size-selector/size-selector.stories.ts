import type { Meta, StoryObj } from '@storybook/angular';
import { SizeSelectorComponent, SizeOption } from './size-selector.component';

const meta: Meta<SizeSelectorComponent> = {
  title: 'Components/SizeSelector',
  component: SizeSelectorComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<SizeSelectorComponent>;

const numericSizes: SizeOption[] = [
  { id: '6', label: '6' },
  { id: '6.5', label: '6.5' },
  { id: '7', label: '7' },
  { id: '7.5', label: '7.5' },
  { id: '8', label: '8' },
  { id: '8.5', label: '8.5', available: false },
  { id: '9', label: '9' },
  { id: '9.5', label: '9.5' },
  { id: '10', label: '10' },
  { id: '10.5', label: '10.5', available: false },
  { id: '11', label: '11' },
  { id: '12', label: '12' },
];

const textSizes: SizeOption[] = [
  { id: 'xs', label: 'XS' },
  { id: 's', label: 'S' },
  { id: 'm', label: 'M' },
  { id: 'l', label: 'L' },
  { id: 'xl', label: 'XL' },
  { id: 'xxl', label: 'XXL' },
];

export const NumericSizes: Story = {
  args: {
    sizes: numericSizes,
    ariaLabel: 'Filter by shoe size',
    multiSelect: true,
  },
};

export const TextSizes: Story = {
  args: {
    sizes: textSizes,
    ariaLabel: 'Filter by clothing size',
    multiSelect: true,
  },
};

export const SingleSelect: Story = {
  args: {
    sizes: textSizes,
    ariaLabel: 'Select size',
    multiSelect: false,
  },
};

export const WithPreselection: Story = {
  args: {
    sizes: numericSizes,
    selectedSizeIds: ['8', '9'],
    multiSelect: true,
  },
};

export const WithStrikethrough: Story = {
  args: {
    sizes: numericSizes,
    showStrikethrough: true,
    multiSelect: true,
  },
};
