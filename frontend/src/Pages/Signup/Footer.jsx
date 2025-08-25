import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Company',
      links: [
        { name: 'About Us', url: '#' },
        { name: 'Careers', url: '#' },
        { name: 'Press', url: '#' },
        { name: 'Blog', url: '#' }
      ]
    },
    {
      title: 'Services',
      links: [
        { name: 'Plumbing', url: '#' },
        { name: 'Electrical', url: '#' },
        { name: 'Cleaning', url: '#' },
        { name: 'Landscaping', url: '#' }
      ]
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', url: '#' },
        { name: 'Contact Us', url: '#' },
        { name: 'FAQs', url: '#' },
        { name: 'Provider Support', url: '#' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { name: 'Terms of Service', url: '#' },
        { name: 'Privacy Policy', url: '#' },
        { name: 'Cookie Policy', url: '#' },
        { name: 'Accessibility', url: '#' }
      ]
    }
  ];

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="brand-title">QuickFixHUB</div>
            <p className="brand-tagline">
              Connecting communities with trusted local service providers.
            </p>
            <div className="social-icons">
              <a href="#" aria-label="Facebook">
                <span className="sr-only">Facebook</span>
                {/* Insert SVGs as-is */}
              </a>
              <a href="#" aria-label="Twitter">
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" aria-label="Instagram">
                <span className="sr-only">Instagram</span>
              </a>
            </div>
          </div>

          {footerLinks.map((column, index) => (
            <div key={index} className="footer-column">
              <h3 className="footer-heading">{column.title}</h3>
              <ul className="footer-links">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a href={link.url} className="footer-link">{link.name}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      </div>
    </footer>
  );
};

export default Footer;
