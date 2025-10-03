import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle, Leaf, Beaker } from 'lucide-react';
import { Question } from '../data/quizData';

interface QuizPageProps {
  questions: Question[];
  onComplete: (answers: { [key: string]: number }, wrongAnswers: Question[]) => void;
  onBackToFilter: () => void;
}

export default function QuizPage({ questions, onComplete, onBackToFilter }: QuizPageProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [wrongAnswers, setWrongAnswers] = useState<Question[]>([]);
  const [questionQueue, setQuestionQueue] = useState<Question[]>(questions);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<string>>(new Set());
  const [showFeedback, setShowFeedback] = useState(false);

  const currentQuestion = questionQueue[currentQuestionIndex];
  const progress = ((answeredCorrectly.size / questions.length) * 100);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const newAnswers = { ...answers, [currentQuestion.id]: selectedAnswer };
    setAnswers(newAnswers);
    setShowFeedback(true);

    setTimeout(() => {
      if (isCorrect) {
        setAnsweredCorrectly(prev => new Set([...prev, currentQuestion.id]));
        
        // Remove this question from queue
        const newQueue = questionQueue.filter((_, index) => index !== currentQuestionIndex);
        setQuestionQueue(newQueue);
        
        // Adjust current index if needed
        if (currentQuestionIndex >= newQueue.length && newQueue.length > 0) {
          setCurrentQuestionIndex(newQueue.length - 1);
        } else if (newQueue.length === 0) {
          // All questions answered correctly
          onComplete(newAnswers, wrongAnswers);
          return;
        }
      } else {
        // Add to wrong answers if not already there
        if (!wrongAnswers.find(q => q.id === currentQuestion.id)) {
          setWrongAnswers(prev => [...prev, currentQuestion]);
        }
        
        // Add question back to end of queue for re-asking
        const newQueue = [...questionQueue];
        const questionToRequeue = newQueue.splice(currentQuestionIndex, 1)[0];
        newQueue.push(questionToRequeue);
        setQuestionQueue(newQueue);
        
        // Adjust current index
        if (currentQuestionIndex >= newQueue.length - 1) {
          setCurrentQuestionIndex(0);
        }
      }

      setSelectedAnswer(null);
      setShowFeedback(false);
    }, 1500);
  };

  const handleDone = () => {
    onComplete(answers, wrongAnswers);
  };

  const getOptionStyle = (optionIndex: number) => {
    if (!showFeedback) {
      return selectedAnswer === optionIndex 
        ? 'border-primary bg-primary/10 shadow-lg transform scale-105' 
        : 'border-border hover:border-primary/50 hover:shadow-md';
    }

    if (optionIndex === currentQuestion.correctAnswer) {
      return 'border-accent bg-accent/20 shadow-lg';
    }
    
    if (selectedAnswer === optionIndex && optionIndex !== currentQuestion.correctAnswer) {
      return 'border-red-500 bg-red-50 shadow-lg';
    }
    
    return 'border-border opacity-50';
  };

  if (!currentQuestion) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background relative overflow-hidden">
      {/* Background Biology Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Leaf className="absolute top-32 left-16 w-5 h-5 text-accent/15 animate-leaf-float" />
        <Beaker className="absolute top-20 right-24 w-6 h-6 text-nature/20 animate-bounce" />
        <div className="absolute bottom-32 left-32 w-10 h-10 rounded-full bg-secondary/10 animate-pulse" />
        <Leaf className="absolute bottom-20 right-16 w-4 h-4 text-accent/20 animate-leaf-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Top Bar */}
      <div className="bg-card/80 backdrop-blur-sm border-b border-border shadow-card sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={onBackToFilter}
            className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Topics</span>
          </button>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-foreground font-medium">
              <span className="text-lg">🐀</span>
              <span>
                {answeredCorrectly.size} of {questions.length} mastered
              </span>
            </div>
            
            <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-gopher transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <button
            onClick={handleDone}
            className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium hover:shadow-lg transition-all"
          >
            Done
          </button>
        </div>
      </div>

      {/* Main Quiz Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-card rounded-3xl shadow-elegant border border-border p-8 animate-fade-in relative">
          {/* Gopher mascot indicator */}
          <div className="absolute top-4 right-4 text-2xl animate-gopher-hop">
            🐀
          </div>

          {/* Question */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Beaker className="w-6 h-6 text-nature" />
              <span className="text-sm font-medium text-muted-foreground bg-gradient-biology text-transparent bg-clip-text">
                Biology Question {currentQuestionIndex + 1}
              </span>
            </div>
            
            <h2 className="text-2xl font-bold text-foreground leading-relaxed font-academic">
              {currentQuestion.question}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-4 mb-8">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => !showFeedback && handleAnswerSelect(index)}
                disabled={showFeedback}
                className={`
                  w-full p-6 rounded-2xl border-2 text-left transition-all duration-300
                  ${getOptionStyle(index)}
                  ${!showFeedback ? 'cursor-pointer hover:transform hover:scale-[1.02]' : 'cursor-default'}
                `}
              >
                <div className="flex items-center gap-4">
                  <div className={`
                    w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold
                    ${selectedAnswer === index ? 'border-primary bg-primary text-white' : 'border-muted-foreground/30 text-muted-foreground'}
                    ${showFeedback && index === currentQuestion.correctAnswer ? 'border-accent bg-accent text-white' : ''}
                    ${showFeedback && selectedAnswer === index && index !== currentQuestion.correctAnswer ? 'border-red-500 bg-red-500 text-white' : ''}
                  `}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="text-lg font-medium text-foreground">
                    {option}
                  </span>
                  {showFeedback && index === currentQuestion.correctAnswer && (
                    <CheckCircle className="w-6 h-6 text-accent ml-auto" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Feedback */}
          {showFeedback && currentQuestion.explanation && (
            <div className="mb-6 p-4 bg-gradient-to-r from-accent/10 to-nature/10 rounded-xl border border-accent/20 animate-fade-in">
              <div className="flex items-start gap-3">
                <Leaf className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground mb-1">Explanation</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {currentQuestion.explanation}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Next Button */}
          {selectedAnswer !== null && !showFeedback && (
            <div className="flex justify-center animate-bounce-in">
              <button
                onClick={handleNext}
                className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl font-bold text-lg hover:shadow-glow transition-all transform hover:scale-105"
              >
                <span>Continue Learning</span>
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          )}

          {/* Loading state during feedback */}
          {showFeedback && (
            <div className="flex justify-center">
              <div className="flex items-center gap-3 px-8 py-4 bg-muted rounded-2xl">
                <div className="w-4 h-4 rounded-full bg-primary animate-pulse"></div>
                <span className="text-muted-foreground font-medium">
                  {selectedAnswer === currentQuestion.correctAnswer ? 'Great job, Gopher! 🎉' : 'Keep learning! 🐀'}
                </span>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}