import { Meta, StoryObj } from '@storybook/angular';
import { ProductImageGalleryComponent, ProductImage } from './product-image-gallery.component';

const sampleImages: ProductImage[] = [
  {
    id: '1',
    url: 'https://via.placeholder.com/535x669/f5f5f5/111111?text=Image+1',
    altText: 'Product front view',
    thumbnailUrl: 'https://via.placeholder.com/70x70/f5f5f5/111111?text=1'
  },
  {
    id: '2',
    url: 'https://via.placeholder.com/535x669/f5f5f5/111111?text=Image+2',
    altText: 'Product back view',
    thumbnailUrl: 'https://via.placeholder.com/70x70/f5f5f5/111111?text=2'
  },
  {
    id: '3',
    url: 'https://via.placeholder.com/535x669/f5f5f5/111111?text=Image+3',
    altText: 'Product side view',
    thumbnailUrl: 'https://via.placeholder.com/70x70/f5f5f5/111111?text=3'
  },
  {
    id: '4',
    url: 'https://via.placeholder.com/535x669/f5f5f5/111111?text=Image+4',
    altText: 'Product detail',
    thumbnailUrl: 'https://via.placeholder.com/70x70/f5f5f5/111111?text=4'
  },
  {
    id: '5',
    url: 'https://via.placeholder.com/535x669/f5f5f5/111111?text=Image+5',
    altText: 'Product on model',
    thumbnailUrl: 'https://via.placeholder.com/70x70/f5f5f5/111111?text=5'
  }
];

const meta: Meta<ProductImageGalleryComponent> = {
  title: 'Components/ProductImageGallery',
  component: ProductImageGalleryComponent,
  tags: ['autodocs'],
  argTypes: {
    images: { control: 'object' },
    enableZoom: { control: 'boolean' },
    stickyOnDesktop: { control: 'boolean' },
    loading: { control: 'boolean' },
    ariaLabel: { control: 'text' }
  }
};

export default meta;
type Story = StoryObj<ProductImageGalleryComponent>;

export const Default: Story = {
  args: {
    images: sampleImages,
    enableZoom: false,
    loading: false,
    ariaLabel: 'Product images'
  }
};

export const WithZoom: Story = {
  args: {
    images: sampleImages,
    enableZoom: true,
    loading: false,
    ariaLabel: 'Product images'
  }
};

export const Loading: Story = {
  args: {
    images: sampleImages,
    enableZoom: false,
    loading: true,
    ariaLabel: 'Product images'
  }
};

export const SingleImage: Story = {
  args: {
    images: [sampleImages[0]],
    enableZoom: false,
    loading: false,
    ariaLabel: 'Product image'
  }
};

export const ThreeImages: Story = {
  args: {
    images: sampleImages.slice(0, 3),
    enableZoom: false,
    loading: false,
    ariaLabel: 'Product images'
  }
};
