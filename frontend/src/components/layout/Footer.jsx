import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Github, Linkedin, Mail } from 'lucide-react';
import Container from './Container';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const socialLinks = [
    {
      name: 'Twitter',
      href: 'https://twitter.com/greenpulse',
      icon: Twitter,
    },
    {
      name: 'GitHub',
      href: 'https://github.com/yourusername/greenpulse',
      icon: Github,
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com/company/greenpulse',
      icon: Linkedin,
    },
    {
      name: 'Email',
      href: 'mailto:contact@greenpulse.app',
      icon: Mail,
    },
  ];

  const footerLinks = [
    {
      title: 'Product',
      links: [
        { name: 'Features', href: '/#features' },
        { name: 'Pricing', href: '/pricing' },
        { name: 'Roadmap', href: '/roadmap' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About', href: '/about' },
        { name: 'Blog', href: '/blog' },
        { name: 'Careers', href: '/careers' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy', href: '/privacy' },
        { name: 'Terms', href: '/terms' },
        { name: 'Cookie Policy', href: '/cookies' },
      ],
    },
  ];

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-12">
      <Container className="py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mr-2">
                <span className="text-white font-bold text-sm">GP</span>
              </div>
              <span className="text-xl font-bold text-gray-900">GreenPulse</span>
            </div>
            <p className="text-gray-600 text-sm">
              Turning citizen insights into climate action. Join our mission to create greener, more sustainable communities.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-primary-600 transition-colors"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {footerLinks.map((section) => (
            <div key={section.title} className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            &copy; {currentYear} GreenPulse. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
