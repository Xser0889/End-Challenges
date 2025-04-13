document.addEventListener('DOMContentLoaded', function() {
    // Game elements
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const resultScreen = document.getElementById('result-screen');
    const startButton = document.getElementById('start-button');
    const submitButton = document.getElementById('submit-answer');
    const skipButton = document.getElementById('skip-button');
    const retryButton = document.getElementById('retry-button');
    const questionText = document.getElementById('question-text');
    const answerInput = document.getElementById('answer-input');
    const progressContainer = document.getElementById('progress-container');
    const scoreValue = document.getElementById('score-value');
    const resultMessage = document.getElementById('result-message');
    const feedbackElement = document.getElementById('feedback');
    const badgeAwardOverlay = document.getElementById('badgeAwardOverlay');
    const continueBtn = document.getElementById('continueBtn');
    const winMessage = document.getElementById('winMessage');
    const playAgainButton = document.getElementById('playAgain');
    
    // Game state
    let currentQuestionIndex = 0;
    let questions = [];
    let answers = [];
    
    // Initialize progress indicators
    function initializeProgress() {
        progressContainer.innerHTML = '';
        for (let i = 0; i < 15; i++) {
            const progressItem = document.createElement('div');
            progressItem.className = 'progress-item';
            progressItem.textContent = i + 1;
            progressContainer.appendChild(progressItem);
        }
    }
    
    // Generate questions
    function generateQuestions() {
        const additionQuestions = [];
        const subtractionQuestions = [];
        const multiplicationQuestions = [];
        const additionAnswers = [];
        const subtractionAnswers = [];
        const multiplicationAnswers = [];
        
        // Generate 5 addition problems with varied number ranges
        for (let i = 0; i < 5; i++) {
            let num1, num2;
            // More variety in number ranges
            const complexity = Math.floor(Math.random() * 3);
            if (complexity === 0) {
                // Simple numbers (2 digits)
                num1 = Math.floor(Math.random() * 90) + 10;
                num2 = Math.floor(Math.random() * 90) + 10;
            } else if (complexity === 1) {
                // Medium numbers (3 digits)
                num1 = Math.floor(Math.random() * 900) + 100;
                num2 = Math.floor(Math.random() * 900) + 100;
            } else {
                // Large numbers (4 digits)
                num1 = Math.floor(Math.random() * 9000) + 1000;
                num2 = Math.floor(Math.random() * 9000) + 1000;
            }
            additionQuestions.push(`${num1} + ${num2} = ?`);
            additionAnswers.push(num1 + num2);
        }
        
        // Generate 5 subtraction problems with varied number ranges
        for (let i = 0; i < 5; i++) {
            let num1, num2;
            // More variety in number ranges
            const complexity = Math.floor(Math.random() * 3);
            if (complexity === 0) {
                // Simple numbers (2 digits)
                num1 = Math.floor(Math.random() * 90) + 10;
                num2 = Math.floor(Math.random() * (num1 - 1)) + 1;
            } else if (complexity === 1) {
                // Medium numbers (3 digits)
                num1 = Math.floor(Math.random() * 900) + 100;
                num2 = Math.floor(Math.random() * (num1 - 10)) + 10;
            } else {
                // Large numbers but still 3 digits
                num1 = Math.floor(Math.random() * 500) + 500;
                num2 = Math.floor(Math.random() * 400) + 100;
            }
            subtractionQuestions.push(`${num1} - ${num2} = ?`);
            subtractionAnswers.push(num1 - num2);
        }
        
        // Generate 5 multiplication problems with varied number ranges (going beyond 12)
        for (let i = 0; i < 5; i++) {
            let num1, num2;
            // Ensure both numbers are between 1 and 12
            num1 = Math.floor(Math.random() * 12) + 1; // 1 to 12
            num2 = Math.floor(Math.random() * 12) + 1; // 1 to 12

            multiplicationQuestions.push(`${num1} × ${num2} = ?`);
            multiplicationAnswers.push(num1 * num2);
        }
        
        // Create combined array of all the questions and answers
        const allQuestions = [
            ...additionQuestions.map((q, i) => ({ question: q, answer: additionAnswers[i], type: 'addition' })),
            ...subtractionQuestions.map((q, i) => ({ question: q, answer: subtractionAnswers[i], type: 'subtraction' })),
            ...multiplicationQuestions.map((q, i) => ({ question: q, answer: multiplicationAnswers[i], type: 'multiplication' }))
        ];
        
        // Shuffle the array to randomize the question order
        shuffleArray(allQuestions);
        
        // Separate questions and answers
        questions = allQuestions.map(item => item.question);
        answers = allQuestions.map(item => item.answer);
    }
    
    // Fisher-Yates shuffle algorithm
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    // Display current question
    function displayQuestion() {
        questionText.textContent = questions[currentQuestionIndex];
        answerInput.value = '';
        answerInput.focus();
        feedbackElement.textContent = '';
        feedbackElement.className = 'feedback';
    }
    
    // Check answer
    function checkAnswer() {
        const userAnswer = parseInt(answerInput.value);
        const correctAnswer = answers[currentQuestionIndex];
        
        const progressItems = progressContainer.querySelectorAll('.progress-item');
        const currentProgressItem = progressItems[currentQuestionIndex];
        
        if (userAnswer === correctAnswer) {
            // Correct answer
            currentProgressItem.innerHTML = '✓';
            currentProgressItem.classList.add('correct');
            feedbackElement.textContent = 'Correct!';
            feedbackElement.className = 'feedback correct';
        } else {
            // Incorrect answer
            currentProgressItem.innerHTML = '✗';
            currentProgressItem.classList.add('incorrect');
            feedbackElement.textContent = `Incorrect! The answer is ${correctAnswer}.`;
            feedbackElement.className = 'feedback incorrect';
        }
        
        currentQuestionIndex++;
        
        if (currentQuestionIndex < questions.length) {
            setTimeout(displayQuestion, 1500);
        } else {
            setTimeout(showResults, 1500);
        }
    }
    
    // Skip the current question
    function skipQuestion() {
        const progressItems = progressContainer.querySelectorAll('.progress-item');
        const currentProgressItem = progressItems[currentQuestionIndex];
        
        // Mark as incorrect
        currentProgressItem.innerHTML = '✗';
        currentProgressItem.classList.add('incorrect');
        feedbackElement.textContent = `Skipped. The answer is ${answers[currentQuestionIndex]}.`;
        feedbackElement.className = 'feedback incorrect';
        
        currentQuestionIndex++;
        
        if (currentQuestionIndex < questions.length) {
            setTimeout(displayQuestion, 1500);
        } else {
            setTimeout(showResults, 1500);
        }
    }
    
    // Show results
    function showResults() {
        gameScreen.style.display = 'none';
        resultScreen.style.display = 'flex';
        
        const progressItems = progressContainer.querySelectorAll('.progress-item');
        let correctCount = 0;
        
        progressItems.forEach(item => {
            if (item.classList.contains('correct')) {
                correctCount++;
            }
        });
        
        const percentage = Math.round((correctCount / questions.length) * 100);
        scoreValue.textContent = percentage;
        
        if (percentage >= 70) {
            resultMessage.textContent = 'Congratulations! You earned the Math Badge!';
            
            localStorage.setItem('Math-badge', 'unlocked');
            
            setTimeout(() => {
                showBadgeAward();
            }, 1000);
        } else {
            resultMessage.textContent = 'Try again to earn the Math Badge!';
        }
    }
    
    // Show message overlay
    function showModal(modal) {
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('active');
            modal.querySelector('.message-content').classList.add('animate-popup');
        }, 50);
    }
    
    // Hide message overlay
    function hideModal(modal) {
        modal.classList.remove('active');
        modal.querySelector('.message-content').classList.remove('animate-popup');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 500);
    }
    
    // Show badge award
    function showBadgeAward() {
        badgeAwardOverlay.style.display = 'flex';
        setTimeout(() => {
            badgeAwardOverlay.style.opacity = 1;
        }, 50);
    }
    
    // Hide badge award and show win message
    function hideBadgeAward() {
        badgeAwardOverlay.style.opacity = 0;
        setTimeout(() => {
            badgeAwardOverlay.style.display = 'none';
            showModal(winMessage);
        }, 500);
    }
    
    // Start the game
    function startGame() {
        startScreen.style.display = 'none';
        gameScreen.style.display = 'block';
        resultScreen.style.display = 'none';
        
        currentQuestionIndex = 0;
        generateQuestions();
        initializeProgress();
        displayQuestion();
    }
    
    // Restart the game
    function restartGame() {
        resultScreen.style.display = 'none';
        startGame();
    }
    
    // Event listeners
    startButton.addEventListener('click', startGame);
    submitButton.addEventListener('click', checkAnswer);
    skipButton.addEventListener('click', skipQuestion);
    retryButton.addEventListener('click', restartGame);
    continueBtn.addEventListener('click', hideBadgeAward);
    playAgainButton.addEventListener('click', () => {
        hideModal(winMessage);
    });
    
    // Allow pressing Enter to submit answer
    answerInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            submitButton.click();
        }
    });
    
    // Initialize progress indicators
    initializeProgress();
    
    // Check if badge already unlocked
    if (localStorage.getItem('Math-badge') === 'unlocked') {
        
    }
});