import React, { useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import mermaid from 'mermaid';

export default function LectureDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, completeLecture } = useApp();
  const contentRef = useRef();

  const lecture = state.lectures.find(l => l.id === id);
  const isCompleted = state.progress.completedLectures.includes(id);

  useEffect(() => {
    // Initialize Mermaid
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose'
    });

    // Render mermaid diagrams
    if (contentRef.current) {
      mermaid.contentLoaded();
    }
  }, [lecture]);

  if (!lecture) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Lecture not found</h2>
        <p className="text-gray-600 mb-6">The lecture you're looking for doesn't exist.</p>
        <Link
          to="/lectures"
          className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Back to Lectures
        </Link>
      </div>
    );
  }

  const handleComplete = () => {
    if (!isCompleted) {
      completeLecture(id);
    }
  };

  const renderContent = (content) => {
    // Simple markdown-like rendering
    return content
      .split('\n')
      .map((line, index) => {
        // Headers
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-3xl font-bold text-gray-900 mt-8 mb-4">{line.slice(2)}</h1>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-2xl font-semibold text-gray-800 mt-6 mb-3">{line.slice(3)}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-xl font-medium text-gray-700 mt-4 mb-2">{line.slice(4)}</h3>;
        }

        // Code blocks
        if (line.startsWith('```mermaid')) {
          // Find the closing ```
          const lines = content.split('\n');
          const startIndex = lines.findIndex((l, i) => i >= index && l.startsWith('```mermaid'));
          const endIndex = lines.findIndex((l, i) => i > startIndex && l === '```');
          
          if (endIndex > startIndex) {
            const mermaidCode = lines.slice(startIndex + 1, endIndex).join('\n');
            return (
              <div key={index} className="mermaid my-6 p-4 bg-gray-50 rounded-lg overflow-x-auto">
                {mermaidCode}
              </div>
            );
          }
        }
        
        if (line.startsWith('```')) {
          // Find the closing ```
          const lines = content.split('\n');
          const startIndex = lines.findIndex((l, i) => i >= index && l.startsWith('```'));
          const endIndex = lines.findIndex((l, i) => i > startIndex && l === '```');
          
          if (endIndex > startIndex) {
            const codeContent = lines.slice(startIndex + 1, endIndex).join('\n');
            return (
              <pre key={index} className="my-4 p-4 bg-gray-900 text-gray-100 rounded-lg overflow-x-auto">
                <code>{codeContent}</code>
              </pre>
            );
          }
        }

        // Lists
        if (line.match(/^\d+\./)) {
          return <li key={index} className="ml-6 mb-2 text-gray-700">{line.replace(/^\d+\.\s*/, '')}</li>;
        }
        if (line.startsWith('- ')) {
          return <li key={index} className="ml-6 mb-2 text-gray-700 list-disc">{line.slice(2)}</li>;
        }

        // Regular paragraphs
        if (line.trim()) {
          return <p key={index} className="mb-4 text-gray-700 leading-relaxed">{line}</p>;
        }

        return <br key={index} />;
      });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
          <Link to="/lectures" className="hover:text-gray-700">Lectures</Link>
          <span>→</span>
          <span className="text-gray-900">{lecture.title}</span>
        </nav>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{lecture.title}</h1>
            <p className="text-xl text-gray-600 mb-6">{lecture.description}</p>
            
            {isCompleted && (
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Completed
              </div>
            )}
          </div>

          <div className="flex space-x-3 ml-6">
            <Link
              to={`/lectures/${id}/edit`}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Edit
            </Link>
            {!isCompleted && (
              <button
                onClick={handleComplete}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Mark Complete
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-md p-8">
        {lecture.image && (
          <div className="mb-8">
            <img
              src={lecture.image}
              alt={lecture.title}
              className="w-full h-64 object-cover rounded-lg"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}

        <div ref={contentRef} className="prose max-w-none">
          {renderContent(lecture.content)}
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex justify-between items-center">
        <Link
          to="/lectures"
          className="inline-flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Lectures
        </Link>

        {/* Find related quiz */}
        {(() => {
          const relatedQuiz = state.quizzes.find(q => q.lectureId === id);
          return relatedQuiz ? (
            <Link
              to={`/quizzes/${relatedQuiz.id}`}
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Take Quiz
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          ) : null;
        })()}
      </div>
    </div>
  );
}