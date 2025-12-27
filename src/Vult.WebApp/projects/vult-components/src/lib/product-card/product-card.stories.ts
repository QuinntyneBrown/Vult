import type { Meta, StoryObj } from '@storybook/angular';
import { ProductCard, ProductCardData } from './product-card';

const meta: Meta<ProductCard> = {
  title: 'Components/ProductCard',
  component: ProductCard,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<ProductCard>;

const defaultProduct: ProductCardData = {
  id: '1',
  name: 'Air Max 90',
  category: "Men's Shoes",
  colorCount: 5,
  price: 130,
  imageUrl: 'https://placehold.co/300x400/f5f5f5/111111?text=Product',
  hoverImageUrl: 'https://placehold.co/300x400/e5e5e5/111111?text=Hover',
};

export const Default: Story = {
  args: {
    product: defaultProduct,
  },
};

export const WithBadge: Story = {
  args: {
    product: {
      ...defaultProduct,
      badge: 'Just In',
      badgeType: 'new',
    },
  },
};

export const OnSale: Story = {
  args: {
    product: {
      ...defaultProduct,
      price: 97.97,
      originalPrice: 130,
      badge: '25% Off',
      badgeType: 'sale',
    },
  },
};

export const MemberExclusive: Story = {
  args: {
    product: {
      ...defaultProduct,
      badge: 'Member Exclusive',
      badgeType: 'member',
    },
  },
};

export const SoldOut: Story = {
  args: {
    product: {
      ...defaultProduct,
      soldOut: true,
    },
  },
};

export const Favorited: Story = {
  args: {
    product: {
      ...defaultProduct,
      isFavorite: true,
    },
  },
};

export const LongProductName: Story = {
  args: {
    product: {
      ...defaultProduct,
      name: 'Air Max 90 Premium Limited Edition Anniversary Collection',
    },
  },
};
