import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Footer, FooterColumn, FooterLink, SocialLink } from './footer';

describe('Footer', () => {
  let component: Footer;
  let fixture: ComponentFixture<Footer>;

  const mockColumns: FooterColumn[] = [
    {
      title: 'Shop',
      links: [
        { label: 'Men', href: '/men' },
        { label: 'Women', href: '/women' }
      ]
    },
    {
      title: 'Support',
      links: [
        { label: 'Contact', href: '/contact' },
        { label: 'FAQ', href: '/faq' }
      ]
    }
  ];

  const mockSocialLinks: SocialLink[] = [
    { platform: 'Twitter', href: 'https://twitter.com', icon: '<svg>T</svg>' },
    { platform: 'Instagram', href: 'https://instagram.com', icon: '<svg>I</svg>' }
  ];

  const mockLegalLinks: FooterLink[] = [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Footer]
    }).compileComponents();

    fixture = TestBed.createComponent(Footer);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have default empty arrays', () => {
    expect(component.columns).toEqual([]);
    expect(component.socialLinks).toEqual([]);
    expect(component.legalLinks).toEqual([]);
    expect(component.copyright).toBe('');
  });

  it('should render footer columns', () => {
    component.columns = mockColumns;
    fixture.detectChanges();

    const columns = fixture.nativeElement.querySelectorAll('.footer__column');
    expect(columns.length).toBe(2);
  });

  it('should render column titles', () => {
    component.columns = mockColumns;
    fixture.detectChanges();

    const titles = fixture.nativeElement.querySelectorAll('.footer__column-title');
    expect(titles.length).toBe(2);
    expect(titles[0].textContent.trim()).toBe('Shop');
    expect(titles[1].textContent.trim()).toBe('Support');
  });

  it('should render column links', () => {
    component.columns = mockColumns;
    fixture.detectChanges();

    const links = fixture.nativeElement.querySelectorAll('.footer__link');
    expect(links.length).toBe(4);
  });

  it('should render social links when provided', () => {
    component.socialLinks = mockSocialLinks;
    fixture.detectChanges();

    const socialLinks = fixture.nativeElement.querySelectorAll('.footer__social-link');
    expect(socialLinks.length).toBe(2);
  });

  it('should not render social section when no social links', () => {
    component.socialLinks = [];
    fixture.detectChanges();

    const socialSection = fixture.nativeElement.querySelector('.footer__social');
    expect(socialSection).toBeFalsy();
  });

  it('should render legal links', () => {
    component.legalLinks = mockLegalLinks;
    fixture.detectChanges();

    const legalLinks = fixture.nativeElement.querySelectorAll('.footer__legal-link');
    expect(legalLinks.length).toBe(2);
  });

  it('should render copyright text', () => {
    component.copyright = '© 2024 Vult';
    fixture.detectChanges();

    const copyrightElement = fixture.nativeElement.querySelector('.footer__copyright');
    expect(copyrightElement.textContent.trim()).toBe('© 2024 Vult');
  });

  it('should emit linkClick when column link is clicked', () => {
    component.columns = mockColumns;
    const emitSpy = jest.spyOn(component.linkClick, 'emit');
    fixture.detectChanges();

    const event = new MouseEvent('click');
    component.onLinkClick(event, mockColumns[0].links[0]);

    expect(emitSpy).toHaveBeenCalledWith(mockColumns[0].links[0]);
  });

  it('should emit linkClick when legal link is clicked', () => {
    component.legalLinks = mockLegalLinks;
    const emitSpy = jest.spyOn(component.linkClick, 'emit');
    fixture.detectChanges();

    const event = new MouseEvent('click');
    component.onLinkClick(event, mockLegalLinks[0]);

    expect(emitSpy).toHaveBeenCalledWith(mockLegalLinks[0]);
  });

  it('should prevent default on link click', () => {
    component.columns = mockColumns;
    fixture.detectChanges();

    const event = new MouseEvent('click');
    const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

    component.onLinkClick(event, mockColumns[0].links[0]);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('should set aria-label on social links', () => {
    component.socialLinks = mockSocialLinks;
    fixture.detectChanges();

    const socialLinks = fixture.nativeElement.querySelectorAll('.footer__social-link');
    expect(socialLinks[0].getAttribute('aria-label')).toBe('Twitter');
    expect(socialLinks[1].getAttribute('aria-label')).toBe('Instagram');
  });

  it('should set target and rel on social links', () => {
    component.socialLinks = mockSocialLinks;
    fixture.detectChanges();

    const socialLinks = fixture.nativeElement.querySelectorAll('.footer__social-link');
    expect(socialLinks[0].getAttribute('target')).toBe('_blank');
    expect(socialLinks[0].getAttribute('rel')).toBe('noopener noreferrer');
  });
});
