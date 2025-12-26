import { Meta, StoryObj } from '@storybook/angular';
import { ProductDetailsAccordionComponent, AccordionSection } from './product-details-accordion.component';

const sampleSections: AccordionSection[] = [
  {
    id: 'description',
    title: 'Product Description',
    content: `
      <p>This lightweight woven jacket is designed to keep you comfortable and dry during your workout or daily activities.</p>
      <ul>
        <li>Dri-FIT technology helps keep you dry and comfortable</li>
        <li>Color-blocked design adds visual interest</li>
        <li>Loose fit for a relaxed, easy feel</li>
        <li>Full-zip design with hood</li>
      </ul>
      <p><strong>Product Details:</strong></p>
      <ul>
        <li>Body: 100% Polyester</li>
        <li>Machine wash</li>
        <li>Imported</li>
        <li>Style: IH8461-072</li>
      </ul>
    `
  },
  {
    id: 'shipping',
    title: 'Free Delivery and Returns',
    content: `
      <p>Your order of $50 or more gets free standard delivery.</p>
      <ul>
        <li>Standard delivered 4-5 Business Days</li>
        <li>Express delivered 2-4 Business Days</li>
      </ul>
      <p>Orders are processed and delivered Monday-Friday (excluding public holidays)</p>
      <p>Members get free returns. <a href="#">View Return Policy</a></p>
    `
  },
  {
    id: 'reviews',
    title: 'Reviews (125)',
    content: `
      <p><strong>4.5 out of 5 stars</strong></p>
      <p>Based on 125 reviews</p>
      <ul>
        <li>Comfort: 4.6/5</li>
        <li>Quality: 4.5/5</li>
        <li>Style: 4.7/5</li>
        <li>True to Size: 4.3/5</li>
      </ul>
    `
  }
];

const meta: Meta<ProductDetailsAccordionComponent> = {
  title: 'Components/ProductDetailsAccordion',
  component: ProductDetailsAccordionComponent,
  tags: ['autodocs'],
  argTypes: {
    sections: { control: 'object' },
    mode: {
      control: 'select',
      options: ['single', 'multiple']
    },
    ariaLabel: { control: 'text' }
  }
};

export default meta;
type Story = StoryObj<ProductDetailsAccordionComponent>;

export const Default: Story = {
  args: {
    sections: sampleSections,
    mode: 'multiple',
    ariaLabel: 'Product information'
  }
};

export const SingleMode: Story = {
  args: {
    sections: sampleSections,
    mode: 'single',
    ariaLabel: 'Product information'
  }
};

export const WithFirstExpanded: Story = {
  args: {
    sections: sampleSections,
    mode: 'multiple',
    initialExpandedIds: ['description'],
    ariaLabel: 'Product information'
  }
};

export const MultipleExpanded: Story = {
  args: {
    sections: sampleSections,
    mode: 'multiple',
    initialExpandedIds: ['description', 'shipping'],
    ariaLabel: 'Product information'
  }
};

export const WithDisabledSection: Story = {
  args: {
    sections: [
      ...sampleSections.slice(0, 2),
      {
        ...sampleSections[2],
        disabled: true
      }
    ],
    mode: 'multiple',
    ariaLabel: 'Product information'
  }
};

export const TwoSections: Story = {
  args: {
    sections: sampleSections.slice(0, 2),
    mode: 'multiple',
    ariaLabel: 'Product information'
  }
};

export const SingleSection: Story = {
  args: {
    sections: [sampleSections[0]],
    mode: 'multiple',
    ariaLabel: 'Product description'
  }
};
