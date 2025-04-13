document.addEventListener('DOMContentLoaded', function() {
    const words = [
        'CASA', 'ESCUELA', 'FAMILIA', 'AMIGO', 'NIÑO',
        'PERRO', 'GATO', 'LECHE', 'AGUA', 'SOL'
    ];
    
    const gridSize = 10;
    let grid = [];
    let selectedCells = [];
    let firstSelectedCell = null;
    let foundWords = [];
    let selectionInProgress = false;
    
    const directions = [
        [0, 1],   // right
        [1, 0],   // down
        [1, 1],   // diagonal down-right
        [-1, 1],  // diagonal up-right
        [0, -1],  // left
        [-1, 0],  // up
        [-1, -1], // diagonal up-left
        [1, -1]   // diagonal down-left
    ];
    
    // Initialize the grid with empty cells
    function initializeGrid() {
        grid = Array(gridSize).fill().map(() => Array(gridSize).fill(''));
        
        // Place words in random positions and directions
        words.forEach(word => {
            let placed = false;
            let attempts = 0;
            
            while (!placed && attempts < 100) {
                attempts++;
                
                // Choose random direction
                const dirIndex = Math.floor(Math.random() * directions.length);
                const [dx, dy] = directions[dirIndex];
                
                // Choose random starting position
                const row = Math.floor(Math.random() * gridSize);
                const col = Math.floor(Math.random() * gridSize);
                
                // Check if word fits in this position and direction
                if (wordFits(word, row, col, dx, dy)) {
                    placeWord(word, row, col, dx, dy);
                    placed = true;
                }
            }
            
            // If we couldn't place the word after 100 attempts, try again with a different grid
            if (!placed) {
                initializeGrid(); 
                return;
            }
        });
        
        // Fill empty cells with random letters
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                if (grid[i][j] === '') {
                    const randomChar = String.fromCharCode(65 + Math.floor(Math.random() * 26));
                    grid[i][j] = randomChar;
                }
            }
        }
        
        renderGrid();
        renderWordList();
    }
    
    // Check if a word fits in the grid at the given position and direction
    function wordFits(word, row, col, dx, dy) {
        const length = word.length;
        
        // Check if word goes out of bounds
        if (
            row + dx * (length - 1) < 0 ||
            row + dx * (length - 1) >= gridSize ||
            col + dy * (length - 1) < 0 ||
            col + dy * (length - 1) >= gridSize
        ) {
            return false;
        }
        
        // Check if all cells are empty or match the corresponding letter
        for (let i = 0; i < length; i++) {
            const r = row + dx * i;
            const c = col + dy * i;
            
            if (grid[r][c] !== '' && grid[r][c] !== word[i]) {
                return false;
            }
        }
        
        return true;
    }
    
    // Place a word in the grid
    function placeWord(word, row, col, dx, dy) {
        for (let i = 0; i < word.length; i++) {
            const r = row + dx * i;
            const c = col + dy * i;
            grid[r][c] = word[i];
        }
    }
    
    // Render the grid in the HTML
    function renderGrid() {
        const wordGrid = document.getElementById('wordGrid');
        wordGrid.innerHTML = '';
        
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.textContent = grid[i][j];
                cell.dataset.row = i;
                cell.dataset.col = j;
                
                // Use touchend instead of click to avoid stuck issues
                cell.addEventListener('touchend', function(e) {
                    e.preventDefault(); // Prevent default touch behavior
                    handleCellSelection(this);
                });
                
                // Also keep click event for non-touch devices
                cell.addEventListener('click', function(e) {
                    handleCellSelection(this);
                });
                
                wordGrid.appendChild(cell);
            }
        }
    }
    
    // Handle cell selection
    function handleCellSelection(cell) {
        // Prevent rapid consecutive taps
        if (selectionInProgress) return;
        selectionInProgress = true;
        
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        
        // If this is the first selection
        if (!firstSelectedCell) {
            // Clear any previous selection
            clearSelection();
            
            // Set this as the first selected cell
            firstSelectedCell = { row, col, element: cell };
            cell.classList.add('selected');
            cell.classList.add('first-selected');
            
            // Release lock after a short delay
            setTimeout(() => {
                selectionInProgress = false;
            }, 300);
        } 
        // If this is the second selection
        else {
            const firstRow = firstSelectedCell.row;
            const firstCol = firstSelectedCell.col;
            
            // If the same cell is clicked again, just clear selection and exit
            if (row === firstRow && col === firstCol) {
                clearSelection();
                selectionInProgress = false;
                return;
            }
            
            // Determine the direction from first to second cell
            let dx = 0;
            let dy = 0;
            
            if (row !== firstRow) {
                dx = (row - firstRow) / Math.abs(row - firstRow);
            }
            
            if (col !== firstCol) {
                dy = (col - firstCol) / Math.abs(col - firstCol);
            }
            
            // Check if it's a valid line (horizontal, vertical, or diagonal)
            if (dx !== 0 && dy !== 0 && Math.abs(row - firstRow) !== Math.abs(col - firstCol)) {
                clearSelection();
                selectionInProgress = false;
                return;
            }
            
            // Calculate how many steps between the points
            const steps = Math.max(Math.abs(row - firstRow), Math.abs(col - firstCol));
            
            // Add cells to the selection (starting with first cell)
            selectedCells = [firstSelectedCell];
            
            // Fill in all cells between the first and second cell
            for (let i = 1; i <= steps; i++) {
                const r = firstRow + dx * i;
                const c = firstCol + dy * i;
                
                if (r < 0 || r >= gridSize || c < 0 || c >= gridSize) {
                    continue; // Skip if out of bounds
                }
                
                // Find the cell element
                const cellElement = document.querySelector(`.grid-cell[data-row="${r}"][data-col="${c}"]`);
                if (cellElement) {
                    selectedCells.push({ row: r, col: c, element: cellElement });
                    cellElement.classList.add('selected');
                }
            }
            
            // Check if the selection forms a word
            setTimeout(() => {
                checkSelectedWord();
                selectionInProgress = false;
            }, 300);
        }
    }
    
    // Render the word list
    function renderWordList() {
        const wordList = document.getElementById('wordList');
        wordList.innerHTML = '';
        
        words.forEach(word => {
            const wordItem = document.createElement('div');
            wordItem.className = 'word-item';
            wordItem.textContent = word;
            wordItem.dataset.word = word;
            
            if (foundWords.includes(word)) {
                wordItem.classList.add('found');
            }
            
            wordList.appendChild(wordItem);
        });
    }
    
    // Check if selected cells form a valid word
    function checkSelectedWord() {
        if (selectedCells.length < 2) return;
        
        // Get the word from selected cells
        const word = selectedCells.map(cell => {
            return grid[cell.row][cell.col];
        }).join('');
        
        const reverseWord = word.split('').reverse().join('');
        
        // Check if the word is in our list and not already found
        if (words.includes(word) && !foundWords.includes(word)) {
            markWordFound(word);
        }
        else if (words.includes(reverseWord) && !foundWords.includes(reverseWord)) {
            markWordFound(reverseWord);
        }
        else {
            setTimeout(() => {
                clearSelection();
            }, 500);
        }
    }
    
    // Mark a word as found
    function markWordFound(word) {
        foundWords.push(word);
        
        // Mark cells as found
        selectedCells.forEach(cell => {
            cell.element.classList.remove('selected');
            cell.element.classList.remove('first-selected');
            cell.element.classList.add('found');
        });
        
        // Update word list
        const wordItem = document.querySelector(`.word-item[data-word="${word}"]`);
        if (wordItem) {
            wordItem.classList.add('found');
        }
        
        // Reset selection state
        selectedCells = [];
        firstSelectedCell = null;
        
        // Check if all words are found
        if (foundWords.length === words.length) {
            setTimeout(() => {
                localStorage.setItem('Spanish-badge', 'unlocked');
                showBadgeAward();
            }, 500);
        }
    }
    
    // Clear the current selection
    function clearSelection() {
        if (firstSelectedCell && firstSelectedCell.element) {
            firstSelectedCell.element.classList.remove('first-selected');
        }
        
        document.querySelectorAll('.grid-cell.selected').forEach(cell => {
            cell.classList.remove('selected');
        });
        
        selectedCells = [];
        firstSelectedCell = null;
    }
    
    // Reset the game
    function resetGame() {
        foundWords = [];
        clearSelection();
        initializeGrid();
    }
    
    // Show badge award animation
    function showBadgeAward() {
        const badgeAwardOverlay = document.getElementById('badgeAwardOverlay');
        badgeAwardOverlay.style.display = 'flex';
        setTimeout(() => {
            badgeAwardOverlay.style.opacity = 1;
        }, 50);
    }
    
    // Hide badge award
    function hideBadgeAward() {
        const badgeAwardOverlay = document.getElementById('badgeAwardOverlay');
        badgeAwardOverlay.style.opacity = 0;
        setTimeout(() => {
            badgeAwardOverlay.style.display = 'none';
            showModal(document.getElementById('winMessage'));
        }, 500);
    }
    
    // Show modal
    function showModal(modal) {
        modal.style.display = 'flex';
        
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
    
    // Add touchend handler to clear selection if user taps elsewhere
    document.addEventListener('touchend', function(e) {
        // If tap is outside the grid and we have a first selection
        if (firstSelectedCell && !e.target.closest('#wordGrid')) {
            clearSelection();
            selectionInProgress = false;
        }
    });
    
    // Initialize the game
    initializeGrid();
    
    // Event listeners
    document.getElementById('reset-button').addEventListener('click', resetGame);
    document.getElementById('continueBtn').addEventListener('click', function() {
        hideBadgeAward();
    });
    document.getElementById('playAgain').addEventListener('click', function() {
        hideModal(document.getElementById('winMessage'));
    });
    
    // Check if badge already unlocked
    if (localStorage.getItem('Spanish-badge') === 'unlocked') {
        console.log('Badge already unlocked!');
    }
});