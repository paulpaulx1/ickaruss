import Link from 'next/link';
import React from 'react';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 text-gray-800 py-6">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center md:flex justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link href="/" className="text-xl font-bold tracking-wider uppercase">YourBrand</Link>
            <p className="text-sm text-gray-600 mt-1">Since {year}</p>
          </div>
          <div className="flex space-x-4">
            <Link href="#" className="hover:text-gray-600">Blog</Link>
            <Link href="#" className="hover:text-gray-600">About Us</Link>
            <Link href="#" className="hover:text-gray-600">Contact</Link>
          </div>
        </div>
        <div className="text-center mt-4 md:mt-2">
          <p className="text-xs text-gray-600">&copy; {year} YourBrand. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
