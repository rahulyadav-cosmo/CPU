import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Progress() {
  const { state } = useApp();

  const progressStats = {
    lecturesCompleted: state.progress.completedLectures.length,
    totalLectures: state.lectures.length,
    quizzesCompleted: state.progress.completedQuizzes.length,
    totalQuizzes: state.quizzes.length,
    totalScore: state.progress.totalScore,
    averageScore: state.progress.completedQuizzes.length > 0 
      ? Math.round(state.progress.totalScore / state.progress.completedQuizzes.length)
      : 0
  };

  const lectureProgress = Math.round((progressStats.lecturesCompleted / Math.max(progressStats.totalLectures, 1)) * 100);
  const quizProgress = Math.round((progressStats.quizzesCompleted / Math.max(progressStats.totalQuizzes, 1)) * 100);

  const achievements = [
    {
      title: 'First Steps',
      description: 'Complete your first lecture',
      achieved: progressStats.lecturesCompleted > 0,
      icon: '🎯'
    },
    {
      title: 'Quiz Master',
      description: 'Complete your first quiz',
      achieved: progressStats.quizzesCompleted > 0,
      icon: '🏆'
    },
    {
      title: 'Dedicated Learner',
      description: 'Complete 5 lectures',
      achieved: progressStats.lecturesCompleted >= 5,
      icon: '📚'
    },
    {
      title: 'High Scorer',
      description: 'Achieve average score of 80% or higher',
      achieved: progressStats.averageScore >= 80,
      icon: '⭐'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Learning Progress</h1>
        <p className="text-lg text-gray-600">Track your journey through the System Design curriculum</p>
      </div>

      {/* Overall Progress */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Lecture Progress</h2>
            <span className="text-2xl font-bold text-blue-600">{lectureProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${lectureProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600">
            {progressStats.lecturesCompleted} of {progressStats.totalLectures} lectures completed
          </p>
          <Link
            to="/lectures"
            className="inline-block mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Continue Learning →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Quiz Progress</h2>
            <span className="text-2xl font-bold text-green-600">{quizProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div
              className="bg-green-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${quizProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600">
            {progressStats.quizzesCompleted} of {progressStats.totalQuizzes} quizzes completed
          </p>
          <Link
            to="/quizzes"
            className="inline-block mt-4 text-green-600 hover:text-green-800 text-sm font-medium"
          >
            Take a Quiz →
          </Link>
        </div>
      </div>

      {/* Score Statistics */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Score Statistics</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-600">{progressStats.totalScore}</div>
            <div className="text-sm text-gray-600 mt-1">Total Score</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{progressStats.averageScore}%</div>
            <div className="text-sm text-gray-600 mt-1">Average Score</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">{progressStats.quizzesCompleted}</div>
            <div className="text-sm text-gray-600 mt-1">Quizzes Taken</div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Achievements</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 ${
                achievement.achieved
                  ? 'border-green-200 bg-green-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className={`text-2xl ${achievement.achieved ? 'opacity-100' : 'opacity-50'}`}>
                  {achievement.icon}
                </span>
                <div>
                  <h3 className={`font-semibold ${
                    achievement.achieved ? 'text-green-800' : 'text-gray-600'
                  }`}>
                    {achievement.title}
                  </h3>
                  <p className={`text-sm ${
                    achievement.achieved ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {achievement.description}
                  </p>
                </div>
                {achievement.achieved && (
                  <div className="ml-auto">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {state.progress.completedLectures.slice(-3).map((lectureId) => {
            const lecture = state.lectures.find(l => l.id === lectureId);
            return lecture ? (
              <div key={lectureId} className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white">📚</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Completed lecture</p>
                  <p className="text-sm text-gray-600">{lecture.title}</p>
                </div>
              </div>
            ) : null;
          })}
          
          {state.progress.completedQuizzes.slice(-3).map((result, index) => {
            const quiz = state.quizzes.find(q => q.id === result.quizId);
            return quiz ? (
              <div key={index} className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white">📝</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Completed quiz</p>
                  <p className="text-sm text-gray-600">
                    {quiz.title} - Score: {result.score}%
                  </p>
                </div>
              </div>
            ) : null;
          })}
          
          {state.progress.completedLectures.length === 0 && state.progress.completedQuizzes.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No activity yet. Start learning to see your progress here!</p>
              <Link
                to="/lectures"
                className="inline-block mt-4 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Start Learning
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}