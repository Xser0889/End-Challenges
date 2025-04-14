document.addEventListener('DOMContentLoaded', function() {
    // When implementing this game with actual files, replace the URLs with actual paths
    const imageUrls = {
        blue: '../Images/blueclover.png', 
        red: '../Images/redclover.png',
        yellow: '../Images/yellowclover.png',
        green: '../Images/greenclover.png'
    };
    
    // Set the background images for the clovers
    Object.keys(imageUrls).forEach(color => {
        document.getElementById(color).style.backgroundImage = `url('${imageUrls[color]}')`;
    });
    
    const clovers = {
        blue: document.getElementById('blue'),
        red: document.getElementById('red'),
        yellow: document.getElementById('yellow'),
        green: document.getElementById('green')
    };
    
    // Define clover data with frequencies for musical notes
    const cloverData = {
        green: { sound: 261.6 }, // C note
        red: { sound: 329.6 },   // E note
        blue: { sound: 392.0 },  // G note
        yellow: { sound: 523.2 } // High C note
    };

    // Create Tone.js synth
    const synth = new Tone.Synth({
        oscillator: {
            type: 'sine'
        },
        envelope: {
            attack: 0.005,
            decay: 0.1,
            sustain: 0.3,
            release: 1
        }
    }).toDestination();
    
    // win and lose sounds
    const winSequence = [
        { note: 'C4', duration: '8n' },
        { note: 'E4', duration: '8n' },
        { note: 'G4', duration: '8n' },
        { note: 'C5', duration: '4n' }
    ];
    
    const loseSequence = [
        { note: 'E4', duration: '8n' },
        { note: 'Eb4', duration: '8n' },
        { note: 'D4', duration: '4n' }
    ];
    
    // Badge award celebratory sequence
    const celebrationSequence = [
        { note: 'C4', duration: '16n' },
        { note: 'E4', duration: '16n' },
        { note: 'G4', duration: '16n' },
        { note: 'C5', duration: '16n' },
        { note: 'G4', duration: '16n' },
        { note: 'C5', duration: '8n' },
        { note: 'D5', duration: '8n' },
        { note: 'E5', duration: '4n' }
    ];
    
    const startButton = document.getElementById('start');
    const resetButton = document.getElementById('reset');
    const levelDisplay = document.getElementById('level');
    const winMessage = document.getElementById('winMessage');
    const loseMessage = document.getElementById('loseMessage');
    const playAgainButton = document.getElementById('playAgain');
    const tryAgainButton = document.getElementById('tryAgain');
    const finalLevelDisplay = document.getElementById('finalLevel');
    const badgeAwardOverlay = document.getElementById('badgeAwardOverlay');
    const continueBtn = document.getElementById('continueBtn');
    const closeWinBtn = document.getElementById('closeWinBtn');
    const closeLoseBtn = document.getElementById('closeLoseBtn');
    
    const colors = ['blue', 'red', 'yellow', 'green'];
    let gameSequence = [];
    let playerSequence = [];
    let level = 1;
    let isPlaying = false;
    const WIN_LEVEL = 8; 
    
    // Add click event to each clover
    Object.keys(clovers).forEach(color => {
        clovers[color].addEventListener('click', () => {
            if (isPlaying) {
                playerClick(color);
            }
        });
    });
    
    // Start button event
    startButton.addEventListener('click', async () => {
        if (!isPlaying) {
            // Start audio context on user interaction
            await Tone.start();
            startGame();
        }
    });
    
    // Reset button event
    resetButton.addEventListener('click', () => {
        resetGame();
    });
    
    // Play again button event (win message)
    playAgainButton.addEventListener('click', async () => {
        hideModal(winMessage);
        resetGame();
        await Tone.start();
        startGame();
    });
    
    // Try again button event (lose message)
    tryAgainButton.addEventListener('click', async () => {
        hideModal(loseMessage);
        resetGame();
        await Tone.start();
        startGame();
    });
    
    // Close button events
    closeWinBtn.addEventListener('click', () => {
        hideModal(winMessage);
    });
    
    closeLoseBtn.addEventListener('click', () => {
        hideModal(loseMessage);
    });
    
    // Continue button event (badge award)
    continueBtn.addEventListener('click', () => {
        hideBadgeAward();
    });
    
    function startGame() {
        isPlaying = true;
        gameSequence = [];
        playerSequence = [];
        level = 0;
        levelDisplay.textContent = level;
        addToSequence();
        startButton.disabled = true;
    }
    
    function resetGame() {
        isPlaying = false;
        gameSequence = [];
        playerSequence = [];
        level = 1;
        levelDisplay.textContent = level;
        startButton.disabled = false;
    }
    
    function addToSequence() {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        gameSequence.push(randomColor);
        
        // Show the sequence to the player
        displaySequence();
    }
    
    function displaySequence() {
        // Disable player input during sequence display
        isPlaying = false;
        
        let i = 0;
        const interval = setInterval(() => {
            if (i < gameSequence.length) {
                const color = gameSequence[i];
                flashClover(color);
                i++;
            } else {
                clearInterval(interval);
                // Enable player input after sequence is displayed
                isPlaying = true;
                playerSequence = [];
            }
        }, 800);
    }
    
    function flashClover(color) {
        clovers[color].classList.add('active');
        playSound(color);
        setTimeout(() => {
            clovers[color].classList.remove('active');
        }, 500);
    }
    
    function playSound(color) {
        // Play corresponding note from cloverData using Tone.js
        synth.triggerAttackRelease(cloverData[color].sound, '0.3s');
    }

    function playWinSound() {
        let time = Tone.now();
        winSequence.forEach(item => {
            synth.triggerAttackRelease(item.note, item.duration, time);
            time += Tone.Time(item.duration).toSeconds();
        });
    }
    
    function playCelebrationSound() {
        let time = Tone.now();
        celebrationSequence.forEach(item => {
            synth.triggerAttackRelease(item.note, item.duration, time);
            time += Tone.Time(item.duration).toSeconds();
        });
    }
    
    function playLoseSound() {
        let time = Tone.now();
        loseSequence.forEach(item => {
            synth.triggerAttackRelease(item.note, item.duration, time);
            time += Tone.Time(item.duration).toSeconds();
        });
    }
    
    function playerClick(color) {
        flashClover(color);
        playerSequence.push(color);
        
        // Check if the player's sequence matches the game sequence
        checkPlayerSequence();
    }
    
    function checkPlayerSequence() {
        // Check if the player has completed the current sequence
        if (playerSequence.length === gameSequence.length) {
            if (compareSequences()) {
                // Player completed the sequence correctly
                level++;
                levelDisplay.textContent = level;
                
                // Check if player reached WIN_LEVEL
                if (level > WIN_LEVEL) {
                    // Player won the game
                    isPlaying = false;
                    playWinSound();
                    
                    // Save badge as unlocked in localStorage
                    localStorage.setItem('clover-badge', 'unlocked');
                    
                    // Show badge award with animation
                    setTimeout(() => {
                        showBadgeAward();
                    }, 500);
                } else {
                    // Continue to next level
                    setTimeout(() => {
                        addToSequence();
                    }, 1000);
                }
            } else {
                // Player made a mistake
                gameOver();
            }
        } else {
            // Check if the player's sequence so far is correct
            for (let i = 0; i < playerSequence.length; i++) {
                if (playerSequence[i] !== gameSequence[i]) {
                    // Player made a mistake
                    gameOver();
                    return;
                }
            }

        }
    }

    function showModal(modal, won) {
        modal.style.display = 'flex';
        
        // Update message content for lose message
        if (!won) {
            finalLevelDisplay.textContent = level;
        }
        
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
    
    function showBadgeAward() {
        badgeAwardOverlay.style.display = 'flex';
        setTimeout(() => {
            badgeAwardOverlay.style.opacity = 1;
            playCelebrationSound();
        }, 50);
    }
    
    function hideBadgeAward() {
        badgeAwardOverlay.style.opacity = 0;
        setTimeout(() => {
            badgeAwardOverlay.style.display = 'none';
            showModal(winMessage, true);
        }, 500);
    }
    
    function gameOver() {
        isPlaying = false;
        playLoseSound();
        setTimeout(() => {
            showModal(loseMessage, false);
        }, 500);
    }
    
    function compareSequences() {
        if (playerSequence.length !== gameSequence.length) {
            return false;
        }
        
        for (let i = 0; i < playerSequence.length; i++) {
            if (playerSequence[i] !== gameSequence[i]) {
                return false;
            }
        }
        
        return true;
    }
    
    // Check if badge already unlocked and show appropriate message
    if (localStorage.getItem('clover-badge') === 'unlocked') {
        
    }
});
