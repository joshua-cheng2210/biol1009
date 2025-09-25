let subjects = {
    biology: {
        title: 'BIOL1009',
        quizzes: {},   // quizKey → array of questions
        flashcards: {} // quizKey → array of flashcards
    }
};

let currentSubject = subjects.biology;
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

            subjects.biology.quizzes[quizKey] = quizQuestions;

            // Create quiz card in dashboard
            const list = document.getElementById('quizzes-list');
            const card = document.createElement('div');
            card.className = 'quiz-card';
            card.innerHTML = `
                <h3>${quiz.quiz_title || `Quiz ${quizIndex + 1}`}</h3>
                
            `;
            card.onclick = () => openQuiz(quizKey);
            list.appendChild(card);
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
    document.getElementById('dashboard-title').textContent = `${currentSubject.title} Dashboard`;
}
function goBackToDashboard() {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    document.getElementById('dashboard').style.display = 'block';
}


// -------------------- QUIZZES --------------------
function openQuiz(quizKey) {
    currentQuizKey = quizKey;
    currentQuizIndex = 0;
    quizScore = 0;
    showPage('quiz-page');
    updateQuiz();
}

function updateQuiz() {
    const quiz = subjects.biology.quizzes[currentQuizKey];
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

    document.getElementById('nextBtn').textContent =
        currentQuizIndex === quiz.length - 1 ? "Finish" : "Next";
}

function selectAnswer(i) {
    const quiz = subjects.biology.quizzes[currentQuizKey];
    const current = quiz[currentQuizIndex];

    // disable further clicks
    document.querySelectorAll('.quiz-option').forEach((opt, idx) => {
        opt.onclick = null;
        if (idx === current.correct) {
            opt.classList.add('correct'); // ✅ highlight correct
        }
        if (idx === i && idx !== current.correct) {
            opt.classList.add('incorrect'); // ❌ wrong choice
        }
    });

    // save user’s choice
    selectedAnswer = i;
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
document.addEventListener('DOMContentLoaded', loadBiologyData);