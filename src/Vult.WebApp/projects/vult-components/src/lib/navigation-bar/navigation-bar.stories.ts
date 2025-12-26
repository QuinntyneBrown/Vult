import type { Meta, StoryObj } from '@storybook/angular';
import { NavigationBarComponent, NavItem } from './navigation-bar.component';

const meta: Meta<NavigationBarComponent> = {
  title: 'Components/NavigationBar',
  component: NavigationBarComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<NavigationBarComponent>;

const navItems: NavItem[] = [
  {
    id: 'new',
    label: 'New & Featured',
    href: '/new',
    children: [
      { id: 'new-releases', label: 'New Releases', href: '/new/releases' },
      { id: 'best-sellers', label: 'Best Sellers', href: '/new/best-sellers' },
      { id: 'member-exclusive', label: 'Member Exclusive', href: '/new/member' },
    ],
  },
  {
    id: 'men',
    label: 'Men',
    href: '/men',
    children: [
      { id: 'men-shoes', label: 'Shoes', href: '/men/shoes' },
      { id: 'men-clothing', label: 'Clothing', href: '/men/clothing' },
      { id: 'men-accessories', label: 'Accessories', href: '/men/accessories' },
    ],
  },
  {
    id: 'women',
    label: 'Women',
    href: '/women',
    children: [
      { id: 'women-shoes', label: 'Shoes', href: '/women/shoes' },
      { id: 'women-clothing', label: 'Clothing', href: '/women/clothing' },
      { id: 'women-accessories', label: 'Accessories', href: '/women/accessories' },
    ],
  },
  {
    id: 'kids',
    label: 'Kids',
    href: '/kids',
  },
  {
    id: 'sale',
    label: 'Sale',
    href: '/sale',
  },
];

export const Default: Story = {
  args: {
    items: navItems,
    logoHref: '/',
  },
  render: (args) => ({
    props: args,
    template: `
      <lib-navigation-bar [items]="items" [logoHref]="logoHref">
        <div logo style="font-weight: bold; font-size: 24px;">NIKE</div>
        <div actions style="display: flex; gap: 16px;">
          <span>Search</span>
          <span>Favorites</span>
          <span>Cart</span>
        </div>
      </lib-navigation-bar>
    `,
  }),
};

export const WithActiveItem: Story = {
  args: {
    items: navItems,
    logoHref: '/',
    activeItemId: 'men',
  },
  render: (args) => ({
    props: args,
    template: `
      <lib-navigation-bar [items]="items" [logoHref]="logoHref" [activeItemId]="activeItemId">
        <div logo style="font-weight: bold; font-size: 24px;">NIKE</div>
        <div actions style="display: flex; gap: 16px;">
          <span>Search</span>
          <span>Cart</span>
        </div>
      </lib-navigation-bar>
    `,
  }),
};

export const SimpleNav: Story = {
  args: {
    items: [
      { id: 'shop', label: 'Shop', href: '/shop' },
      { id: 'about', label: 'About', href: '/about' },
      { id: 'contact', label: 'Contact', href: '/contact' },
    ],
    logoHref: '/',
  },
  render: (args) => ({
    props: args,
    template: `
      <lib-navigation-bar [items]="items" [logoHref]="logoHref">
        <div logo style="font-weight: bold; font-size: 24px;">BRAND</div>
      </lib-navigation-bar>
    `,
  }),
};
