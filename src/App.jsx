import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './layouts/Layout';

// Pages
import Home from './pages/Home';
import LecturesList from './features/lectures/LecturesList';
import LectureDetail from './features/lectures/LectureDetail';
import LectureForm from './features/lectures/LectureForm';
import QuizzesList from './features/quizzes/QuizzesList';
import QuizDetail from './features/quizzes/QuizDetail';
import QuizForm from './features/quizzes/QuizForm';
import Forum from './features/forum/Forum';
import ThreadDetail from './features/forum/ThreadDetail';
import Progress from './pages/Progress';

function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lectures" element={<LecturesList />} />
            <Route path="/lectures/:id" element={<LectureDetail />} />
            <Route path="/lectures/new" element={<LectureForm />} />
            <Route path="/lectures/:id/edit" element={<LectureForm />} />
            <Route path="/quizzes" element={<QuizzesList />} />
            <Route path="/quizzes/:id" element={<QuizDetail />} />
            <Route path="/quizzes/new" element={<QuizForm />} />
            <Route path="/quizzes/:id/edit" element={<QuizForm />} />
            <Route path="/forum" element={<Forum />} />
            <Route path="/forum/:id" element={<ThreadDetail />} />
            <Route path="/progress" element={<Progress />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
}

export default App;
