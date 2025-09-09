import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export default function ThreadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, addForumReply } = useApp();
  
  const thread = state.forumThreads.find(t => t.id === id);
  
  const [newReply, setNewReply] = useState({
    author: '',
    content: ''
  });

  if (!thread) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Thread not found</h2>
        <p className="text-gray-600 mb-6">The discussion you're looking for doesn't exist.</p>
        <Link
          to="/forum"
          className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Back to Forum
        </Link>
      </div>
    );
  }

  const handleSubmitReply = (e) => {
    e.preventDefault();
    if (newReply.author.trim() && newReply.content.trim()) {
      addForumReply(id, newReply);
      setNewReply({ author: '', content: '' });
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
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
          <Link to="/forum" className="hover:text-gray-700">Forum</Link>
          <span>→</span>
          <span className="text-gray-900 line-clamp-1">{thread.title}</span>
        </nav>

        <Link
          to="/forum"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-4"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Forum
        </Link>
      </div>

      {/* Original Thread */}
      <div className="bg-white rounded-lg shadow-md mb-8">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(thread.category)}`}>
                  {thread.category}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{thread.title}</h1>
            </div>
          </div>

          <div className="prose max-w-none mb-6">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{thread.content}</p>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-semibold text-sm">
                    {thread.author.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="font-medium text-gray-900">{thread.author}</span>
              </div>
              <span>{formatDate(thread.createdAt)}</span>
            </div>
            <span>{thread.replies.length} replies</span>
          </div>
        </div>
      </div>

      {/* Replies */}
      {thread.replies.length > 0 && (
        <div className="space-y-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900">Replies</h2>
          {thread.replies.map((reply, index) => (
            <div key={reply.id} className="bg-white rounded-lg shadow-md">
              <div className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-semibold">
                      {reply.author.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="font-medium text-gray-900">{reply.author}</span>
                      <span className="text-sm text-gray-500">{formatDate(reply.createdAt)}</span>
                    </div>
                    <div className="prose max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{reply.content}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reply Form */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Reply</h2>
          <form onSubmit={handleSubmitReply} className="space-y-4">
            <div>
              <label htmlFor="replyAuthor" className="block text-sm font-medium text-gray-700 mb-2">
                Your Name *
              </label>
              <input
                type="text"
                id="replyAuthor"
                value={newReply.author}
                onChange={(e) => setNewReply({ ...newReply, author: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your name"
                required
              />
            </div>

            <div>
              <label htmlFor="replyContent" className="block text-sm font-medium text-gray-700 mb-2">
                Your Reply *
              </label>
              <textarea
                id="replyContent"
                rows={4}
                value={newReply.content}
                onChange={(e) => setNewReply({ ...newReply, content: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Share your thoughts on this discussion..."
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Post Reply
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Related Content */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Content</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {/* Related lectures */}
          {state.lectures.slice(0, 2).map(lecture => (
            <Link
              key={lecture.id}
              to={`/lectures/${lecture.id}`}
              className="block p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-3">
                <span className="text-blue-600">📚</span>
                <div>
                  <h4 className="font-medium text-gray-900 line-clamp-1">{lecture.title}</h4>
                  <p className="text-sm text-gray-600 line-clamp-1">{lecture.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}