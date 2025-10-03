export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
}

// Interface for the JSON data structure
interface JsonQuestion {
  question: string;
  question_image_url: string;
  unique: boolean;
  id: number;
  options: {
    text: string;
    is_correct: boolean;
    comment: string | null;
  }[];
  neutral_comments: string | null;
}

interface JsonQuiz {
  quiz_title: string;
  questions: JsonQuestion[];
  unique_questions?: number;
}

// Function to load and convert JSON data
async function loadQuizData(): Promise<Quiz[]> {
  try {
    const response = await fetch('/study_quiz_processed_questions_by_topics_db.json');
    const jsonData: JsonQuiz[] = await response.json();
    
    return jsonData.map((jsonQuiz, quizIndex) => ({
      id: `quiz_${quizIndex}`,
      title: jsonQuiz.quiz_title,
      questions: jsonQuiz.questions.map((jsonQuestion) => {
        const correctIndex = jsonQuestion.options.findIndex(opt => opt.is_correct);
        const correctOption = jsonQuestion.options.find(opt => opt.is_correct);
        
        return {
          id: `q_${jsonQuestion.id}`,
          question: jsonQuestion.question,
          options: jsonQuestion.options.map(opt => opt.text.replace(/"/g, '')),
          correctAnswer: correctIndex,
          explanation: correctOption?.comment || undefined
        };
      })
    }));
  } catch (error) {
    console.error('Failed to load quiz data:', error);
    return [];
  }
}

// Export a promise that resolves to the quiz data
export const quizDataPromise = loadQuizData();

// For backwards compatibility, export a static array (will be empty initially)
export let quizData: Quiz[] = [];

// Initialize the static array with loaded data
quizDataPromise.then(data => {
  quizData.length = 0;
  quizData.push(...data);
});