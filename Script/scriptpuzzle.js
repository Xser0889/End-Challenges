document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const timerElement = document.getElementById('timer');
    const timerLabelElement = document.getElementById('timer-label');
    const currentLevelSpan = document.getElementById('current-level');
    const currentScoreSpan = document.getElementById('current-score');
    const maxScoreSpan = document.getElementById('max-score');
    const gameMessageElement = document.getElementById('game-message');
    const checkButton = document.getElementById('check-button');
    const startButton = document.getElementById('start-button');
    const nextLevelBtn = document.getElementById('next-level-btn');
    const retryBtn = document.getElementById('retry-btn');
    const successMessage = document.getElementById('success-message');
    const completedLevelSpan = document.getElementById('completed-level');
    const levelScoreSpan = document.getElementById('level-score');
    const levelMaxScoreSpan = document.getElementById('level-max-score');
    const hearts = document.querySelectorAll('.heart');
    const badgeAwardOverlay = document.getElementById('badgeAwardOverlay');
    const continueBtn = document.getElementById('continueBtn');
    const winMessage = document.getElementById('winMessage');
    const playAgainButton = document.getElementById('playAgain');
    const shelfSlots = document.querySelectorAll('.shelf-slot');
    const itemsTray = document.getElementById('items-tray');
    
    // Game assets 
    const itemImages = [
        '../Images/Items/Books.png',
        '../Images/Items/Frame bug.png',
        '../Images/Items/Globe.webp',
        '../Images/Items/logo.png',
        '../Images/Items/notebook.png',
        '../Images/Items/Pen.png',
        '../Images/Items/pencil.png',
        '../Images/Items/plant.png',
        '../Images/Items/puzzles.png',
        '../Images/Items/teddy.png'
    ];
    
    // Game state
    let currentLevel = 1;
    let lives = 3;
    let score = 0;
    let maxScore = 10;
    let gameInProgress = false;
    let memorizePhase = false;
    let shelfItems = [];
    let remainingItems = [];
    let fallenItems = [];
    let selectedItemIndex = null;
    let timer;
    let timerValue;
    let correctlyPlacedItems = new Set(); 
    
    // Level configuration
    const levels = [
        { memorizeTime: 15, remainingItemCount: 4 },
        { memorizeTime: 10, remainingItemCount: 3 },
        { memorizeTime: 8, remainingItemCount: 2 }
    ];
    
    // Initialize game
    function initGame() {
        currentLevelSpan.textContent = currentLevel;
        maxScoreSpan.textContent = maxScore;
        resetLives();
        resetShelf();
        resetControls();
        clearInterval(timer);
        correctlyPlacedItems = new Set(); 
        
        checkButton.style.display = 'none';
        startButton.style.display = 'block';
        nextLevelBtn.style.display = 'none';
        retryBtn.style.display = 'none';
        successMessage.style.display = 'none';
        
        gameMessageElement.textContent = 'Press Start to begin the game!';
        gameMessageElement.style.display = 'block';
        
        // Create item tray buttons
        createItemTray();
        
        gameInProgress = false;
        memorizePhase = false;
    }
    
    // Reset controls
    function resetControls() {
        checkButton.disabled = false;
        startButton.disabled = false;
        
        // Disable slots and items initially
        shelfSlots.forEach(slot => {
            slot.classList.remove('highlight');
            slot.onclick = null;
        });
        
        const itemButtons = document.querySelectorAll('.item-button');
        itemButtons.forEach(button => {
            button.classList.remove('selected');
            button.classList.add('disabled');
            button.onclick = null;
        });
    }
    
    // Reset shelf
    function resetShelf() {
        shelfSlots.forEach(slot => {
            slot.innerHTML = '';
            slot.dataset.itemIndex = '';
            slot.style.border = '';
        });
    }
    
    // Reset lives
    function resetLives() {
        lives = 3;
        hearts.forEach(heart => heart.textContent = '❤️');
    }
    
    // Create item tray with all available items
    function createItemTray() {
        itemsTray.innerHTML = '';
        
        itemImages.forEach((src, index) => {
            const button = document.createElement('div');
            button.className = 'item-button disabled';
            button.dataset.itemIndex = index;
            
            const img = document.createElement('img');
            img.src = src;
            img.alt = `Item ${index + 1}`;
            
            button.appendChild(img);
            itemsTray.appendChild(button);
        });
    }
    
    // Start the level
    function startLevel() {
        score = 0;
        currentScoreSpan.textContent = score;
        correctlyPlacedItems = new Set(); // Reset the set of correctly placed items
        
        // Setup item positions
        setupItemPositions();
        
        // Display all items for memorization
        displayItemsForMemorization();
        
        // Start memorization timer
        startMemorizationTimer();
        
        gameInProgress = true;
        memorizePhase = true;
    }
    
    // Setup random item positions
    function setupItemPositions() {
        // Reset arrays
        shelfItems = [];
        remainingItems = [];
        fallenItems = [];
        
        // Create array of randomized item indices (0-9)
        const randomizedItems = [];
        for (let i = 0; i < itemImages.length; i++) {
            randomizedItems.push(i);
        }
        
        // Shuffle array
        for (let i = randomizedItems.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [randomizedItems[i], randomizedItems[j]] = [randomizedItems[j], randomizedItems[i]];
        }
        
        // Assign each item to a position
        randomizedItems.forEach((itemIndex, position) => {
            shelfItems.push({
                position: position,
                itemIndex: itemIndex
            });
        });
        
        // Determine which items will remain on the shelf
        const levelConfig = levels[currentLevel - 1];
        const remainingIndices = new Set();
        
        while (remainingIndices.size < levelConfig.remainingItemCount) {
            const randomPosition = Math.floor(Math.random() * 10);
            remainingIndices.add(randomPosition);
        }
        
        // Separate items into remaining and fallen
        shelfItems.forEach(item => {
            if (remainingIndices.has(item.position)) {
                remainingItems.push(item);
            } else {
                fallenItems.push(item);
            }
        });
    }
    
    // Display all items on shelf for memorization
    function displayItemsForMemorization() {
        resetShelf();
        
        shelfItems.forEach(item => {
            const slot = document.querySelector(`.shelf-slot[data-position="${item.position}"]`);
            const img = document.createElement('img');
            img.src = itemImages[item.itemIndex];
            img.alt = `Item ${item.itemIndex + 1}`;
            
            slot.appendChild(img);
            slot.dataset.itemIndex = item.itemIndex;
        });
    }
    
    // Start memorization timer
    function startMemorizationTimer() {
        const levelConfig = levels[currentLevel - 1];
        timerValue = levelConfig.memorizeTime;
        timerElement.textContent = timerValue;
        timerLabelElement.textContent = 'Memorize: ';
        
        gameMessageElement.textContent = 'Memorize the positions of all items!';
        
        timer = setInterval(() => {
            timerValue--;
            timerElement.textContent = timerValue;
            
            if (timerValue <= 0) {
                clearInterval(timer);
                startPlacementPhase();
            }
        }, 1000);
    }
    
    // Start item placement phase
    function startPlacementPhase() {
        memorizePhase = false;
        
        // Make all fallen items animate and fall
        fallenItems.forEach(item => {
            const slot = document.querySelector(`.shelf-slot[data-position="${item.position}"]`);
            const img = slot.querySelector('img');
            
            if (img) {
                // Add the falling animation class to all fallen items
                img.classList.add('falling');
                
                // Remove the item from the shelf after animation completes
                setTimeout(() => {
                    slot.innerHTML = '';
                    slot.dataset.itemIndex = '';
                }, 500);
            }
        });
        
        gameMessageElement.textContent = 'Place the items back in their correct positions!';
        
        // Enable check button
        checkButton.style.display = 'block';
        startButton.style.display = 'none';
        
        // Enable item buttons after a short delay (after animations)
        setTimeout(() => {
            enableItemSelection();
            enableSlotSelection();
        }, 600);
    }
    
    // Enable item selection
    function enableItemSelection() {
        const itemButtons = document.querySelectorAll('.item-button');
        
        // First disable all
        itemButtons.forEach(button => {
            button.classList.add('disabled');
            button.onclick = null;
        });
        
        // Then enable only fallen items that haven't been correctly placed
        fallenItems.forEach(item => {
            // Skip items that have been correctly placed
            if (correctlyPlacedItems.has(item.itemIndex)) {
                return;
            }
            
            const button = document.querySelector(`.item-button[data-item-index="${item.itemIndex}"]`);
            if (button) {
                button.classList.remove('disabled');
                button.onclick = () => selectItem(item.itemIndex, button);
            }
        });
    }
    
    // Select an item
    function selectItem(itemIndex, buttonElement) {
        // Deselect any previously selected item
        const itemButtons = document.querySelectorAll('.item-button');
        itemButtons.forEach(button => {
            button.classList.remove('selected');
        });
        
        // Select this item
        buttonElement.classList.add('selected');
        selectedItemIndex = itemIndex;
        
        // Highlight available slots when an item is selected
        highlightAvailableSlots();
    }
    
    // Highlight available slots
    function highlightAvailableSlots() {
        shelfSlots.forEach(slot => {
            if (!slot.querySelector('img')) {
                slot.classList.add('highlight');
            } else {
                slot.classList.remove('highlight');
            }
        });
    }
    
    // Enable shelf slot selection
    function enableSlotSelection() {
        shelfSlots.forEach(slot => {
            // Only enable empty slots
            if (!slot.querySelector('img')) {
                slot.classList.add('highlight');
                slot.onclick = () => placeItem(slot);
            } else {
                slot.classList.remove('highlight');
            }
        });
    }
    
    // Place item on shelf
    function placeItem(slot) {
        if (selectedItemIndex === null) {
            gameMessageElement.textContent = 'Select an item first!';
            return;
        }
        
        // Place the item on the shelf
        const img = document.createElement('img');
        img.src = itemImages[selectedItemIndex];
        img.alt = `Item ${selectedItemIndex + 1}`;
        
        slot.innerHTML = '';
        slot.appendChild(img);
        slot.dataset.itemIndex = selectedItemIndex;
        
        // Update slot onclick to prevent placing multiple items
        slot.classList.remove('highlight');
        slot.onclick = null;
        
        // Disable the selected item button
        const selectedButton = document.querySelector(`.item-button.selected`);
        if (selectedButton) {
            selectedButton.classList.remove('selected');
            selectedButton.classList.add('disabled');
            selectedButton.onclick = null;
        }
        
        // Reset selected item
        selectedItemIndex = null;
        
        // Update available slots
        enableSlotSelection();
    }
    
    // Check placements
    function checkPlacements() {
        let correctCount = 0;
        let incorrectCount = 0;
        
        // First count remaining items as correct placements
        correctCount += remainingItems.length;
        
        // Check each slot that should have a fallen item
        fallenItems.forEach(item => {
            const slot = document.querySelector(`.shelf-slot[data-position="${item.position}"]`);
            const placedItemIndex = slot.dataset.itemIndex;
            
            if (placedItemIndex === item.itemIndex.toString()) {
                // Correct placement - add to correctlyPlacedItems set
                correctlyPlacedItems.add(item.itemIndex);
                correctCount++;
                slot.style.border = '2px solid green';
            } else if (placedItemIndex) {
                // Incorrect placement
                incorrectCount++;
                slot.style.border = '2px solid red';
                
                // Animate incorrect placements
                const img = slot.querySelector('img');
                if (img) {
                    img.classList.add('falling');
                    setTimeout(() => {
                        slot.innerHTML = '';
                        slot.dataset.itemIndex = '';
                        slot.style.border = '';
                    }, 500);
                }
            }
        });
        
        // Update score
        score = correctCount;
        currentScoreSpan.textContent = score;
        
        // Check if any incorrect placements
        if (incorrectCount > 0) {
            // Reduce lives
            lives--;
            
            // Update hearts from right to left
            updateHearts();
            
            // Check if game over
            if (lives <= 0) {
                gameOver();
                return;
            }
            
            // Re-enable item selection for incorrectly placed items only
            setTimeout(() => {
                enableItemSelection();
                enableSlotSelection();
            }, 600);
            
            gameMessageElement.textContent = `Incorrect placements! Lives left: ${lives}`;
        } else {
            // Check if all items are placed
            const emptySlots = Array.from(document.querySelectorAll('.shelf-slot')).filter(slot => {
                // Only count slots that should have fallen items
                const position = parseInt(slot.dataset.position);
                const isFallenPosition = fallenItems.some(item => item.position === position);
                return isFallenPosition && !slot.querySelector('img');
            });
            
            if (emptySlots.length === 0) {
                levelComplete();
            } else {
                gameMessageElement.textContent = 'All placements correct so far! Continue placing items.';
            }
        }
    }
    
    // Update hearts to show broken hearts from right to left
    function updateHearts() {
        // Reset all hearts to full first
        hearts.forEach(heart => heart.textContent = '❤️');
        
        // Update broken hearts from right to left
        for (let i = 0; i < 3 - lives; i++) {
            const heartIndex = hearts.length - 1 - i;
            if (heartIndex >= 0) {
                hearts[heartIndex].textContent = '💔';
            }
        }
    }
    
    // Game over
    function gameOver() {
        gameInProgress = false;
        clearInterval(timer);
        
        gameMessageElement.textContent = 'Game Over! You ran out of lives.';
        checkButton.style.display = 'none';
        retryBtn.style.display = 'block';
    }
    
    // Level complete
    function levelComplete() {
        gameInProgress = false;
        clearInterval(timer);
        
        // Show success message
        completedLevelSpan.textContent = currentLevel;
        levelScoreSpan.textContent = score;
        levelMaxScoreSpan.textContent = maxScore;
        successMessage.style.display = 'block';
        
        // Hide check button
        checkButton.style.display = 'none';
        
        // Check if all levels completed
        if (currentLevel >= levels.length) {
            gameComplete();
        } else {
            nextLevelBtn.style.display = 'block';
        }
    }
    
    // Game complete
    function gameComplete() {
        // Save the badge as unlocked in localStorage
        localStorage.setItem('Puzzle-badge', 'unlocked');
        
        // Show badge award with animation
        setTimeout(() => {
            showBadgeAward();
        }, 500);
    }
    
    // Start next level
    function startNextLevel() {
        currentLevel++;
        initGame();
    }
    
    // Retry current level
    function retryLevel() {
        initGame();
    }
    
    // Show badge award overlay
    function showBadgeAward() {
        badgeAwardOverlay.style.display = 'flex';
        setTimeout(() => {
            badgeAwardOverlay.style.opacity = 1;
        }, 50);
    }
    
    // Hide badge award overlay
    function hideBadgeAward() {
        badgeAwardOverlay.style.opacity = 0;
        setTimeout(() => {
            badgeAwardOverlay.style.display = 'none';
            // Show the win message after badge animation
            showModal(winMessage);
        }, 500);
    }
    
    // Show modal
    function showModal(modal) {
        modal.style.display = 'flex';
        
        // Add animation class after a short delay to trigger transition
        setTimeout(() => {
            modal.classList.add('active');
            modal.querySelector('.message-content').classList.add('animate-popup');
        }, 50);
    }
    
    // Hide modal
    function hideModal(modal) {
        modal.classList.remove('active');
        modal.querySelector('.message-content').classList.remove('animate-popup');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 500);
    }
    
    // Event listeners
    startButton.addEventListener('click', startLevel);
    checkButton.addEventListener('click', checkPlacements);
    nextLevelBtn.addEventListener('click', startNextLevel);
    retryBtn.addEventListener('click', retryLevel);
    continueBtn.addEventListener('click', hideBadgeAward);
    playAgainButton.addEventListener('click', () => {
        hideModal(winMessage);
        currentLevel = 1;
        initGame();
    });
    
    // Check if badge already unlocked
    if (localStorage.getItem('Puzzle-badge') === 'unlocked') {
    }
    
    // Initialize the game on load
    initGame();
});