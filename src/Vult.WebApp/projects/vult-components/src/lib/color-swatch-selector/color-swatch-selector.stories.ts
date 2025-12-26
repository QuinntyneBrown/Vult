import type { Meta, StoryObj } from '@storybook/angular';
import { ColorSwatchSelectorComponent, ColorOption } from './color-swatch-selector.component';

const meta: Meta<ColorSwatchSelectorComponent> = {
  title: 'Components/ColorSwatchSelector',
  component: ColorSwatchSelectorComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<ColorSwatchSelectorComponent>;

const colors: ColorOption[] = [
  { id: 'black', name: 'Black', color: '#111111' },
  { id: 'white', name: 'White', color: '#FFFFFF' },
  { id: 'red', name: 'University Red', color: '#C41E3A' },
  { id: 'blue', name: 'Royal Blue', color: '#4169E1' },
  { id: 'green', name: 'Lucky Green', color: '#228B22' },
];

export const Default: Story = {
  args: {
    colors: colors,
    ariaLabel: 'Select color',
  },
};

export const WithSelection: Story = {
  args: {
    colors: colors,
    selectedColorId: 'red',
    ariaLabel: 'Select color',
  },
};

export const WithMoreCount: Story = {
  args: {
    colors: colors.slice(0, 3),
    moreCount: 5,
    ariaLabel: 'Select color',
  },
};

export const WithUnavailable: Story = {
  args: {
    colors: [
      ...colors.slice(0, 3),
      { id: 'gray', name: 'Gray', color: '#808080', available: false },
      { id: 'navy', name: 'Navy', color: '#000080', available: false },
    ],
    ariaLabel: 'Select color',
  },
};

export const MultiColor: Story = {
  args: {
    colors: [
      { id: 'multi1', name: 'Multi-Color', color: 'linear-gradient(45deg, #ff0000, #00ff00, #0000ff)' },
      ...colors,
    ],
    ariaLabel: 'Select color',
  },
};
