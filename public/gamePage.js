const API_URL = "https://studyquest-api-69lh.onrender.com"

const questionImage = document.querySelector("#question-image")
const questionText = document.querySelector("#question-text")
const questionForm = document.querySelector("#answer-form")
const answerInput = document.querySelector("#answer-input")
const correctCard = document.querySelector("#correct-card")
const funFact = document.querySelector("#fun-fact")
const nextButton = document.querySelector("#next-btn")
const feedback = document.querySelector("#feedback")

// const feedback = document.createElement("p");
// feedback.setAttribute("role", "status");
// form.after(feedback);

// const funFact = document.createElement("p");
// feedback.after(funFact);

// const nextButton = document.createElement("button");
// nextButton.type = "button";
// nextButton.textContent = "Next question";
// nextButton.hidden = true;
// funFact.after(nextButton);

let questions = []
let questionNumber = 0

// fetches the API data
async function startQuiz() {
    try {
        const response = await fetch(`${API_URL}/game/ww2`)
        if(!response.ok) throw new Error(`Request failed: ${response.status}`)
        questions = await response.json()

        // Checks if there are questions in the data
        if(questions.length === 0) {
            questionText.textContent = "No questions found."
            questionForm.hidden = true
            return;
        }
        showQuestions()

    } catch(err) {  
        questionText.textContent = "Couldn't load quiz. Please try again."
        console.log(err);
    }
}

// Display the questions and play the quiz

function showQuestions() {
    const question = questions[questionNumber] // index through the questions array using the question number as an index

    // If there are no questions remaining then the game is quiz over.
    if(!question) {
        questionText.textContent = "Quiz Complete"
        questionImage.hidden = true;
        questionForm.hidden = true;
        nextButton.hidden = true;
        feedback.textContent = "Well done. You answered all the questions."
        funFact.textContent = ""
        return
    }

    questionText.textContent = `${questionNumber + 1}. ${question.question}`
    questionImage = new URL(question.image_url, API_URL).href; // Creates a new URL using the API address for the image
    // questionImage.hidden = !question.image_url // No image is displayed if there is no image url

    // Resets all the quiz controls after each question
    answerInput.value = ""
    answerInput.disabled = false
    questionForm.hidden = false
    feedback.textContent = ""
    funFact.hidden = true
    correctCard.hidden = true
    nextButton.hidden = true
}


questionForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const question = questions[questionNumber]
    const validAnswers = [question.answer, ...(question.alt_answers)].map((answer) => answer.trim().toLowerCase())
    const answer = answerInput.value.trim().toLowerCase()

    if (!validAnswers.includes(answer)) {
        feedback.textContent = "Not quite. Try again!";
        return;
    }

    feedback.textContent = "Correct";
    funFact.textContent = `Fun fact: ${question.fun_fact}`
    questionForm.hidden = true;
    funFact.hidden = false;
    answerInput.disabled = true;
    correctCard.hidden = false;
    nextButton.hidden = false;
    });

    nextButton.addEventListener("click", () => {
        questionNumber = questionNumber + 1
        showQuestion()
        answerInput.focus() // Puts the cursor in the answer box without having to click it. 

    })

    startQuiz()