document.addEventListener('DOMContentLoaded', function() {
    const paragraphContainer = document.getElementById('paragraph-container');
    const questionContainer = document.getElementById('question-container');
    const currentLevelSpan = document.getElementById('current-level');
    const questionsCorrectSpan = document.getElementById('questions-correct');
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
    let questionsCorrect = 0;
    let questionsAnswered = 0; 
    const questionsPerLevel = 6;
    
    // Game levels content
    const gameLevels = [
        {
            title: "Max's Big Day at the Zoo",
            text: "Max was so excited to go to the zoo! Today was a special day. His class was going on a field trip. Max had been waiting for this day all month. He packed his lunch the night before and woke up extra early. When he got to school, his best friend Lily was already there.\n\nOn the bus, Max and Lily talked about which animals they wanted to see most. Max wanted to see the lions, while Lily was excited about the elephants. When they arrived, their teacher Ms. Johnson divided them into groups. Max and Lily were in the same group with three other kids.\n\nTheir first stop was the lion exhibit. The lion roared so loud that Max jumped! It had a big, fluffy mane and sharp teeth. Next, they saw the elephants. The baby elephant was spraying water with its trunk, and everyone laughed. After that, they visited the monkey house. The monkeys were swinging from branch to branch and making funny faces.\n\nAt lunchtime, they sat at picnic tables near the giraffe area. Max shared his chocolate chip cookies with Lily, and she gave him some of her apple slices. After lunch, they got to feed the giraffes! They had very long necks and ate leaves right from Max's hand. Their tongues were purple and felt rough.\n\nIn the afternoon, they saw the penguins swimming in the cold water. Max thought they looked like they were wearing tiny tuxedos. The last stop was the reptile house where they saw snakes, lizards, and turtles. Max didn't like the snakes much, but he thought the colorful frogs were cool.\n\nOn the bus ride home, Max was very tired but very happy. He told his mom it was the best day ever at the zoo! That night, he dreamed about all the amazing animals he had seen.",
            questions: [
                {
                    question: "Where did Max go?",
                    options: ["To the park", "To the zoo", "To the beach", "To the school"],
                    correctAnswer: "To the zoo"
                },
                {
                    question: "Why was it a special day for Max?",
                    options: ["It was his birthday", "It was a field trip", "It was summer", "It was a holiday"],
                    correctAnswer: "It was a field trip"
                },
                {
                    question: "What animal made Max jump?",
                    options: ["Monkey", "Elephant", "Lion", "Giraffe"],
                    correctAnswer: "Lion"
                },
                {
                    question: "What was one thing Max and his classmates did after lunch?",
                    options: ["Saw the lions", "Fed the giraffes", "Went home", "Ate ice cream"],
                    correctAnswer: "Fed the giraffes"
                },
                {
                    question: "Who did Max share his chocolate chip cookies with?",
                    options: ["His teacher", "His mom", "Lily", "The animals"],
                    correctAnswer: "Lily"
                },
                {
                    question: "Which animals looked like they were wearing tuxedos, according to Max?",
                    options: ["Lions", "Monkeys", "Elephants", "Penguins"],
                    correctAnswer: "Penguins"
                }
            ]
        },
        {
            title: "The Little Prince's Adventure",
            text: "The Little Prince lived on a tiny planet far, far away. It was so small that he could walk around the whole planet in just a few minutes. On his planet, there were three small volcanoes that he cleaned regularly. One was extinct, but he still took care of it. He also had a beautiful rose that he loved very much. She was proud and a bit difficult sometimes, but the Little Prince protected her with a glass cover at night.\n\nEvery day, the Little Prince would pull out the baobab trees that tried to grow on his planet. If they grew too big, they could split his tiny world apart! His planet was so small that he could watch the sunset many times in one day just by moving his chair a little bit. He would sometimes watch more than forty sunsets in one evening when he felt sad.\n\nOne day, the Little Prince decided to leave his planet and explore the universe. He caught a flock of wild birds to help him travel. He visited many different planets and met many strange grown-ups. On the first planet, he met a king who claimed to rule over everything, even the stars. But the king had no real subjects.\n\nOn another planet, he met a businessman who spent all his time counting stars because he thought he owned them. The Little Prince thought this was very puzzling. He also met a lamplighter who had to light and put out a lamp over and over because his planet rotated so quickly. The Little Prince felt sorry for him because he was the only one who thought about something besides himself.\n\nWhen the Little Prince finally came to Earth, it was very different from the other planets. It was huge! He felt very lonely until he met a fox in the desert. At first, the fox was cautious, but soon they became friends. The fox taught the Little Prince a very important secret: \"What is essential is invisible to the eyes. One can only see clearly with the heart.\"\n\nThe fox also explained that when you tame someone, you become responsible for them forever. The Little Prince realized that his rose was special to him not because she was the most beautiful rose in the universe, but because she was his rose and he had taken care of her. He missed her very much and decided he must return to his planet and his rose.",
            questions: [
                {
                    question: "How big was the Little Prince's planet?",
                    options: ["Very big", "Tiny", "Medium-sized", "The same size as Earth"],
                    correctAnswer: "Tiny"
                },
                {
                    question: "What did the Little Prince have to clean on his planet?",
                    options: ["His house", "Three volcanoes", "Baobab trees", "Stars"],
                    correctAnswer: "Three volcanoes"
                },
                {
                    question: "What did the Little Prince love on his planet?",
                    options: ["A lion", "A sheep", "A rose", "A fox"],
                    correctAnswer: "A rose"
                },
                {
                    question: "Why did the Little Prince pull out baobab trees?",
                    options: ["They were ugly", "They could split his planet apart", "They blocked the sun", "His rose didn't like them"],
                    correctAnswer: "They could split his planet apart"
                },
                {
                    question: "What was the businessman counting on his planet?",
                    options: ["Money", "People", "Stars", "Sheep"],
                    correctAnswer: "Stars"
                },
                {
                    question: "What important secret did the fox teach the Little Prince?",
                    options: ["How to grow roses", "What is essential is invisible to the eyes", "How to travel between planets", "How to count stars"],
                    correctAnswer: "What is essential is invisible to the eyes"
                }
            ]
        }
    ];
    
    // Initialize game
    function initLevel(level) {
        // Reset state for new level
        questionsCorrect = 0;
        questionsAnswered = 0; 
        lives = 3;
        questionsCorrectSpan.textContent = '0';
        currentLevelSpan.textContent = level;
        
        // Reset UI
        hearts.forEach(heart => heart.textContent = '❤️');
        nextLevelBtn.style.display = 'none';
        retryBtn.style.display = 'none';
        successMessage.style.display = 'none';
        
        // Load story and questions
        const levelData = gameLevels[level - 1];
        
        // Display story with paragraphs
        paragraphContainer.innerHTML = `
            <h3>${levelData.title}</h3>
            ${levelData.text.split('\n\n').map(para => `<p>${para}</p>`).join('')}
        `;
        
        // Create questions
        questionContainer.innerHTML = '';
        
        levelData.questions.forEach((questionData, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.className = 'question';
            questionDiv.style.marginBottom = '20px';
            questionDiv.style.backgroundColor = '#f9f9f9';
            questionDiv.style.padding = '15px';
            questionDiv.style.borderRadius = '8px';
            questionDiv.style.textAlign = 'left';
            
            const questionHeader = document.createElement('p');
            questionHeader.style.fontWeight = 'bold';
            questionHeader.style.marginBottom = '10px';
            questionHeader.textContent = `${index + 1}. ${questionData.question}`;
            questionDiv.appendChild(questionHeader);
            
            const optionsContainer = document.createElement('div');
            optionsContainer.className = 'options-container';
            
            questionData.options.forEach((option, optIndex) => {
                const optionLabel = document.createElement('label');
                optionLabel.className = 'option-label';
                optionLabel.style.display = 'block';
                optionLabel.style.margin = '5px 0';
                optionLabel.style.cursor = 'pointer';
                
                const radioInput = document.createElement('input');
                radioInput.type = 'radio';
                radioInput.name = `question-${index}`;
                radioInput.value = option;
                radioInput.style.marginRight = '10px';
                
                optionLabel.appendChild(radioInput);
                optionLabel.appendChild(document.createTextNode(option));
                optionsContainer.appendChild(optionLabel);
                
                radioInput.addEventListener('change', function() {
                    handleAnswerSelection(this, questionData.correctAnswer);
                });
            });
            
            const resultMessage = document.createElement('div');
            resultMessage.className = 'result-message';
            resultMessage.style.marginTop = '10px';
            resultMessage.style.display = 'none';
            
            questionDiv.appendChild(optionsContainer);
            questionDiv.appendChild(resultMessage);
            questionContainer.appendChild(questionDiv);
        });
    }
    
    // Handle answer selection
    function handleAnswerSelection(selectedOption, correctAnswer) {
        const questionDiv = selectedOption.closest('.question');
        const allOptions = questionDiv.querySelectorAll('input[type="radio"]');
        const resultMessage = questionDiv.querySelector('.result-message');
        
        // Disable all options after selection
        allOptions.forEach(option => {
            option.disabled = true;
        });
        
        // Increment questions answered counter
        questionsAnswered++;
        
        if (selectedOption.value === correctAnswer) {
            // Correct answer
            resultMessage.textContent = '✓ Correct!';
            resultMessage.style.color = 'green';
            questionsCorrect++;
            questionsCorrectSpan.textContent = questionsCorrect;
        } else {
            // Incorrect answer
            resultMessage.textContent = '✗ Incorrect. The correct answer is: ' + correctAnswer;
            resultMessage.style.color = 'red';
            
            // Remove a life
            lives--;
            if (lives >= 0) {
                hearts[lives].textContent = '💔';
            }
            
            // Check if out of lives
            if (lives === 0) {
                retryBtn.style.display = 'block';
            }
        }
        
        resultMessage.style.display = 'block';
        
        // Check if all questions have been answered or if all lives are lost
        if (questionsAnswered === questionsPerLevel && lives > 0) {
            completedLevelSpan.textContent = currentLevel;
            
            if (currentLevel === gameLevels.length) {
                // Game completed - show badge!
                // Save the badge as unlocked in localStorage
                localStorage.setItem('Reading-badge', 'unlocked');
                
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
    if (localStorage.getItem('Reading-badge') === 'unlocked') {

    }
    
    // Start the game
    initLevel(currentLevel);
});
