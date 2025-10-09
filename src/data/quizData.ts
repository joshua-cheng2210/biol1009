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
    // STEP 1: Fetch the JSON file from your database
    // Use relative path that works with GitHub Pages base path
    const basePath = (import.meta as any).env.BASE_URL || '/';
    const response = await fetch(`${basePath}study_quiz_processed_questions_by_topics_db.json`);
    
    // STEP 2: Parse JSON and type it as JsonQuiz[] (the database format)
    const jsonData: JsonQuiz[] = await response.json();
    
    // STEP 3: Convert from JSON format → React format
    // This .map() is doing the MAIN CONVERSION work!
    return jsonData.map((jsonQuiz, quizIndex) => {
      
      // 🔄 CONVERTING EACH QUIZ from JsonQuiz → Quiz format
      return {
        // Convert quiz properties:
        id: `quiz_${quizIndex}`,              // Generate new string ID (was no ID in JSON)
        title: jsonQuiz.quiz_title,           // Copy title directly (quiz_title → title)
        
        // 🔄 CONVERTING ALL QUESTIONS from JsonQuestion[] → Question[] format
        questions: jsonQuiz.questions.map((jsonQuestion) => {
          
          // 🔍 FIND THE CORRECT ANSWER INDEX
          // JSON has: [{ is_correct: false }, { is_correct: true }, { is_correct: false }]
          // React needs: correctAnswer: 1 (the index number)
          const correctIndex = jsonQuestion.options.findIndex(opt => opt.is_correct);
          
          // 🔍 FIND THE CORRECT OPTION OBJECT (for explanation)
          // We need this to extract the comment from the correct answer
          const correctOption = jsonQuestion.options.find(opt => opt.is_correct);
          
          // 🔄 RETURN CONVERTED QUESTION in React format
          return {
            // Convert question properties:
            id: `q_${jsonQuestion.id}`,       // Convert number ID → string ID (123 → "q_123")
            question: jsonQuestion.question,   // Copy question text directly
            
            // 🔄 CONVERT OPTIONS from complex objects → simple strings
            // JSON has: [{ text: "Answer A", is_correct: false, comment: "..." }, ...]
            // React needs: ["Answer A", "Answer B", "Answer C"]
            options: jsonQuestion.options.map(opt => opt.text.replace(/"/g, '')),
            
            // 🔄 CONVERT CORRECT ANSWER from boolean flags → index number
            // JSON has: multiple { is_correct: true/false } in options array
            // React needs: single number indicating position (0, 1, 2, 3)
            correctAnswer: correctIndex,
            
            // 🔄 EXTRACT EXPLANATION from correct option's comment
            // JSON has: comment nested inside the correct option object
            // React needs: explanation as direct property (or undefined)
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
    correctAnswer: 1,  // ← Index of "Mitochondria" 
    explanation: "Correct! ATP production."  // ← From correct option's comment
  }]
}
*/

// Export a promise that resolves to the quiz data
export const quizDataPromise = loadQuizData();

// For backwards compatibility, export a static array (will be empty initially)
export let quizData: Quiz[] = [];

// Initialize the static array with loaded data
quizDataPromise.then(data => {
  quizData.length = 0;
  quizData.push(...data);
});