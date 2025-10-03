import React, { useState, useEffect } from 'react';
import { ChevronRight, BookOpen, CheckCircle, Leaf, Microscope } from 'lucide-react';
import { quizDataPromise, Quiz } from '../data/quizData';

interface HomePageProps {
  onStartQuiz: (selectedTopics: string[]) => void;
}

export default function HomePage({ onStartQuiz }: HomePageProps) {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [quizData, setQuizData] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    quizDataPromise.then(data => {
      setQuizData(data);
      setLoading(false);
    }).catch(error => {
      console.error('Failed to load quiz data:', error);
      setLoading(false);
    });
  }, []);

  const uniqueTopics = [...new Set(quizData.map(quiz => quiz.title))];

  const toggleTopic = (topic: string) => {
    setSelectedTopics(prev => 
      prev.includes(topic) 
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    );
  };

  const getQuestionCount = (topic: string) => {
    return quizData.find(quiz => quiz.title === topic)?.questions.length || 0;
  };

  const totalQuestions = selectedTopics.reduce((total, topic) => total + getQuestionCount(topic), 0);

  const handleStartQuiz = () => {
    if (selectedTopics.length > 0) {
      onStartQuiz(selectedTopics);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background relative overflow-hidden">
      {/* Background Biology Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Leaf className="absolute top-20 left-10 w-6 h-6 text-accent/20 animate-leaf-float" />
        <Microscope className="absolute top-40 right-20 w-8 h-8 text-nature/20 animate-bounce" />
        <Leaf className="absolute bottom-40 left-20 w-5 h-5 text-accent/15 animate-leaf-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-32 right-32 w-12 h-12 rounded-full bg-accent/10 animate-pulse" />
        <div className="absolute bottom-60 right-40 w-8 h-8 rounded-full bg-secondary/15 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border shadow-card relative">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-gopher rounded-xl shadow-lg animate-gopher-hop">
              <div className="text-2xl">🐹</div>
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold font-academic bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Biology Quiz Master
              </h1>
              <p className="text-muted-foreground text-lg font-medium">
                University of Minnesota • Golden Gopher Biology Learning
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-biology rounded-full text-white font-medium">
              <Microscope className="w-5 h-5" />
              <span>Study Smart</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 relative">
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Leaf className="w-8 h-8 text-accent animate-leaf-float" />
            <h2 className="text-4xl font-bold font-academic text-foreground">
              Choose Your Study Topics
            </h2>
            <Microscope className="w-8 h-8 text-nature animate-bounce" />
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Select the biology topics you want to practice, Gopher! Our smart learning system 
            will help you master difficult concepts through targeted repetition. 
            <span className="text-secondary font-semibold">Ski-U-Mah!</span>
          </p>
        </div>

        {/* Topic Selection Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin text-4xl mb-4">🐹</div>
              <p className="text-lg text-muted-foreground">Loading your biology topics, Gopher...</p>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 animate-slide-up">
            {uniqueTopics.map((topic, index) => {
            const isSelected = selectedTopics.includes(topic);
            const questionCount = getQuestionCount(topic);
            
            return (
              <div
                key={topic}
                className={`
                  relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 group
                  ${isSelected 
                    ? 'border-primary bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 shadow-elegant' 
                    : 'border-border bg-card hover:border-primary/30 hover:shadow-card'
                  }
                  hover:scale-105 transform
                `}
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => toggleTopic(topic)}
              >
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Leaf className="w-4 h-4 text-accent animate-leaf-float" />
                </div>
                
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold font-biology text-foreground mb-2">
                      {topic}
                    </h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Microscope className="w-3 h-3" />
                      {questionCount} question{questionCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className={`
                    w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all
                    ${isSelected 
                      ? 'border-primary bg-primary animate-bounce-in' 
                      : 'border-muted-foreground/30'
                    }
                  `}>
                    {isSelected && <CheckCircle className="w-5 h-5 text-white" />}
                  </div>
                </div>
                
                <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-gradient-biology h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((questionCount / 50) * 100, 100)}%` }}
                  />
                </div>
                
                {/* Gopher paw print decoration for selected topics */}
                {isSelected && (
                  <div className="absolute bottom-2 left-2 text-secondary/30 text-xs">
                    🐾
                  </div>
                )}
              </div>
            );
          })}
          </div>
        )}

        {/* Action Section */}
        <div className="text-center animate-bounce-in">
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-2 flex items-center justify-center gap-2">
              <span className="text-lg">🐹</span>
              {selectedTopics.length} topic{selectedTopics.length !== 1 ? 's' : ''} selected • {totalQuestions} total questions
              <span className="text-lg">🧬</span>
            </p>
            <div className="w-32 h-1.5 bg-gradient-gopher rounded-full mx-auto" />
          </div>
          
          <button
            onClick={handleStartQuiz}
            disabled={selectedTopics.length === 0}
            className={`
              px-12 py-5 rounded-2xl font-bold text-xl flex items-center gap-4 mx-auto group
              transition-all duration-300 transform hover:scale-105 font-biology
              ${selectedTopics.length > 0
                ? 'bg-gradient-to-r from-primary via-secondary to-primary text-white shadow-elegant hover:shadow-glow'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
              }
            `}
          >
            <Microscope className="w-7 h-7 group-hover:animate-bounce" />
            Quiz Me, Gopher!
            <ChevronRight className="w-7 h-7 group-hover:translate-x-1 transition-transform" />
          </button>
          
          {selectedTopics.length === 0 && (
            <p className="text-sm text-muted-foreground mt-4 animate-fade-in flex items-center justify-center gap-2">
              <Leaf className="w-4 h-4 text-accent" />
              Select at least one topic to begin your Gopher biology journey
              <span className="text-secondary">🐾</span>
            </p>
          )}
        </div>
      </main>
    </div>
  );
}