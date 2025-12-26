import { Meta, StoryObj } from '@storybook/angular';
import { ProductInfoSectionComponent, ProductPrice } from './product-info-section.component';

const meta: Meta<ProductInfoSectionComponent> = {
  title: 'Components/ProductInfoSection',
  component: ProductInfoSectionComponent,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    subtitle: { control: 'text' },
    colorName: { control: 'text' },
    promotionalMessage: { control: 'text' },
    isMemberExclusive: { control: 'boolean' },
    price: { control: 'object' }
  }
};

export default meta;
type Story = StoryObj<ProductInfoSectionComponent>;

const regularPrice: ProductPrice = {
  current: 175,
  currency: 'USD',
  currencySymbol: '$'
};

const salePrice: ProductPrice = {
  current: 140,
  original: 175,
  currency: 'USD',
  currencySymbol: '$',
  salePercentage: 20
};

export const Default: Story = {
  args: {
    title: "Men's Dri-FIT Woven Color-Block Windrunner Loose Jacket",
    subtitle: 'Tech Collection',
    colorName: 'Black/White',
    price: regularPrice,
    isMemberExclusive: false,
    promotionalMessage: ''
  }
};

export const OnSale: Story = {
  args: {
    title: "Men's Dri-FIT Woven Color-Block Windrunner Loose Jacket",
    subtitle: 'Tech Collection',
    colorName: 'Black/White',
    price: salePrice,
    isMemberExclusive: false,
    promotionalMessage: ''
  }
};

export const MemberExclusive: Story = {
  args: {
    title: "Men's Dri-FIT Woven Color-Block Windrunner Loose Jacket",
    subtitle: 'Tech Collection',
    colorName: 'Black/White',
    price: regularPrice,
    isMemberExclusive: true,
    promotionalMessage: 'Members get free shipping'
  }
};

export const WithoutSubtitle: Story = {
  args: {
    title: 'Club Fleece Pullover Hoodie',
    subtitle: '',
    colorName: '',
    price: {
      current: 70,
      currency: 'USD',
      currencySymbol: '$'
    },
    isMemberExclusive: false,
    promotionalMessage: ''
  }
};

export const LongTitle: Story = {
  args: {
    title: "Men's Dri-FIT ADV TechKnit Ultra Short-Sleeve Running Top with Advanced Moisture-Wicking Technology",
    subtitle: 'Running Collection',
    colorName: 'Obsidian/Reflective Silver',
    price: regularPrice,
    isMemberExclusive: false,
    promotionalMessage: ''
  }
};
