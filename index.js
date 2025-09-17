let subjects = {
        biology: {
            title: 'BIOL1009',
            quizzes: {},   // quizKey → array of questions
            flashcards: {} // quizKey → array of flashcards
        }
    };

let currentSubject = null;
let currentQuizKey = null;
let currentCardIndex = 0;
let currentQuizIndex = 0;
let quizScore = 0;
let selectedAnswer = null;

// -------------------- DATA LOADING --------------------
async function loadBiologyData() {
    try {
        const response = await fetch('study_quiz_processed_questions_db.json');
        const data = await response.json();

        data.forEach((quiz, quizIndex) => {
            const quizKey = `quiz_${quizIndex}`;

            // Questions
            const quizQuestions = quiz.questions.map(q => {
                const options = q.options.map(opt => opt.text.replace(/"/g, ''));
                const correctIndex = q.options.findIndex(opt => opt.is_correct);
                return { question: q.question, options, correct: correctIndex };
            });

            // Flashcards
            // const flashcards = quiz.questions.map(q => {
            //     const correct = q.options.find(opt => opt.is_correct);
            //     return { question: q.question, answer: correct?.text || "No answer" };
            // });

            subjects.biology.quizzes[quizKey] = quizQuestions;
            // subjects.biology.flashcards[quizKey] = flashcards;
        });

        console.log("Biology data loaded:", subjects.biology);
    } catch (err) {
        console.error("Error loading data:", err);
    }
}

// -------------------- NAVIGATION --------------------
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    document.getElementById(pageId).style.display = 'block';
}

function showDashboard(subjectKey) {
    currentSubject = subjects[subjectKey];
    showPage('dashboard');
    document.getElementById('dashboard-title').textContent = `BIOL 1009: General Biology`;
}
function goBackToDashboard() {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    document.getElementById('dashboard').style.display = 'block';
}

// function openFlashcardsList() {
//     showPage('flashcards-list-page');
//     const list = document.getElementById('flashcards-list');
//     list.innerHTML = '';
//     Object.keys(currentSubject.flashcards).forEach(key => {
//         const card = document.createElement('div');
//         card.className = 'quiz-card';
//         card.textContent = `Flashcards - ${key}`;
//         card.onclick = () => openFlashcards(key);
//         list.appendChild(card);
//     });
// }

function openQuizzesList() {
    showPage('quizzes-list-page');
    const list = document.getElementById('quizzes-list');
    list.innerHTML = '';
    Object.keys(currentSubject.quizzes).forEach(key => {
        const card = document.createElement('div');
        card.className = 'quiz-card';
        card.textContent = `Quiz - ${key}`;
        card.onclick = () => openQuiz(key);
        list.appendChild(card);
    });
}
function goBackToQuizzesList() {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    document.getElementById('quizzes-list-page').style.display = 'block';
}
// function goBackToFlashcardsList() {
//     document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
//     document.getElementById('flashcards-list-page').style.display = 'block';
// }

// -------------------- FLASHCARDS --------------------
// function openFlashcards(quizKey) {
//     currentQuizKey = quizKey;
//     currentCardIndex = 0;
//     showPage('flashcards-page');
//     updateFlashcard();
// }

// function updateFlashcard() {
//     const cards = currentSubject.flashcards[currentQuizKey];
//     if (!cards) return;
//     const card = cards[currentCardIndex];

//     document.getElementById('flashcard-question').textContent = card.question;
//     document.getElementById('flashcard-answer').textContent = card.answer;
//     document.getElementById('cardCounter').textContent = `${currentCardIndex + 1} / ${cards.length}`;
// }

// function nextCard() {
//     const cards = currentSubject.flashcards[currentQuizKey];
//     if (currentCardIndex < cards.length - 1) {
//         currentCardIndex++;
//         updateFlashcard();
//     }
// }
// function previousCard() {
//     if (currentCardIndex > 0) {
//         currentCardIndex--;
//         updateFlashcard();
//     }
// }
// // Flip the current flashcard
// function flipCard() {
//     document.getElementById('currentFlashcard').classList.toggle('flipped');
// }

// -------------------- QUIZZES --------------------
function openQuiz(quizKey) {
    currentQuizKey = quizKey;
    currentQuizIndex = 0;
    quizScore = 0;
    showPage('quiz-page');
    updateQuiz();
}

function updateQuiz() {
    const quiz = currentSubject.quizzes[currentQuizKey];
    const q = quiz[currentQuizIndex];
    document.getElementById('question-text').textContent = q.question;

    const options = document.getElementById('quiz-options');
    options.innerHTML = '';
    q.options.forEach((opt, i) => {
        const div = document.createElement('div');
        div.className = 'quiz-option';
        div.textContent = opt;
        div.onclick = () => selectAnswer(i);
        options.appendChild(div);
    });

    document.getElementById('nextQuestionBtn').textContent =
        currentQuizIndex === quiz.length - 1 ? "Finish" : "Next";
}

function selectAnswer(i) {
    selectedAnswer = i;
    document.querySelectorAll('.quiz-option').forEach((opt, idx) => {
        opt.classList.toggle('selected', idx === i);
    });
}

function nextQuestion() {
    if (selectedAnswer === null) return alert("Pick an answer!");
    const quiz = currentSubject.quizzes[currentQuizKey];
    const current = quiz[currentQuizIndex];
    if (selectedAnswer === current.correct) quizScore++;
    currentQuizIndex++;
    if (currentQuizIndex >= quiz.length) finishQuiz();
    else {
        selectedAnswer = null;
        updateQuiz();
    }
}

function finishQuiz() {
    showPage('quiz-results');
    const quiz = currentSubject.quizzes[currentQuizKey];
    const percent = Math.round((quizScore / quiz.length) * 100);
    document.getElementById('final-score').textContent = percent + "%";
    document.getElementById('score-text').textContent = `${quizScore} of ${quiz.length}`;
}

// -------------------- INIT --------------------
document.addEventListener('DOMContentLoaded', () => {
    loadBiologyData();
    showDashboard('biology')
});