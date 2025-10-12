import React, { useEffect, useState } from 'react';
import { RotateCcw, Home, Trophy, Target, Microscope, Leaf, Beaker } from 'lucide-react';
import { Question, quizData } from '../data/quizData';
import ProfileCard from './ProfileCard';

interface ResultsPageProps {
  answers: { [key: string]: number };
  wrongAnswers: Question[];
  selectedTopics: string[];
  onRetakeQuiz: () => void;
  onNewQuiz: () => void;
}

export default function ResultsPage({
  answers,
  wrongAnswers,
  selectedTopics,
  onRetakeQuiz,
  onNewQuiz
}: ResultsPageProps) {
  const totalQuestions = Object.keys(answers).length;
  const correctAnswers = totalQuestions - wrongAnswers.length;
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);
  const [developers, setDevelopers] = useState<Array<{ name: string; image?: string; linkedin?: string; github?: string }>>([]);
  const [projectRepo, setProjectRepo] = useState<string | undefined>(undefined);

  // Save progress to localStorage when component loads
  useEffect(() => {
    saveQuizProgress();
  }, [answers, selectedTopics]);

  // Load developers list (public/developers.json)
  fetch(`${(import.meta as any).env.BASE_URL || '/'}developers.json`)
    .then(res => res.json())
    .then((data) => {
      if (data) {
        // capture project repo (may be under 'project repo' or 'projectRepo')
        const repo = data['project repo'] || data.projectRepo || data['project_repo'];
        if (repo) setProjectRepo(repo);

        if (Array.isArray(data.developers)) {
          // Map to normalized shape (image paths in public/ should be referenced without the leading 'public/')
          const mapped = data.developers.map((d: any) => ({
            name: d.name,
            image: d['profile img'] ? d['profile img'].replace(/^public\//, '') : undefined,
            linkedin: d.linkedin,
            github: d.github
          }));

          // Ensure Joshua Cheng is first (stable reordering)
          const idx = mapped.findIndex((m: any) => m.name === 'Joshua Cheng');
          if (idx > 0) {
            const [josh] = mapped.splice(idx, 1);
            mapped.unshift(josh);
          }

          setDevelopers(mapped);
        }
      }
    })
    .catch(err => console.warn('Failed to load developers.json', err));


  const saveQuizProgress = () => {
    try {
      const savedProgress = localStorage.getItem('biologyQuizProgress');
      const currentProgress = savedProgress ? JSON.parse(savedProgress) : {};

      // Update progress for each topic
      selectedTopics.forEach(topicTitle => {
        const quiz = quizData.find(q => q.title === topicTitle);
        if (quiz) {
          if (!currentProgress[quiz.id]) {
            currentProgress[quiz.id] = {};
          }

          // Mark correct answers
          quiz.questions.forEach(question => {
            if (answers[question.id] === question.correctAnswer) {
              currentProgress[quiz.id][question.id] = true;
            }
          });
        }
      });

      localStorage.setItem('biologyQuizProgress', JSON.stringify(currentProgress));
    } catch (error) {
      console.error('Failed to save quiz progress:', error);
    }
  };

  const getMasteryLevel = (percentage: number) => {
    if (percentage >= 90) return { level: 'Gopher Genius! 🏆', color: 'text-accent', bg: 'bg-accent/10' };
    if (percentage >= 80) return { level: 'Biology Expert 🔬', color: 'text-secondary', bg: 'bg-secondary/10' };
    if (percentage >= 70) return { level: 'Science Scholar 📚', color: 'text-primary', bg: 'bg-primary/10' };
    if (percentage >= 60) return { level: 'Learning Gopher 🐀', color: 'text-nature', bg: 'bg-nature/10' };
    return { level: 'Keep Studying! 💪', color: 'text-muted-foreground', bg: 'bg-muted' };
  };

  const mastery = getMasteryLevel(percentage);

  const getTopicBreakdown = () => {
    const breakdown: { [topic: string]: { correct: number; total: number } } = {};

    selectedTopics.forEach(topic => {
      const quiz = quizData.find(q => q.title === topic);
      if (quiz) {
        breakdown[topic] = { correct: 0, total: quiz.questions.length };

        quiz.questions.forEach(question => {
          if (answers[question.id] === question.correctAnswer) {
            breakdown[topic].correct++;
          }
        });
      }
    });

    return breakdown;
  };

  const topicBreakdown = getTopicBreakdown();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background relative overflow-hidden">
      {/* Background Biology Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Trophy className="absolute top-20 left-20 w-8 h-8 text-secondary/20 animate-bounce" />
        <Leaf className="absolute top-40 right-16 w-6 h-6 text-accent/15 animate-leaf-float" />
        <Microscope className="absolute bottom-40 left-24 w-7 h-7 text-nature/20 animate-pulse" />
        <Beaker className="absolute bottom-20 right-32 w-6 h-6 text-primary/20 animate-bounce" style={{ animationDelay: '1s' }} />
        <div className="absolute top-60 right-40 w-12 h-12 rounded-full bg-accent/10 animate-pulse" />
      </div>

      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border shadow-card">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-gopher rounded-xl shadow-lg animate-gopher-hop">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-academic bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Quiz Complete, Gopher! 🎉
              </h1>
              <p className="text-muted-foreground text-lg">
                University of Minnesota Biology Results
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Score Summary */}
        <div className="bg-card rounded-3xl shadow-elegant border border-border p-8 mb-8 animate-fade-in relative">
          <div className="absolute top-4 right-4 text-3xl animate-bounce">
            🐀
          </div>

          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Target className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold font-academic text-foreground">
                Your Results
              </h2>
              <Microscope className="w-8 h-8 text-nature" />
            </div>

            <div className="mb-6">
              <div className="text-6xl font-bold bg-gradient-gopher bg-clip-text text-transparent mb-2">
                {percentage}%
              </div>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium ${mastery.bg} ${mastery.color}`}>
                <span>{mastery.level}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">{correctAnswers}</div>
                <div className="text-sm text-muted-foreground">Correct</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{totalQuestions}</div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">{wrongAnswers.length}</div>
                <div className="text-sm text-muted-foreground">To Review</div>
              </div>
            </div>
          </div>
        </div>

        {/* Topic Breakdown */}
        <div className="bg-card rounded-3xl shadow-elegant border border-border p-8 mb-8 animate-slide-up">
          <div className="flex items-center gap-3 mb-6">
            <Beaker className="w-6 h-6 text-nature" />
            <h3 className="text-2xl font-bold font-academic text-foreground">
              Topic Performance
            </h3>
          </div>

          <div className="space-y-4">
            {Object.entries(topicBreakdown).map(([topic, stats]) => {
              const topicPercentage = Math.round((stats.correct / stats.total) * 100);

              return (
                <div key={topic} className="p-4 rounded-xl bg-gradient-to-r from-muted/50 to-muted/30 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-foreground flex items-center gap-2">
                      <Leaf className="w-4 h-4 text-accent" />
                      {topic}
                    </h4>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {stats.correct}/{stats.total}
                      </span>
                      <span className="font-bold text-primary">
                        {topicPercentage}%
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-biology h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${topicPercentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Wrong Answers Section */}
        {wrongAnswers.length > 0 && (
          <div className="bg-card rounded-3xl shadow-elegant border border-border p-8 mb-8 animate-bounce-in">
            <div className="flex items-center gap-3 mb-6">
              <Microscope className="w-6 h-6 text-secondary" />
              <h3 className="text-2xl font-bold font-academic text-foreground">
                Questions to Review
              </h3>
              <span className="text-sm bg-secondary/20 text-secondary px-3 py-1 rounded-full font-medium">
                {wrongAnswers.length} question{wrongAnswers.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="space-y-6">
              {wrongAnswers.map((question, index) => (
                <div key={question.id} className="p-6 rounded-xl bg-gradient-to-r from-red-50/50 to-orange-50/50 border border-red-200/50">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <h4 className="font-semibold text-foreground flex-1">
                      {question.question}
                    </h4>
                  </div>

                  <div className="ml-9">
                    <div className="mb-2">
                      <span className="text-sm font-medium text-accent">Correct Answer: </span>
                      <span className="text-foreground">
                        {String.fromCharCode(65 + question.correctAnswer)}) {question.options[question.correctAnswer]}
                      </span>
                    </div>

                    {question.explanation && (
                      <div className="mt-3 p-3 bg-white/50 rounded-lg">
                        <div className="flex items-start gap-2">
                          <Leaf className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {question.explanation}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
          <button
            onClick={onRetakeQuiz}
            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl font-bold text-lg hover:shadow-glow transition-all transform hover:scale-105"
          >
            <RotateCcw className="w-6 h-6" />
            Retake Quiz
          </button>

          <button
            onClick={onNewQuiz}
            className="flex items-center gap-3 px-8 py-4 bg-gradient-nature text-white rounded-2xl font-bold text-lg hover:shadow-elegant transition-all transform hover:scale-105"
          >
            <Home className="w-6 h-6" />
            New Quiz Topics
          </button>
        </div>

        {/* Motivational Message */}
        <div className="text-center mt-8 animate-fade-in">
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {percentage >= 80
              ? "Outstanding work, Gopher! Your dedication to biology is truly impressive. Keep up the excellent studying! 🌟"
              : percentage >= 60
                ? "Good effort, Gopher! You're making solid progress. Review the missed questions and try again! 📚"
                : "Don't give up, Gopher! Every expert was once a beginner. Keep practicing and you'll master these concepts! 💪"
            }
          </p>
          <div className="mt-4 text-2xl">
            <span className="text-secondary font-bold">Ski-U-Mah!</span> 🐀🏆
          </div>
        </div>

        {developers.length > 0 && (
          <div className="w-full flex justify-center">
            <div className="max-w-3xl w-full px-6 py-12 border-t border-border mt-6 text-center">
              <h2 className="mb-8 text-4xl font-bold font-academic text-foreground">Developers</h2>
              <div className="flex items-center justify-center gap-6 flex-wrap">
                {developers.map(dev => (
                  <ProfileCard
                    key={dev.name}
                    name={dev.name}
                    image={dev.image || 'img/profile.jpg'}
                    linkedin={dev.linkedin}
                    github={dev.github}
                    large
                  />
                ))}
              </div>
              {projectRepo && (
                <div className="mt-6 flex justify-center">
                  <a
                    className="inline-block px-6 py-3 rounded-2xl bg-nature text-white font-semibold hover:opacity-95 shadow-elegant"
                    href={projectRepo}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Contribute on our GitHub
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        <hr className="border-t border-border my-8" />
        <div className="mt-8 flex flex-col items-center gap-3">
          <p className="text-sm text-muted-foreground">If you'd like to <b>support the project</b> or <b>buy us a coffee</b>, scan the Venmo QR or open the profile:</p>

          <img
            src={`${(import.meta as any).env.BASE_URL || '/'}img/venmo-qr.png`}
            alt="Venmo QR code to support the BIOL 1009 quiz project"
            className="w-40 h-40 object-contain rounded-lg shadow-sm"
            loading="lazy"
          />

          <a
            href="https://venmo.com/JOSHUA2210"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 text-sm text-primary hover:underline"
          >
            Open Venmo profile
          </a>
        </div>

      </main>
    </div>
  );
}