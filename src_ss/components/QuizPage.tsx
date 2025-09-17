import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Clock, CheckCircle2, XCircle } from "lucide-react";
import { quizData, QuizQuestion } from "@/data/quizData";

interface QuizAnswer {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  timeSpent: number;
}

const QuizPage = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [wrongQuestions, setWrongQuestions] = useState<QuizQuestion[]>([]);
  const [questionsAttempted, setQuestionsAttempted] = useState<Set<string>>(new Set());
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());

  useEffect(() => {
    // Get selected topics from localStorage
    const selectedTopics = JSON.parse(localStorage.getItem('selectedTopics') || '[]');
    
    if (selectedTopics.length === 0) {
      navigate('/');
      return;
    }

    // Compile questions from selected topics
    const compiledQuestions: QuizQuestion[] = [];
    selectedTopics.forEach((topicId: string) => {
      const quiz = quizData.find(q => q.id === topicId);
      if (quiz) {
        compiledQuestions.push(...quiz.questions);
      }
    });

    // Randomize question order
    const shuffledQuestions = [...compiledQuestions].sort(() => Math.random() - 0.5);
    setQuestions(shuffledQuestions);
    setQuestionStartTime(Date.now());
  }, [navigate]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (showFeedback) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const timeSpent = Date.now() - questionStartTime;

    const answer: QuizAnswer = {
      questionId: currentQuestion.id,
      selectedAnswer,
      isCorrect,
      timeSpent
    };

    setAnswers(prev => [...prev, answer]);
    setQuestionsAttempted(prev => new Set([...prev, currentQuestion.id]));
    setShowFeedback(true);

    // If wrong, add to wrong questions queue (but not if already attempted this question)
    if (!isCorrect && !wrongQuestions.some(q => q.id === currentQuestion.id)) {
      setWrongQuestions(prev => [...prev, currentQuestion]);
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setShowFeedback(false);
    setQuestionStartTime(Date.now());

    // Move to next question or add wrong questions to the end
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else if (wrongQuestions.length > 0) {
      // Add wrong questions back to the queue
      const nextWrongQuestion = wrongQuestions[0];
      setWrongQuestions(prev => prev.slice(1));
      setQuestions(prev => [...prev, nextWrongQuestion]);
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Quiz complete
      handleCompleteQuiz();
    }
  };

  const handleCompleteQuiz = () => {
    const quizResults = {
      answers,
      totalTime: Date.now() - startTime,
      questionsAttempted: questionsAttempted.size,
      totalQuestions: questions.length
    };
    
    localStorage.setItem('quizResults', JSON.stringify(quizResults));
    navigate('/results');
  };

  const handleBackToFilter = () => {
    navigate('/');
  };

  if (questions.length === 0) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((questionsAttempted.size) / questions.length) * 100;
  const isAnswered = selectedAnswer !== null;
  const isCorrect = showFeedback && selectedAnswer === currentQuestion.correctAnswer;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleBackToFilter}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Filter
            </Button>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Question</p>
              <p className="font-semibold">{currentQuestionIndex + 1} of {questions.length}</p>
            </div>

            <Button
              variant="outline"
              onClick={handleCompleteQuiz}
            >
              Done
            </Button>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {questionsAttempted.size} questions completed
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              {/* Question */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-foreground leading-relaxed">
                  {currentQuestion.question}
                </h2>

                {/* Answer Options */}
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => {
                    let buttonClass = "w-full p-4 text-left border rounded-lg transition-all duration-200 ";
                    
                    if (showFeedback) {
                      if (index === currentQuestion.correctAnswer) {
                        buttonClass += "border-success bg-success-bg text-success";
                      } else if (index === selectedAnswer && index !== currentQuestion.correctAnswer) {
                        buttonClass += "border-error bg-error-bg text-error";
                      } else {
                        buttonClass += "border-border bg-muted/50 text-muted-foreground";
                      }
                    } else {
                      if (selectedAnswer === index) {
                        buttonClass += "border-primary bg-primary/10 text-primary";
                      } else {
                        buttonClass += "border-border hover:border-primary/50 hover:bg-primary/5";
                      }
                    }

                    return (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        disabled={showFeedback}
                        className={buttonClass}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span>{option}</span>
                          {showFeedback && index === currentQuestion.correctAnswer && (
                            <CheckCircle2 className="h-5 w-5 text-success ml-auto" />
                          )}
                          {showFeedback && index === selectedAnswer && index !== currentQuestion.correctAnswer && (
                            <XCircle className="h-5 w-5 text-error ml-auto" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Feedback */}
                {showFeedback && currentQuestion.explanation && (
                  <div className={`p-4 rounded-lg ${isCorrect ? 'bg-success-bg border border-success' : 'bg-error-bg border border-error'}`}>
                    <div className="flex items-start gap-2">
                      {isCorrect ? (
                        <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
                      ) : (
                        <XCircle className="h-5 w-5 text-error mt-0.5" />
                      )}
                      <div>
                        <p className={`font-semibold ${isCorrect ? 'text-success' : 'text-error'}`}>
                          {isCorrect ? 'Correct!' : 'Incorrect'}
                        </p>
                        <p className="text-sm text-foreground mt-1">
                          {currentQuestion.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {!showFeedback ? (
                    <Button
                      onClick={handleSubmitAnswer}
                      disabled={!isAnswered}
                      className="flex-1"
                    >
                      Submit Answer
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNextQuestion}
                      className="flex-1"
                    >
                      {currentQuestionIndex < questions.length - 1 || wrongQuestions.length > 0 ? 'Next Question' : 'Complete Quiz'}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default QuizPage;