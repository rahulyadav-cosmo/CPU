import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export default function QuizDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, completeQuiz } = useApp();
  
  const quiz = state.quizzes.find(q => q.id === id);
  const existingResult = state.progress.completedQuizzes.find(q => q.quizId === id);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);

  if (!quiz) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Quiz not found</h2>
        <p className="text-gray-600 mb-6">The quiz you're looking for doesn't exist.</p>
        <Link
          to="/quizzes"
          className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Back to Quizzes
        </Link>
      </div>
    );
  }

  const handleAnswerSelect = (questionId, answerIndex) => {
    setAnswers({
      ...answers,
      [questionId]: answerIndex
    });
  };

  const submitQuiz = () => {
    let correct = 0;
    const totalQuestions = quiz.questions.length;

    const questionResults = quiz.questions.map(question => {
      const userAnswer = answers[question.id];
      const isCorrect = userAnswer === question.correctAnswer;
      if (isCorrect) correct++;

      return {
        questionId: question.id,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation
      };
    });

    const score = Math.round((correct / totalQuestions) * 100);
    
    const quizResult = {
      quizId: id,
      score,
      totalQuestions,
      correctAnswers: correct,
      completedAt: new Date().toISOString(),
      results: questionResults
    };

    setResults(quizResult);
    setShowResults(true);
    completeQuiz(quizResult);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setResults(null);
  };

  if (showResults && results) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <Link to="/quizzes" className="hover:text-gray-700">Quizzes</Link>
            <span>→</span>
            <span className="text-gray-900">{quiz.title}</span>
          </nav>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">Quiz Results</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="text-center mb-8">
            <div className={`text-6xl font-bold mb-4 ${
              results.score >= 80 ? 'text-green-600' : 
              results.score >= 60 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {results.score}%
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              {results.score >= 80 ? 'Excellent!' : 
               results.score >= 60 ? 'Good Job!' : 'Keep Learning!'}
            </h2>
            <p className="text-gray-600">
              You scored {results.correctAnswers} out of {results.totalQuestions} questions correctly
            </p>
          </div>

          <div className="space-y-6">
            {quiz.questions.map((question, index) => {
              const questionResult = results.results.find(r => r.questionId === question.id);
              
              return (
                <div key={question.id} className="border rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Question {index + 1}: {question.question}
                    </h3>
                    {questionResult.isCorrect ? (
                      <div className="text-green-600 font-semibold">✓ Correct</div>
                    ) : (
                      <div className="text-red-600 font-semibold">✗ Incorrect</div>
                    )}
                  </div>

                  <div className="space-y-2 mb-4">
                    {question.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className={`p-3 rounded-md border ${
                          optionIndex === question.correctAnswer
                            ? 'bg-green-100 border-green-300'
                            : optionIndex === questionResult.userAnswer && !questionResult.isCorrect
                            ? 'bg-red-100 border-red-300'
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{option}</span>
                          {optionIndex === question.correctAnswer && (
                            <span className="text-green-600 text-sm font-medium">Correct Answer</span>
                          )}
                          {optionIndex === questionResult.userAnswer && optionIndex !== question.correctAnswer && (
                            <span className="text-red-600 text-sm font-medium">Your Answer</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {questionResult.explanation && (
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                      <h4 className="font-medium text-blue-900 mb-2">Explanation:</h4>
                      <p className="text-blue-800">{questionResult.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-center space-x-4 mt-8">
            <button
              onClick={resetQuiz}
              className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Retake Quiz
            </button>
            <Link
              to="/quizzes"
              className="px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Back to Quizzes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
          <Link to="/quizzes" className="hover:text-gray-700">Quizzes</Link>
          <span>→</span>
          <span className="text-gray-900">{quiz.title}</span>
        </nav>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{quiz.title}</h1>
            <p className="text-gray-600">{quiz.description}</p>
          </div>
          {existingResult && (
            <div className="text-right">
              <div className="text-sm text-gray-500">Previous Score</div>
              <div className={`text-2xl font-bold ${
                existingResult.score >= 80 ? 'text-green-600' :
                existingResult.score >= 60 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {existingResult.score}%
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </span>
            <span className="text-sm font-medium text-gray-700">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            {question.question}
          </h2>

          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(question.id, index)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  answers[question.id] === index
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                    answers[question.id] === index
                      ? 'border-indigo-500 bg-indigo-500'
                      : 'border-gray-300'
                  }`}>
                    {answers[question.id] === index && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span className="text-gray-900">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {currentQuestion === quiz.questions.length - 1 ? (
            <button
              onClick={submitQuiz}
              disabled={Object.keys(answers).length !== quiz.questions.length}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Quiz
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestion(Math.min(quiz.questions.length - 1, currentQuestion + 1))}
              disabled={answers[question.id] === undefined}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}