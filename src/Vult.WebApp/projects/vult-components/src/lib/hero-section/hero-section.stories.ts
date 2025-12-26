import type { Meta, StoryObj } from '@storybook/angular';
import { HeroSectionComponent } from './hero-section.component';

const meta: Meta<HeroSectionComponent> = {
  title: 'Components/HeroSection',
  component: HeroSectionComponent,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large', 'full'],
    },
    textPosition: {
      control: 'select',
      options: ['left', 'center', 'right'],
    },
    theme: {
      control: 'select',
      options: ['light', 'dark'],
    },
  },
};

export default meta;
type Story = StoryObj<HeroSectionComponent>;

export const Default: Story = {
  args: {
    backgroundImage: 'https://placehold.co/1440x700/333333/ffffff?text=Hero+Image',
    title: 'Just Do It',
    subtitle: 'Explore our latest collection of performance gear.',
    primaryCtaText: 'Shop Now',
    size: 'large',
    textPosition: 'left',
    theme: 'dark',
  },
};

export const Centered: Story = {
  args: {
    backgroundImage: 'https://placehold.co/1440x700/333333/ffffff?text=Hero+Image',
    overline: 'New Release',
    title: 'Air Max Day',
    subtitle: 'Celebrate the icon with our limited edition collection.',
    primaryCtaText: 'Shop Collection',
    secondaryCtaText: 'Learn More',
    size: 'large',
    textPosition: 'center',
    theme: 'dark',
  },
};

export const LightTheme: Story = {
  args: {
    backgroundImage: 'https://placehold.co/1440x700/f5f5f5/111111?text=Hero+Image',
    title: 'Summer Essentials',
    subtitle: 'Stay cool and stylish all season long.',
    primaryCtaText: 'Shop Summer',
    size: 'medium',
    textPosition: 'left',
    theme: 'light',
  },
};

export const SmallHero: Story = {
  args: {
    backgroundImage: 'https://placehold.co/1440x400/333333/ffffff?text=Hero+Image',
    title: 'Sale',
    primaryCtaText: 'Shop Sale',
    size: 'small',
    textPosition: 'center',
    theme: 'dark',
  },
};

export const FullScreen: Story = {
  args: {
    backgroundImage: 'https://placehold.co/1920x1080/333333/ffffff?text=Hero+Image',
    overline: 'Introducing',
    title: 'The Future of Running',
    subtitle: 'Experience unparalleled performance with our latest innovation.',
    primaryCtaText: 'Explore',
    secondaryCtaText: 'Watch Video',
    size: 'full',
    textPosition: 'center',
    theme: 'dark',
  },
};
