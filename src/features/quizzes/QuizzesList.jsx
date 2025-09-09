import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export default function QuizzesList() {
  const { state, deleteQuiz } = useApp();

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      deleteQuiz(id);
    }
  };

  const getQuizResult = (quizId) => {
    return state.progress.completedQuizzes.find(q => q.quizId === quizId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quizzes</h1>
          <p className="mt-2 text-gray-600">
            Test your system design knowledge with interactive quizzes
          </p>
        </div>
        <Link
          to="/quizzes/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Add Quiz
        </Link>
      </div>

      {state.quizzes.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No quizzes yet</h3>
          <p className="text-gray-600 mb-6">Get started by creating your first quiz</p>
          <Link
            to="/quizzes/new"
            className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Create First Quiz
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {state.quizzes.map((quiz) => {
            const result = getQuizResult(quiz.id);
            const relatedLecture = quiz.lectureId ? state.lectures.find(l => l.id === quiz.lectureId) : null;
            
            return (
              <div key={quiz.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h2 className="text-xl font-semibold text-gray-900 line-clamp-2">
                      {quiz.title}
                    </h2>
                    {result && (
                      <div className="flex-shrink-0 ml-2">
                        <div className={`px-2 py-1 rounded text-xs font-medium ${
                          result.score >= 80 
                            ? 'bg-green-100 text-green-800'
                            : result.score >= 60
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {result.score}%
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {quiz.description}
                  </p>

                  {relatedLecture && (
                    <div className="mb-4">
                      <Link
                        to={`/lectures/${relatedLecture.id}`}
                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                      >
                        📚 {relatedLecture.title}
                      </Link>
                    </div>
                  )}

                  <div className="text-sm text-gray-500 mb-4">
                    {quiz.questions.length} question{quiz.questions.length !== 1 ? 's' : ''}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Link
                      to={`/quizzes/${quiz.id}`}
                      className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      {result ? 'Retake Quiz' : 'Take Quiz'} →
                    </Link>
                    
                    <div className="flex space-x-2">
                      <Link
                        to={`/quizzes/${quiz.id}/edit`}
                        className="text-gray-400 hover:text-gray-600"
                        title="Edit quiz"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Link>
                      <button
                        onClick={() => handleDelete(quiz.id)}
                        className="text-gray-400 hover:text-red-600"
                        title="Delete quiz"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
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