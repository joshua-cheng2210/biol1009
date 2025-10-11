export interface Question {
  id: string;
  question: string;
  rawHtmlQuestion?: string;
  questionImageUrl?: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
}

interface JsonQuestion {
  question: string;
  raw_html_question?: string;
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

async function loadQuizData(): Promise<Quiz[]> {
  try {
    const basePath = (import.meta as any).env.BASE_URL || '/';
    const response = await fetch(`${basePath}study_quiz_processed_questions_by_topics_db.json`);
    const jsonData: JsonQuiz[] = await response.json();
    
    return jsonData.map((jsonQuiz, quizIndex) => {
      return {
        
        id: `quiz_${quizIndex}`,              
        title: jsonQuiz.quiz_title,           
        questions: jsonQuiz.questions.map((jsonQuestion) => {
          const correctIndex = jsonQuestion.options.findIndex(opt => opt.is_correct);
          const correctOption = jsonQuestion.options.find(opt => opt.is_correct);
          return {
            id: `q_${jsonQuestion.id}`,       
            question: jsonQuestion.question,
            rawHtmlQuestion: jsonQuestion.raw_html_question,
            questionImageUrl: jsonQuestion.question_image_url,
            options: jsonQuestion.options.map(opt => opt.text.replace(/"/g, '')),
            correctAnswer: correctIndex,
            explanation: correctOption?.comment || undefined
          };
        })
      };
    });
  } catch (error) {
    console.error('Failed to load quiz data:', error);
    return [];
  }
}

/* 
📝 CONVERSION EXAMPLE:

INPUT (JSON format from your database):
{
  "quiz_title": "SQ topic 1 level 1a (Chapter 1)",
  "questions": [{
    "question": "What is the powerhouse of the cell?",
    "id": 123,
    "options": [
      { "text": "Nucleus", "is_correct": false, "comment": null },
      { "text": "Mitochondria", "is_correct": true, "comment": "Correct! ATP production." },
      { "text": "Ribosome", "is_correct": false, "comment": null }
    ]
  }]
}

⬇️ CONVERSION PROCESS ⬇️

OUTPUT (React format for your components):
{
  id: "quiz_0",
  title: "SQ topic 1 level 1a (Chapter 1)",
  questions: [{
    id: "q_123",
    question: "What is the powerhouse of the cell?",
    options: ["Nucleus", "Mitochondria", "Ribosome"],
    correctAnswer: 1,  
    explanation: "Correct! ATP production."  
  }]
}
*/


export const quizDataPromise = loadQuizData();


export let quizData: Quiz[] = [];


quizDataPromise.then(data => {
  quizData.length = 0;
  quizData.push(...data);
});