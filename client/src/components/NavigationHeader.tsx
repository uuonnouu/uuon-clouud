
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';

interface NavigationHeaderProps {
  title: string;
}

export default function NavigationHeader({ title }: NavigationHeaderProps) {
  const location = useLocation();

  const navigationItems = [
    { path: '/', label: 'Visualizer' },
    { path: '/sdk-portal', label: 'SDK Portal' },
    { path: '/api-docs', label: 'API Docs' },
    { path: '/documentation', label: 'Documentation' },
    { path: '/tutorials', label: 'Tutorials' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/research', label: 'Research' },
    { path: '/enterprise', label: 'Enterprise' },
    { path: '/about', label: 'About' }
  ];

  return (
    <div className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <img src="/dmension-logo.png" alt="Δmension" className="w-8 h-8" />
              <span className="text-xl font-bold text-white">Δmension</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={location.pathname === item.path ? "default" : "ghost"}
                  size="sm"
                  className="text-sm"
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>
          
          <div className="text-sm text-gray-400">
            {title}
          </div>
        </div>
      </div>
    </div>
  );
}
