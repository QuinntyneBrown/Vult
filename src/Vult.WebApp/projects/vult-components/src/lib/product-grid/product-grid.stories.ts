import type { Meta, StoryObj } from '@storybook/angular';
import { ProductGrid } from './product-grid';
import { ProductCardData } from '../product-card/product-card';

const meta: Meta<ProductGrid> = {
  title: 'Components/ProductGrid',
  component: ProductGrid,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<ProductGrid>;

const sampleProducts: ProductCardData[] = Array.from({ length: 8 }, (_, i) => ({
  id: String(i + 1),
  name: `Air Max ${90 + i * 10}`,
  category: "Men's Shoes",
  colorCount: 3 + i,
  price: 130 + i * 10,
  imageUrl: `https://placehold.co/300x400/f5f5f5/111111?text=Product+${i + 1}`,
  hoverImageUrl: `https://placehold.co/300x400/e5e5e5/111111?text=Hover+${i + 1}`,
  badge: i === 0 ? 'Just In' : i === 2 ? 'Best Seller' : undefined,
  badgeType: i === 0 ? 'new' : undefined,
}));

export const Default: Story = {
  args: {
    products: sampleProducts,
    loading: false,
  },
};

export const Loading: Story = {
  args: {
    products: [],
    loading: true,
    skeletonItems: 8,
  },
};

export const Empty: Story = {
  args: {
    products: [],
    loading: false,
    emptyTitle: 'No products found',
    emptyMessage: 'Try adjusting your filters or search criteria.',
    emptyActionText: 'Clear Filters',
    emptyActionUrl: '/products',
  },
};

export const FewProducts: Story = {
  args: {
    products: sampleProducts.slice(0, 3),
    loading: false,
  },
};

export const WithSaleItems: Story = {
  args: {
    products: sampleProducts.map((p, i) => ({
      ...p,
      badge: i % 2 === 0 ? '20% Off' : undefined,
      badgeType: i % 2 === 0 ? ('sale' as const) : undefined,
      originalPrice: i % 2 === 0 ? p.price : undefined,
      price: i % 2 === 0 ? p.price * 0.8 : p.price,
    })),
    loading: false,
  },
};

export const SingleColumn: Story = {
  args: {
    products: sampleProducts.slice(0, 4),
    singleColumn: true,
    loading: false,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
