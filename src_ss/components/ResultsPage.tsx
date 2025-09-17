import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Trophy, Clock, RotateCcw, Home, BookOpen, CheckCircle2, XCircle } from "lucide-react";
import { quizData, QuizQuestion } from "@/data/quizData";

interface QuizAnswer {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  timeSpent: number;
}

interface QuizResults {
  answers: QuizAnswer[];
  totalTime: number;
  questionsAttempted: number;
  totalQuestions: number;
}

const ResultsPage = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState<QuizResults | null>(null);
  const [wrongAnswers, setWrongAnswers] = useState<Array<{question: QuizQuestion, selectedAnswer: number}>>([]);

  useEffect(() => {
    const resultsData = localStorage.getItem('quizResults');
    if (!resultsData) {
      navigate('/');
      return;
    }

    const parsedResults: QuizResults = JSON.parse(resultsData);
    setResults(parsedResults);

    // Get wrong answers with question details
    const wrongAnswerDetails = parsedResults.answers
      .filter(answer => !answer.isCorrect)
      .map(answer => {
        let question: QuizQuestion | undefined;
        for (const quiz of quizData) {
          question = quiz.questions.find(q => q.id === answer.questionId);
          if (question) break;
        }
        return question ? { question, selectedAnswer: answer.selectedAnswer } : null;
      })
      .filter(Boolean) as Array<{question: QuizQuestion, selectedAnswer: number}>;

    setWrongAnswers(wrongAnswerDetails);
  }, [navigate]);

  const handleRetakeQuiz = () => {
    navigate('/quiz');
  };

  const handleNewQuiz = () => {
    localStorage.removeItem('quizResults');
    navigate('/');
  };

  if (!results) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const correctAnswers = results.answers.filter(a => a.isCorrect).length;
  const percentage = Math.round((correctAnswers / results.answers.length) * 100);
  const averageTime = Math.round(results.totalTime / results.answers.length / 1000);
  
  const getMasteryLevel = (percentage: number) => {
    if (percentage >= 90) return { level: "Expert", color: "bg-success text-success-foreground" };
    if (percentage >= 80) return { level: "Advanced", color: "bg-primary text-primary-foreground" };
    if (percentage >= 70) return { level: "Intermediate", color: "bg-warning text-warning-foreground" };
    if (percentage >= 60) return { level: "Beginner", color: "bg-secondary text-secondary-foreground" };
    return { level: "Needs Practice", color: "bg-error text-error-foreground" };
  };

  const mastery = getMasteryLevel(percentage);

  // Group wrong answers by topic
  const wrongAnswersByTopic = wrongAnswers.reduce((acc, { question }) => {
    const quiz = quizData.find(q => q.questions.some(qu => qu.id === question.id));
    if (quiz) {
      if (!acc[quiz.title]) acc[quiz.title] = [];
      acc[quiz.title].push(question);
    }
    return acc;
  }, {} as Record<string, QuizQuestion[]>);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success/10 rounded-lg">
              <Trophy className="h-8 w-8 text-success" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Quiz Complete!</h1>
              <p className="text-muted-foreground">Here's how you performed</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Score Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Your Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">{percentage}%</div>
                  <p className="text-muted-foreground">Overall Score</p>
                  <Badge className={`mt-2 ${mastery.color}`}>
                    {mastery.level}
                  </Badge>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-semibold text-foreground mb-2">
                    {correctAnswers} / {results.answers.length}
                  </div>
                  <p className="text-muted-foreground">Questions Correct</p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-2xl font-semibold text-foreground mb-2">
                    <Clock className="h-5 w-5" />
                    {Math.floor(results.totalTime / 60000)}:{String(Math.floor((results.totalTime % 60000) / 1000)).padStart(2, '0')}
                  </div>
                  <p className="text-muted-foreground">Total Time</p>
                  <p className="text-xs text-muted-foreground mt-1">~{averageTime}s per question</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Topic Breakdown */}
          {Object.keys(wrongAnswersByTopic).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Areas for Improvement</CardTitle>
                <CardDescription>
                  Topics where you had incorrect answers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(wrongAnswersByTopic).map(([topic, questions]) => (
                    <div key={topic} className="flex items-center justify-between p-3 bg-error-bg rounded-lg border border-error/20">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-error" />
                        <span className="font-medium text-foreground">{topic}</span>
                      </div>
                      <Badge variant="secondary">
                        {questions.length} incorrect
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Wrong Answers Review */}
          {wrongAnswers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Review Incorrect Answers</CardTitle>
                <CardDescription>
                  Study these questions to improve your understanding
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {wrongAnswers.map(({ question, selectedAnswer }, index) => (
                    <div key={question.id} className="space-y-3">
                      <div className="flex items-start gap-2">
                        <XCircle className="h-5 w-5 text-error mt-1" />
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">{question.question}</h4>
                          
                          <div className="mt-3 space-y-2">
                            {question.options.map((option, optionIndex) => (
                              <div 
                                key={optionIndex}
                                className={`p-2 rounded text-sm ${
                                  optionIndex === question.correctAnswer
                                    ? 'bg-success-bg text-success border border-success/20'
                                    : optionIndex === selectedAnswer
                                    ? 'bg-error-bg text-error border border-error/20'
                                    : 'bg-muted text-muted-foreground'
                                }`}
                              >
                                <span className="font-medium">
                                  {String.fromCharCode(65 + optionIndex)}. 
                                </span> {option}
                                {optionIndex === question.correctAnswer && (
                                  <CheckCircle2 className="h-4 w-4 inline ml-2" />
                                )}
                                {optionIndex === selectedAnswer && optionIndex !== question.correctAnswer && (
                                  <XCircle className="h-4 w-4 inline ml-2" />
                                )}
                              </div>
                            ))}
                          </div>

                          {question.explanation && (
                            <div className="mt-3 p-3 bg-muted rounded-lg">
                              <p className="text-sm text-foreground">
                                <strong>Explanation:</strong> {question.explanation}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {index < wrongAnswers.length - 1 && <Separator />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleRetakeQuiz}
                  className="flex-1"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Retake Quiz
                </Button>
                <Button
                  onClick={handleNewQuiz}
                  variant="outline"
                  className="flex-1"
                >
                  <Home className="h-4 w-4 mr-2" />
                  New Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ResultsPage;