import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Brain, Play } from "lucide-react";
import { quizData } from "@/data/quizData";

const HomePage = () => {
  const navigate = useNavigate();
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  const handleTopicToggle = (topicId: string) => {
    setSelectedTopics(prev => 
      prev.includes(topicId) 
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };

  const handleStartQuiz = () => {
    if (selectedTopics.length === 0) return;
    
    // Store selected topics in localStorage for the quiz
    localStorage.setItem('selectedTopics', JSON.stringify(selectedTopics));
    navigate('/quiz');
  };

  const totalQuestions = selectedTopics.reduce((total, topicId) => {
    const quiz = quizData.find(q => q.id === topicId);
    return total + (quiz?.questions.length || 0);
  }, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Brain className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Biology Quiz Master</h1>
              <p className="text-muted-foreground">Test your knowledge and master biology concepts</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Topic Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Select Topics
              </CardTitle>
              <CardDescription>
                Choose one or more topics to include in your quiz session
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quizData.map((quiz) => (
                  <div
                    key={quiz.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:border-primary/50 ${
                      selectedTopics.includes(quiz.id) 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border'
                    }`}
                    onClick={() => handleTopicToggle(quiz.id)}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox 
                        checked={selectedTopics.includes(quiz.id)}
                        onChange={() => handleTopicToggle(quiz.id)}
                      />
                      <div className="flex-1 space-y-2">
                        <h3 className="font-semibold text-foreground">{quiz.title}</h3>
                        <p className="text-sm text-muted-foreground">{quiz.description}</p>
                        <Badge variant="secondary">
                          {quiz.questions.length} questions
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quiz Summary */}
          {selectedTopics.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">Quiz Summary</h3>
                    <p className="text-muted-foreground">
                      {selectedTopics.length} topic{selectedTopics.length > 1 ? 's' : ''} selected • {totalQuestions} questions total
                    </p>
                  </div>
                  <Button 
                    onClick={handleStartQuiz}
                    size="lg"
                    className="bg-primary hover:bg-primary-dark transition-colors"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Quiz Me!
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold mt-0.5">
                  1
                </div>
                <p className="text-muted-foreground">Select the topics you want to study</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold mt-0.5">
                  2
                </div>
                <p className="text-muted-foreground">Answer questions one by one with immediate feedback</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold mt-0.5">
                  3
                </div>
                <p className="text-muted-foreground">Incorrect answers will be asked again to reinforce learning</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold mt-0.5">
                  4
                </div>
                <p className="text-muted-foreground">Review your results and track your progress</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default HomePage;