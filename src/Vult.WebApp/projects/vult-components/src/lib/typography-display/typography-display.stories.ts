import type { Meta, StoryObj } from '@storybook/angular';
import { TypographyDisplay } from './typography-display';

const meta: Meta<TypographyDisplay> = {
  title: 'Components/Typography',
  component: TypographyDisplay,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'display-1', 'display-2',
        'title-1', 'title-2', 'title-3', 'title-4',
        'body-1', 'body-1-strong', 'body-2', 'body-3',
        'overline', 'caption', 'price', 'price-sale',
      ],
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'inverse', 'sale', 'error', 'success'],
    },
    align: {
      control: 'select',
      options: ['left', 'center', 'right'],
    },
  },
};

export default meta;
type Story = StoryObj<TypographyDisplay>;

export const Display1: Story = {
  args: {
    variant: 'display-1',
    color: 'primary',
  },
  render: (args) => ({
    props: args,
    template: `<v-typography [variant]="variant" [color]="color">Just Do It</v-typography>`,
  }),
};

export const Display2: Story = {
  args: {
    variant: 'display-2',
    color: 'primary',
  },
  render: (args) => ({
    props: args,
    template: `<v-typography [variant]="variant" [color]="color">Air Max</v-typography>`,
  }),
};

export const Title1: Story = {
  args: {
    variant: 'title-1',
    color: 'primary',
  },
  render: (args) => ({
    props: args,
    template: `<v-typography [variant]="variant" [color]="color">New Arrivals</v-typography>`,
  }),
};

export const Title2: Story = {
  args: {
    variant: 'title-2',
    color: 'primary',
  },
  render: (args) => ({
    props: args,
    template: `<v-typography [variant]="variant" [color]="color">Men's Shoes</v-typography>`,
  }),
};

export const Body1: Story = {
  args: {
    variant: 'body-1',
    color: 'primary',
  },
  render: (args) => ({
    props: args,
    template: `<v-typography [variant]="variant" [color]="color">Experience unparalleled comfort and performance with our latest collection of running shoes. Designed for athletes who demand the best.</v-typography>`,
  }),
};

export const Body2Secondary: Story = {
  args: {
    variant: 'body-2',
    color: 'secondary',
  },
  render: (args) => ({
    props: args,
    template: `<v-typography [variant]="variant" [color]="color">Men's Running Shoes • 5 Colors</v-typography>`,
  }),
};

export const Overline: Story = {
  args: {
    variant: 'overline',
    color: 'primary',
  },
  render: (args) => ({
    props: args,
    template: `<v-typography [variant]="variant" [color]="color">New Release</v-typography>`,
  }),
};

export const Price: Story = {
  args: {
    variant: 'price',
    color: 'primary',
  },
  render: (args) => ({
    props: args,
    template: `<v-typography [variant]="variant" [color]="color">$130</v-typography>`,
  }),
};

export const PriceSale: Story = {
  args: {
    variant: 'price-sale',
    color: 'sale',
  },
  render: (args) => ({
    props: args,
    template: `<v-typography [variant]="variant" [color]="color">$97.97</v-typography>`,
  }),
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <v-typography variant="display-1">Display 1</v-typography>
        <v-typography variant="display-2">Display 2</v-typography>
        <v-typography variant="title-1">Title 1</v-typography>
        <v-typography variant="title-2">Title 2</v-typography>
        <v-typography variant="title-3">Title 3</v-typography>
        <v-typography variant="title-4">Title 4</v-typography>
        <v-typography variant="body-1">Body 1 - Regular paragraph text</v-typography>
        <v-typography variant="body-1-strong">Body 1 Strong - Emphasized text</v-typography>
        <v-typography variant="body-2">Body 2 - Secondary text</v-typography>
        <v-typography variant="body-3">Body 3 - Small text</v-typography>
        <v-typography variant="overline">OVERLINE</v-typography>
        <v-typography variant="caption" color="secondary">Caption text</v-typography>
        <div style="display: flex; gap: 8px;">
          <v-typography variant="price-sale">$97.97</v-typography>
          <v-typography variant="price" color="secondary" style="text-decoration: line-through;">$130</v-typography>
        </div>
      </div>
    `,
  }),
};
