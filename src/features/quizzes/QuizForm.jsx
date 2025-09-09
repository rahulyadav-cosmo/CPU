import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export default function QuizForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, addQuiz, updateQuiz } = useApp();
  
  const isEditing = Boolean(id);
  const existingQuiz = isEditing ? state.quizzes.find(q => q.id === id) : null;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    lectureId: '',
    questions: [{
      id: 'q1',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: ''
    }]
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditing && existingQuiz) {
      setFormData({
        title: existingQuiz.title || '',
        description: existingQuiz.description || '',
        lectureId: existingQuiz.lectureId || '',
        questions: existingQuiz.questions || [{
          id: 'q1',
          question: '',
          options: ['', '', '', ''],
          correctAnswer: 0,
          explanation: ''
        }]
      });
    }
  }, [isEditing, existingQuiz]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.questions.length === 0) {
      newErrors.questions = 'At least one question is required';
    }

    formData.questions.forEach((question, index) => {
      if (!question.question.trim()) {
        newErrors[`question_${index}`] = 'Question text is required';
      }
      if (question.options.some(option => !option.trim())) {
        newErrors[`options_${index}`] = 'All answer options are required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const quizData = {
      ...formData,
      createdAt: existingQuiz?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (isEditing) {
      updateQuiz({ ...quizData, id });
    } else {
      addQuiz(quizData);
    }

    navigate('/quizzes');
  };

  const handleBasicInfoChange = (field) => (e) => {
    setFormData({
      ...formData,
      [field]: e.target.value
    });
    
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: ''
      });
    }
  };

  const handleQuestionChange = (questionIndex, field, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      [field]: value
    };
    
    setFormData({
      ...formData,
      questions: updatedQuestions
    });

    // Clear related errors
    const errorKey = field === 'question' ? `question_${questionIndex}` : `options_${questionIndex}`;
    if (errors[errorKey]) {
      setErrors({
        ...errors,
        [errorKey]: ''
      });
    }
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    
    setFormData({
      ...formData,
      questions: updatedQuestions
    });
  };

  const addQuestion = () => {
    const newQuestion = {
      id: `q${Date.now()}`,
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: ''
    };
    
    setFormData({
      ...formData,
      questions: [...formData.questions, newQuestion]
    });
  };

  const removeQuestion = (index) => {
    if (formData.questions.length > 1) {
      const updatedQuestions = formData.questions.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        questions: updatedQuestions
      });
    }
  };

  const loadSampleQuiz = () => {
    setFormData({
      title: 'System Design Fundamentals Quiz',
      description: 'Test your understanding of basic system design concepts including scalability, load balancing, and databases.',
      lectureId: state.lectures[0]?.id || '',
      questions: [
        {
          id: 'q1',
          question: 'What is the primary purpose of a load balancer in system design?',
          options: [
            'Store data permanently',
            'Distribute incoming requests across multiple servers',
            'Execute business logic',
            'Manage user authentication'
          ],
          correctAnswer: 1,
          explanation: 'A load balancer distributes incoming requests across multiple servers to prevent any single server from being overwhelmed and to improve system reliability.'
        },
        {
          id: 'q2',
          question: 'Which database property ensures that all operations within a transaction are completed successfully?',
          options: [
            'Atomicity',
            'Consistency',
            'Isolation',
            'Durability'
          ],
          correctAnswer: 0,
          explanation: 'Atomicity ensures that all operations within a transaction are completed successfully, or none are applied at all. This is part of the ACID properties.'
        }
      ]
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
          <Link to="/quizzes" className="hover:text-gray-700">Quizzes</Link>
          <span>→</span>
          <span className="text-gray-900">{isEditing ? 'Edit' : 'New'} Quiz</span>
        </nav>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditing ? 'Edit Quiz' : 'Create New Quiz'}
            </h1>
            <p className="mt-2 text-gray-600">
              {isEditing 
                ? 'Update the quiz questions and information'
                : 'Create an interactive quiz to test knowledge'
              }
            </p>
          </div>
          
          <button
            type="button"
            onClick={loadSampleQuiz}
            className="px-4 py-2 text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-md hover:bg-indigo-100 transition-colors"
          >
            Load Sample Quiz
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Basic Information</h2>
            
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Quiz Title *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={handleBasicInfoChange('title')}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter quiz title"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                rows={3}
                value={formData.description}
                onChange={handleBasicInfoChange('description')}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Brief description of what this quiz covers"
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>

            <div>
              <label htmlFor="lectureId" className="block text-sm font-medium text-gray-700 mb-2">
                Related Lecture (optional)
              </label>
              <select
                id="lectureId"
                value={formData.lectureId}
                onChange={handleBasicInfoChange('lectureId')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">No related lecture</option>
                {state.lectures.map(lecture => (
                  <option key={lecture.id} value={lecture.id}>
                    {lecture.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Questions</h2>
              <button
                type="button"
                onClick={addQuestion}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Add Question
              </button>
            </div>

            {formData.questions.map((question, questionIndex) => (
              <div key={question.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Question {questionIndex + 1}
                  </h3>
                  {formData.questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(questionIndex)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Question Text *
                    </label>
                    <textarea
                      rows={2}
                      value={question.question}
                      onChange={(e) => handleQuestionChange(questionIndex, 'question', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        errors[`question_${questionIndex}`] ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter the question"
                    />
                    {errors[`question_${questionIndex}`] && (
                      <p className="mt-1 text-sm text-red-600">{errors[`question_${questionIndex}`]}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Answer Options *
                    </label>
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center space-x-3 mb-2">
                        <input
                          type="radio"
                          name={`correct_${questionIndex}`}
                          checked={question.correctAnswer === optionIndex}
                          onChange={() => handleQuestionChange(questionIndex, 'correctAnswer', optionIndex)}
                          className="text-indigo-600 focus:ring-indigo-500"
                        />
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => handleOptionChange(questionIndex, optionIndex, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder={`Option ${optionIndex + 1}`}
                        />
                      </div>
                    ))}
                    {errors[`options_${questionIndex}`] && (
                      <p className="mt-1 text-sm text-red-600">{errors[`options_${questionIndex}`]}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Select the radio button next to the correct answer
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Explanation (optional)
                    </label>
                    <textarea
                      rows={3}
                      value={question.explanation}
                      onChange={(e) => handleQuestionChange(questionIndex, 'explanation', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Explain why this is the correct answer (shown after quiz completion)"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Form Actions */}
          <div className="flex justify-between pt-6 border-t">
            <Link
              to="/quizzes"
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              {isEditing ? 'Update Quiz' : 'Create Quiz'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}