import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Layout({ children }) {
  const location = useLocation();
  const { state } = useApp();

  const navigation = [
    { name: 'Home', href: '/', icon: '🏠' },
    { name: 'Lectures', href: '/lectures', icon: '📚' },
    { name: 'Quizzes', href: '/quizzes', icon: '📝' },
    { name: 'Forum', href: '/forum', icon: '💬' },
    { name: 'Progress', href: '/progress', icon: '📊' }
  ];

  const progressPercentage = Math.round(
    (state.progress.completedLectures.length / Math.max(state.lectures.length, 1)) * 100
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold text-indigo-600">
                System Design Platform
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    location.pathname === item.href
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Progress Indicator */}
            <div className="hidden md:flex items-center space-x-3">
              <div className="text-sm text-gray-500">
                Progress: {progressPercentage}%
              </div>
              <div className="w-20 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200">
          <nav className="flex justify-around py-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex flex-col items-center px-2 py-2 text-xs font-medium rounded-md transition-colors ${
                  location.pathname === item.href
                    ? 'text-indigo-600'
                    : 'text-gray-500'
                }`}
              >
                <span className="text-lg mb-1">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500 text-sm">
            <p>&copy; 2024 System Design Learning Platform. Built with React, Vite, and Tailwind CSS.</p>
            <p className="mt-2">
              Learn system design interactively with lectures, quizzes, and community discussions.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}