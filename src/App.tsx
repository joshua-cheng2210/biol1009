import React, { useState, useEffect } from 'react';
// Remove Router imports since you're not actually using routing
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import QuizPage from './components/QuizPage';
import ResultsPage from './components/ResultsPage';
import { quizDataPromise, Question, Quiz } from './data/quizData';

type AppState = 'home' | 'quiz' | 'results';

interface QuizResults {
  answers: { [key: string]: number };
  wrongAnswers: Question[];
}

function App() {
  const [currentState, setCurrentState] = useState<AppState>('home');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResults | null>(null);
  const [quizData, setQuizData] = useState<Quiz[]>([]);

  useEffect(() => {
    quizDataPromise.then(data => {
      setQuizData(data);
    });
  }, []);

  const handleStartQuiz = (topics: string[]) => {
    setSelectedTopics(topics);
    
    // Collect all questions from selected topics
    const questions = topics.flatMap(topic => {
      const quiz = quizData.find(q => q.title === topic);
      return quiz ? quiz.questions : [];
    });
    
    // Shuffle questions for random order
    const shuffledQuestions = [...questions].sort(() => Math.random() - 0.5);
    
    setQuizQuestions(shuffledQuestions);
    setCurrentState('quiz');
  };

  const handleQuizComplete = (answers: { [key: string]: number }, wrongAnswers: Question[]) => {
    setQuizResults({ answers, wrongAnswers });
    setCurrentState('results');
  };

  const handleRetakeQuiz = () => {
    setQuizResults(null);
    setCurrentState('quiz');
  };

  const handleNewQuiz = () => {
    setQuizResults(null);
    setSelectedTopics([]);
    setQuizQuestions([]);
    setCurrentState('home');
  };

  const handleBackToFilter = () => {
    setCurrentState('home');
  };

  return (
    <div className="min-h-screen">
      {currentState === 'home' && (
        <HomePage onStartQuiz={handleStartQuiz} />
      )}
      
      {currentState === 'quiz' && (
        <QuizPage 
          questions={quizQuestions}
          selectedTopics={selectedTopics}
          onComplete={handleQuizComplete}
          onBackToFilter={handleBackToFilter}
        />
      )}
      
      {currentState === 'results' && quizResults && (
        <ResultsPage 
          answers={quizResults.answers}
          wrongAnswers={quizResults.wrongAnswers}
          selectedTopics={selectedTopics}
          onRetakeQuiz={handleRetakeQuiz}
          onNewQuiz={handleNewQuiz}
        />
      )}
    </div>
  );
}

export default App;