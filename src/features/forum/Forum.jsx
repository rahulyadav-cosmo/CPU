import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export default function Forum() {
  const { state, addForumThread } = useApp();
  const [showNewThreadForm, setShowNewThreadForm] = useState(false);
  const [newThread, setNewThread] = useState({
    title: '',
    content: '',
    author: '',
    category: 'General'
  });

  const categories = ['General', 'Interview Prep', 'Architecture', 'Databases', 'Performance', 'Tools'];

  const handleSubmitThread = (e) => {
    e.preventDefault();
    if (newThread.title.trim() && newThread.content.trim() && newThread.author.trim()) {
      addForumThread(newThread);
      setNewThread({ title: '', content: '', author: '', category: 'General' });
      setShowNewThreadForm(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'General': 'bg-gray-100 text-gray-800',
      'Interview Prep': 'bg-blue-100 text-blue-800',
      'Architecture': 'bg-purple-100 text-purple-800',
      'Databases': 'bg-green-100 text-green-800',
      'Performance': 'bg-orange-100 text-orange-800',
      'Tools': 'bg-yellow-100 text-yellow-800'
    };
    return colors[category] || colors['General'];
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Community Forum</h1>
          <p className="mt-2 text-gray-600">
            Discuss system design concepts, share insights, and learn from the community
          </p>
        </div>
        <button
          onClick={() => setShowNewThreadForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          New Discussion
        </button>
      </div>

      {/* New Thread Form */}
      {showNewThreadForm && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Start New Discussion</h2>
          <form onSubmit={handleSubmitThread} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  id="author"
                  value={newThread.author}
                  onChange={(e) => setNewThread({ ...newThread, author: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your name"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  value={newThread.category}
                  onChange={(e) => setNewThread({ ...newThread, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Discussion Title *
              </label>
              <input
                type="text"
                id="title"
                value={newThread.title}
                onChange={(e) => setNewThread({ ...newThread, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="What would you like to discuss?"
                required
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Message *
              </label>
              <textarea
                id="content"
                rows={4}
                value={newThread.content}
                onChange={(e) => setNewThread({ ...newThread, content: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Share your thoughts, questions, or insights..."
                required
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowNewThreadForm(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Start Discussion
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Threads List */}
      {state.forumThreads.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <div className="text-6xl mb-4">💬</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No discussions yet</h3>
          <p className="text-gray-600 mb-6">Start the first discussion to engage with the community</p>
          <button
            onClick={() => setShowNewThreadForm(true)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Start First Discussion
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {state.forumThreads.map((thread) => (
            <div key={thread.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Link to={`/forum/${thread.id}`} className="block p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(thread.category)}`}>
                        {thread.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 hover:text-indigo-600 transition-colors line-clamp-2">
                      {thread.title}
                    </h3>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {thread.content}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span>by {thread.author}</span>
                    <span>{formatDate(thread.createdAt)}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.418 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.418-8 9-8s9 3.582 9 8z" />
                      </svg>
                      {thread.replies.length} replies
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Categories Filter */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Browse by Category</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => {
            const threadCount = state.forumThreads.filter(thread => thread.category === category).length;
            return (
              <div
                key={category}
                className={`px-3 py-2 rounded-lg cursor-pointer transition-colors ${getCategoryColor(category)} hover:opacity-80`}
              >
                {category} ({threadCount})
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}