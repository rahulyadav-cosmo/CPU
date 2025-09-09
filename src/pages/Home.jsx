import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Home() {
  const { state } = useApp();

  const stats = {
    totalLectures: state.lectures.length,
    completedLectures: state.progress.completedLectures.length,
    totalQuizzes: state.quizzes.length,
    completedQuizzes: state.progress.completedQuizzes.length,
    forumThreads: state.forumThreads.length
  };

  const features = [
    {
      title: 'Interactive Lectures',
      description: 'Learn system design concepts with rich content, diagrams, and real-world examples.',
      icon: '📚',
      link: '/lectures',
      color: 'bg-blue-500'
    },
    {
      title: 'Practice Quizzes',
      description: 'Test your knowledge with interactive quizzes and get instant feedback.',
      icon: '📝',
      link: '/quizzes',
      color: 'bg-green-500'
    },
    {
      title: 'Community Forum',
      description: 'Engage with other learners, ask questions, and share insights.',
      icon: '💬',
      link: '/forum',
      color: 'bg-purple-500'
    },
    {
      title: 'Track Progress',
      description: 'Monitor your learning journey and earn achievements.',
      icon: '📊',
      link: '/progress',
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Master System Design
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Learn system design concepts interactively through lectures, quizzes, and community discussions. 
          Build the skills you need for technical interviews and real-world applications.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/lectures"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
          >
            Start Learning
          </Link>
          <Link
            to="/forum"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Join Community
          </Link>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-indigo-600">{stats.totalLectures}</div>
          <div className="text-sm text-gray-500">Total Lectures</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-green-600">{stats.completedLectures}</div>
          <div className="text-sm text-gray-500">Completed</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-purple-600">{stats.totalQuizzes}</div>
          <div className="text-sm text-gray-500">Quizzes</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-orange-600">{stats.forumThreads}</div>
          <div className="text-sm text-gray-500">Discussions</div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {features.map((feature, index) => (
          <Link
            key={index}
            to={feature.link}
            className="group bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-8"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            <div className="mt-4 flex items-center text-indigo-600 group-hover:text-indigo-800">
              <span className="text-sm font-medium">Explore</span>
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Content */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Recent Lectures */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Lectures</h2>
            <Link to="/lectures" className="text-sm text-indigo-600 hover:text-indigo-800">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {state.lectures.slice(0, 3).map((lecture) => (
              <div key={lecture.id} className="border-l-4 border-blue-500 pl-4">
                <Link to={`/lectures/${lecture.id}`} className="block hover:bg-gray-50 -ml-4 pl-4 py-2 rounded">
                  <h3 className="font-medium text-gray-900">{lecture.title}</h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{lecture.description}</p>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Forum Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Forum Activity</h2>
            <Link to="/forum" className="text-sm text-indigo-600 hover:text-indigo-800">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {state.forumThreads.slice(0, 3).map((thread) => (
              <div key={thread.id} className="border-l-4 border-purple-500 pl-4">
                <Link to={`/forum/${thread.id}`} className="block hover:bg-gray-50 -ml-4 pl-4 py-2 rounded">
                  <h3 className="font-medium text-gray-900">{thread.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    by {thread.author} • {thread.replies.length} replies
                  </p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}