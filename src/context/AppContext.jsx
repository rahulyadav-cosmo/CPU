import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext();

const initialState = {
  lectures: [
    {
      id: '1',
      title: 'Introduction to System Design',
      description: 'Learn the fundamentals of system design and scalability',
      content: `# Introduction to System Design

System design is the process of defining the architecture, modules, interfaces, and data for a system to satisfy specified requirements.

## Key Concepts

1. **Scalability** - The ability to handle increased load
2. **Reliability** - The probability a system performs correctly for the duration
3. **Availability** - The percentage of time a system is operational
4. **Consistency** - All nodes see the same data simultaneously

## Basic Components

\`\`\`mermaid
graph TB
    A[Client] --> B[Load Balancer]
    B --> C[Web Server 1]
    B --> D[Web Server 2]
    C --> E[Database]
    D --> E
\`\`\`

### Load Balancer
Distributes incoming requests across multiple servers to ensure no single server bears too much demand.

### Database
Stores and manages data for the application.
`,
      image: '/api/placeholder/400/200',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Database Design and Scaling',
      description: 'Understanding databases, normalization, and scaling strategies',
      content: `# Database Design and Scaling

Learn how to design efficient databases and scale them for high-traffic applications.

## Database Types

### Relational Databases (SQL)
- ACID properties
- Strong consistency
- Complex queries with JOINs

### NoSQL Databases
- BASE properties
- Eventual consistency
- Horizontal scaling

## Scaling Strategies

\`\`\`mermaid
graph LR
    A[Application] --> B[Master DB]
    A --> C[Read Replica 1]
    A --> D[Read Replica 2]
    B --> C
    B --> D
\`\`\`

### Read Replicas
Distribute read operations across multiple database instances.
`,
      image: '/api/placeholder/400/200',
      createdAt: new Date().toISOString()
    }
  ],
  quizzes: [
    {
      id: '1',
      title: 'System Design Basics Quiz',
      description: 'Test your understanding of basic system design concepts',
      questions: [
        {
          id: 'q1',
          question: 'What is the primary purpose of a load balancer?',
          options: [
            'Store data permanently',
            'Distribute incoming requests across multiple servers',
            'Execute business logic',
            'Manage user authentication'
          ],
          correctAnswer: 1,
          explanation: 'A load balancer distributes incoming requests across multiple servers to prevent any single server from being overwhelmed.'
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
          explanation: 'Atomicity ensures that all operations within a transaction are completed successfully, or none are applied at all.'
        }
      ],
      lectureId: '1'
    }
  ],
  forumThreads: [
    {
      id: '1',
      title: 'Best practices for system design interviews',
      author: 'SystemDesigner101',
      content: 'What are some key tips for acing system design interviews? I have one coming up next week.',
      category: 'Interview Prep',
      createdAt: new Date().toISOString(),
      replies: [
        {
          id: 'r1',
          author: 'TechExpert',
          content: 'Start with clarifying requirements, then move to high-level design, and finally dive into detailed components.',
          createdAt: new Date().toISOString()
        }
      ]
    },
    {
      id: '2',
      title: 'Microservices vs Monoliths',
      author: 'ArchitectureGuru',
      content: 'When should you choose microservices over a monolithic architecture?',
      category: 'Architecture',
      createdAt: new Date().toISOString(),
      replies: []
    }
  ],
  progress: {
    completedLectures: [],
    completedQuizzes: [],
    totalScore: 0,
    achievements: []
  }
};

function appReducer(state, action) {
  switch (action.type) {
    case 'ADD_LECTURE':
      return {
        ...state,
        lectures: [...state.lectures, { ...action.payload, id: Date.now().toString() }]
      };
    
    case 'UPDATE_LECTURE':
      return {
        ...state,
        lectures: state.lectures.map(lecture =>
          lecture.id === action.payload.id ? action.payload : lecture
        )
      };
    
    case 'DELETE_LECTURE':
      return {
        ...state,
        lectures: state.lectures.filter(lecture => lecture.id !== action.payload)
      };
    
    case 'ADD_QUIZ':
      return {
        ...state,
        quizzes: [...state.quizzes, { ...action.payload, id: Date.now().toString() }]
      };
    
    case 'UPDATE_QUIZ':
      return {
        ...state,
        quizzes: state.quizzes.map(quiz =>
          quiz.id === action.payload.id ? action.payload : quiz
        )
      };
    
    case 'DELETE_QUIZ':
      return {
        ...state,
        quizzes: state.quizzes.filter(quiz => quiz.id !== action.payload)
      };
    
    case 'ADD_FORUM_THREAD':
      return {
        ...state,
        forumThreads: [...state.forumThreads, { 
          ...action.payload, 
          id: Date.now().toString(),
          replies: [],
          createdAt: new Date().toISOString()
        }]
      };
    
    case 'ADD_FORUM_REPLY':
      return {
        ...state,
        forumThreads: state.forumThreads.map(thread =>
          thread.id === action.payload.threadId
            ? {
                ...thread,
                replies: [...thread.replies, {
                  id: Date.now().toString(),
                  ...action.payload.reply,
                  createdAt: new Date().toISOString()
                }]
              }
            : thread
        )
      };
    
    case 'COMPLETE_LECTURE':
      if (state.progress.completedLectures.includes(action.payload)) {
        return state;
      }
      return {
        ...state,
        progress: {
          ...state.progress,
          completedLectures: [...state.progress.completedLectures, action.payload]
        }
      };
    
    case 'COMPLETE_QUIZ':
      const existingQuizResult = state.progress.completedQuizzes.find(q => q.quizId === action.payload.quizId);
      if (existingQuizResult) {
        return {
          ...state,
          progress: {
            ...state.progress,
            completedQuizzes: state.progress.completedQuizzes.map(q =>
              q.quizId === action.payload.quizId ? action.payload : q
            ),
            totalScore: state.progress.totalScore - existingQuizResult.score + action.payload.score
          }
        };
      }
      return {
        ...state,
        progress: {
          ...state.progress,
          completedQuizzes: [...state.progress.completedQuizzes, action.payload],
          totalScore: state.progress.totalScore + action.payload.score
        }
      };
    
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('systemDesignPlatform', JSON.stringify(state));
  }, [state]);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('systemDesignPlatform');
    if (saved) {
      try {
        const parsedState = JSON.parse(saved);
        // Merge with initial state to ensure new features are available
        Object.keys(parsedState).forEach(key => {
          if (parsedState[key] && typeof parsedState[key] === 'object') {
            dispatch({ type: 'LOAD_' + key.toUpperCase(), payload: parsedState[key] });
          }
        });
      } catch (error) {
        console.error('Failed to load saved state:', error);
      }
    }
  }, []);

  const value = {
    state,
    dispatch,
    // Helper functions
    addLecture: (lecture) => dispatch({ type: 'ADD_LECTURE', payload: lecture }),
    updateLecture: (lecture) => dispatch({ type: 'UPDATE_LECTURE', payload: lecture }),
    deleteLecture: (id) => dispatch({ type: 'DELETE_LECTURE', payload: id }),
    addQuiz: (quiz) => dispatch({ type: 'ADD_QUIZ', payload: quiz }),
    updateQuiz: (quiz) => dispatch({ type: 'UPDATE_QUIZ', payload: quiz }),
    deleteQuiz: (id) => dispatch({ type: 'DELETE_QUIZ', payload: id }),
    addForumThread: (thread) => dispatch({ type: 'ADD_FORUM_THREAD', payload: thread }),
    addForumReply: (threadId, reply) => dispatch({ type: 'ADD_FORUM_REPLY', payload: { threadId, reply } }),
    completeLecture: (id) => dispatch({ type: 'COMPLETE_LECTURE', payload: id }),
    completeQuiz: (result) => dispatch({ type: 'COMPLETE_QUIZ', payload: result })
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}