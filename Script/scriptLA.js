document.addEventListener('DOMContentLoaded', function() {
    const paragraphContainer = document.getElementById('paragraph-container');
    const currentLevelSpan = document.getElementById('current-level');
    const errorsFoundSpan = document.getElementById('errors-found');
    const completedLevelSpan = document.getElementById('completed-level');
    const nextLevelBtn = document.getElementById('next-level-btn');
    const retryBtn = document.getElementById('retry-btn');
    const successMessage = document.getElementById('success-message');
    const hearts = document.querySelectorAll('.heart');
    const badgeAwardOverlay = document.getElementById('badgeAwardOverlay');
    const continueBtn = document.getElementById('continueBtn');
    const winMessage = document.getElementById('winMessage');
    const playAgainButton = document.getElementById('playAgain');
    
    // Game state
    let currentLevel = 1;
    let lives = 3;
    let errorsFound = 0;
    let errorsToFind = 5;
    
    // Game levels content with errors
    const gameLevels = [
        {
            text: "I goed to the park yesterday with my friends. We played soccer and eated lunch. The sun was shine brightly. My friend runned very fast. I feeled very happy that day.",
            errors: [
                { word: "goed", correctWord: "went", type: "past tense" },
                { word: "eated", correctWord: "ate", type: "past tense" },
                { word: "shine", correctWord: "shining", type: "verb form" },
                { word: "runned", correctWord: "ran", type: "past tense" },
                { word: "feeled", correctWord: "felt", type: "past tense" }
            ]
        },
        {
            text: "My mother maked a cake for my birthday. We has a big party at home. My friend bringed me a toy car. I was very happyness about my presents. There was five kids at my party.",
            errors: [
                { word: "maked", correctWord: "made", type: "past tense" },
                { word: "has", correctWord: "had", type: "past tense" },
                { word: "bringed", correctWord: "brought", type: "past tense" },
                { word: "happyness", correctWord: "happy", type: "adjective form" },
                { word: "was", correctWord: "were", type: "agreement" }
            ]
        },
        {
            text: "Tomorrow we going to the zoo. I like seeing the aminals there. The teacher say we must stay together. I bringed my lunch in my bag. I am very excitement about this trip.",
            errors: [
                { word: "going", correctWord: "are going", type: "present tense" },
                { word: "aminals", correctWord: "animals", type: "spelling" },
                { word: "say", correctWord: "says", type: "agreement" },
                { word: "bringed", correctWord: "brought", type: "past tense" },
                { word: "excitement", correctWord: "excited", type: "adjective form" }
            ]
        }
    ];
    
    // Initialize game
    function initLevel(level) {
        // Reset state for new level
        errorsFound = 0;
        lives = 3;
        errorsFoundSpan.textContent = '0';
        currentLevelSpan.textContent = level;
        
        // Reset UI
        hearts.forEach(heart => heart.textContent = '❤️');
        nextLevelBtn.style.display = 'none';
        retryBtn.style.display = 'none';
        successMessage.style.display = 'none';
        
        // Create paragraph with clickable words
        const levelData = gameLevels[level - 1];
        const words = levelData.text.split(' ');
        
        paragraphContainer.innerHTML = '';
        
        words.forEach(word => {
            const span = document.createElement('span');
            span.className = 'word';
            // Remove any punctuation for comparison but keep it for display
            const cleanWord = word.replace(/[.,!?;:]/g, '');
            span.textContent = word;
            span.dataset.word = cleanWord;
            
            // Check if this word is an error
            const isError = levelData.errors.some(error => error.word === cleanWord);
            span.dataset.isError = isError;
            
            // Find the correction if it's an error
            if (isError) {
                const errorData = levelData.errors.find(error => error.word === cleanWord);
                span.dataset.correctWord = errorData.correctWord;
                span.dataset.errorType = errorData.type;
            }
            
            span.addEventListener('click', handleWordClick);
            paragraphContainer.appendChild(span);
            // Add space after each word
            paragraphContainer.appendChild(document.createTextNode(' '));
        });
    }
    
    // Handle word click
    function handleWordClick(event) {
        const clickedWord = event.target;
        
        // If word has already been marked, do nothing
        if (clickedWord.classList.contains('correct') || 
            clickedWord.classList.contains('incorrect')) {
            return;
        }
        
        // Check if clicked word is an error
        if (clickedWord.dataset.isError === 'true') {
            // Correct!
            clickedWord.classList.add('correct');
            // Show correction
            clickedWord.textContent = clickedWord.dataset.correctWord + ' ✓';
            errorsFound++;
            errorsFoundSpan.textContent = errorsFound;
            
            // Check if level completed
            if (errorsFound === errorsToFind) {
                completedLevelSpan.textContent = currentLevel;
                
                if (currentLevel === gameLevels.length) {
                    // Game completed - show badge!
                    // Save the badge as unlocked in localStorage
                    localStorage.setItem('Langaje-arts-badge', 'unlocked');
                    
                    // Show badge award with animation
                    setTimeout(() => {
                        showBadgeAward();
                    }, 500);
                } else {
                    // Show success for this level
                    successMessage.style.display = 'block';
                    nextLevelBtn.style.display = 'block';
                }
            }
        } else {
            // Incorrect!
            clickedWord.classList.add('incorrect');
            
            // Remove a life
            lives--;
            if (lives >= 0) {
                hearts[lives].textContent = '💔';
            }
            
            // Reset incorrect mark after animation
            setTimeout(() => {
                clickedWord.classList.remove('incorrect');
            }, 1000);
            
            // Check if out of lives
            if (lives === 0) {
                retryBtn.style.display = 'block';
            }
        }
    }
    
    // Show badge award animation
    function showBadgeAward() {
        badgeAwardOverlay.style.display = 'flex';
        setTimeout(() => {
            badgeAwardOverlay.style.opacity = 1;
        }, 50);
    }
    
    // Hide badge award
    function hideBadgeAward() {
        badgeAwardOverlay.style.opacity = 0;
        setTimeout(() => {
            badgeAwardOverlay.style.display = 'none';
            // Show the win message after badge animation
            showModal(winMessage);
        }, 500);
    }
    
    function showModal(modal) {
        modal.style.display = 'flex';
        
        // Add animation class after a short delay to trigger transition
        setTimeout(() => {
            modal.classList.add('active');
            modal.querySelector('.message-content').classList.add('animate-popup');
        }, 50);
    }
    
    function hideModal(modal) {
        modal.classList.remove('active');
        modal.querySelector('.message-content').classList.remove('animate-popup');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 500);
    }
    
    // Event listeners
    nextLevelBtn.addEventListener('click', () => {
        currentLevel++;
        initLevel(currentLevel);
    });
    
    retryBtn.addEventListener('click', () => {
        initLevel(currentLevel);
    });
    
    continueBtn.addEventListener('click', () => {
        hideBadgeAward();
    });
    
    playAgainButton.addEventListener('click', () => {
        hideModal(winMessage);
        // Reset the game if they want to play again
        currentLevel = 1;
        initLevel(currentLevel);
    });
    
    // Check if badge already unlocked
    if (localStorage.getItem('Langaje-arts-badge') === 'unlocked') {
        
    }
    
    // Start the game
    initLevel(currentLevel);
});