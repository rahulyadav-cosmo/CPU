import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export default function LecturesList() {
  const { state, deleteLecture } = useApp();

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this lecture?')) {
      deleteLecture(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lectures</h1>
          <p className="mt-2 text-gray-600">
            Explore system design concepts through interactive lectures
          </p>
        </div>
        <Link
          to="/lectures/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Add Lecture
        </Link>
      </div>

      {state.lectures.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No lectures yet</h3>
          <p className="text-gray-600 mb-6">Get started by creating your first lecture</p>
          <Link
            to="/lectures/new"
            className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Create First Lecture
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {state.lectures.map((lecture) => {
            const isCompleted = state.progress.completedLectures.includes(lecture.id);
            
            return (
              <div key={lecture.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {lecture.image && (
                  <div className="h-48 bg-gray-200 overflow-hidden">
                    <img
                      src={lecture.image}
                      alt={lecture.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h2 className="text-xl font-semibold text-gray-900 line-clamp-2">
                      {lecture.title}
                    </h2>
                    {isCompleted && (
                      <div className="flex-shrink-0 ml-2">
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {lecture.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <Link
                      to={`/lectures/${lecture.id}`}
                      className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      {isCompleted ? 'Review' : 'Start Learning'} →
                    </Link>
                    
                    <div className="flex space-x-2">
                      <Link
                        to={`/lectures/${lecture.id}/edit`}
                        className="text-gray-400 hover:text-gray-600"
                        title="Edit lecture"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Link>
                      <button
                        onClick={() => handleDelete(lecture.id)}
                        className="text-gray-400 hover:text-red-600"
                        title="Delete lecture"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="px-6 pb-4">
                  <div className="text-xs text-gray-500">
                    Created {new Date(lecture.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}