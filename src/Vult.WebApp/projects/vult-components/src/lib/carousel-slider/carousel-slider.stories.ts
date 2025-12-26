import type { Meta, StoryObj } from '@storybook/angular';
import { CarouselSliderComponent, CarouselSlide } from './carousel-slider.component';

const meta: Meta<CarouselSliderComponent> = {
  title: 'Components/CarouselSlider',
  component: CarouselSliderComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<CarouselSliderComponent>;

const slides: CarouselSlide[] = [
  {
    id: 1,
    imageUrl: 'https://placehold.co/1440x600/333333/ffffff?text=Slide+1',
    altText: 'Nike Air Max Collection',
    title: 'Air Max Collection',
    subtitle: 'Discover the latest Air Max styles',
    ctaText: 'Shop Now',
    ctaUrl: '/air-max',
  },
  {
    id: 2,
    imageUrl: 'https://placehold.co/1440x600/444444/ffffff?text=Slide+2',
    altText: 'New Jordan Release',
    title: 'Jordan Retro',
    subtitle: 'Classic styles reimagined',
    ctaText: 'Explore',
    ctaUrl: '/jordan',
  },
  {
    id: 3,
    imageUrl: 'https://placehold.co/1440x600/555555/ffffff?text=Slide+3',
    altText: 'Running Collection',
    title: 'Run Further',
    subtitle: 'Performance gear for every runner',
    ctaText: 'Shop Running',
    ctaUrl: '/running',
  },
];

export const Default: Story = {
  args: {
    slides: slides,
    showArrows: true,
    showDots: true,
    loop: true,
    autoPlay: false,
  },
};

export const WithAutoPlay: Story = {
  args: {
    slides: slides,
    showArrows: true,
    showDots: true,
    loop: true,
    autoPlay: true,
    autoPlayInterval: 3000,
  },
};

export const NoControls: Story = {
  args: {
    slides: slides,
    showArrows: false,
    showDots: false,
    loop: true,
  },
};

export const SingleSlide: Story = {
  args: {
    slides: [slides[0]],
    showArrows: false,
    showDots: false,
  },
};

export const ImageOnly: Story = {
  args: {
    slides: [
      { id: 1, imageUrl: 'https://placehold.co/1440x600/333333/ffffff?text=Image+1', altText: 'Image 1' },
      { id: 2, imageUrl: 'https://placehold.co/1440x600/444444/ffffff?text=Image+2', altText: 'Image 2' },
      { id: 3, imageUrl: 'https://placehold.co/1440x600/555555/ffffff?text=Image+3', altText: 'Image 3' },
    ],
    showArrows: true,
    showDots: true,
  },
};
