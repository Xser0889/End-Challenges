// Google Sheet Web App URL
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbzJEfZnRBthVLr7EyO9tI6286xV6GTVQ4RzjDdRPM1ywhG69_DqdJ34qoya7WbEmCGK/exec';
        
// Badge panel functionality
const badgeButton = document.getElementById('badge-button');
const badgePanel = document.getElementById('badge-panel');
const closePanel = document.getElementById('close-panel');
const overlay = document.getElementById('overlay');

badgeButton.addEventListener('click', function() {
    badgePanel.classList.add('open');
    overlay.classList.add('active');
    badgeButton.classList.add('hidden'); 
    updateBadgeCounter();
});

closePanel.addEventListener('click', function() {
    badgePanel.classList.remove('open');
    overlay.classList.remove('active');
    badgeButton.classList.remove('hidden'); 
});

overlay.addEventListener('click', function() {
    badgePanel.classList.remove('open');
    overlay.classList.remove('active');
    badgeButton.classList.remove('hidden');
    leaderboardPanel.classList.remove('open');
    leaderboardButton.classList.remove('hidden');
});

function updateBadgeStatus() {
    const badges = ['Math-badge', 'Langaje-arts-badge', 'Reading-badge', 'Spanish-badge', 'clover-badge', 'Puzzle-badge'];
    let unlockedCount = 0;
    
    badges.forEach(badge => {
        if(localStorage.getItem(badge) === 'unlocked') {
            // Handle main badges if they exist (they don't seem to in your HTML)
            if (document.getElementById(badge)) {
                document.getElementById(badge).classList.add('unlocked');
                document.getElementById(badge).querySelector('.badge-status').textContent = 'Unlocked';
            }
            
            let panelBadgeId;
            
            // Map the localStorage keys to the actual panel IDs in your HTML
            switch(badge) {
                case 'Math-badge':
                    panelBadgeId = 'panel-math-badge';
                    break;
                case 'Langaje-arts-badge':
                    panelBadgeId = 'panel-language-arts-badge';
                    break;
                case 'Reading-badge':
                    panelBadgeId = 'panel-reading-badge';
                    break;
                case 'Spanish-badge':
                    panelBadgeId = 'panel-Spanish-badge';
                    break;
                case 'clover-badge':
                    panelBadgeId = 'panel-Clover-says-badge';
                    break;
                case 'Puzzle-badge':
                    panelBadgeId = 'panel-puzzle-badge';
                    break;
                default:
                    panelBadgeId = '';
            }
            
            if (document.getElementById(panelBadgeId)) {
                document.getElementById(panelBadgeId).classList.add('unlocked');
                document.getElementById(panelBadgeId).querySelector('.panel-badge-status').textContent = 'Unlocked';
                unlockedCount++;
            }
        }
    });
    
    return unlockedCount;
}

function updateBadgeCounter() {
    const unlockedCount = updateBadgeStatus();
    document.getElementById('collected-count').textContent = unlockedCount;
    document.getElementById('progress').style.width = (unlockedCount / 6) * 100 + '%';

    document.getElementById('circular-count').textContent = unlockedCount;

    const circle = document.querySelector('.progress-ring-circle');
    const radius = circle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (unlockedCount / 6) * circumference;
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = offset;
    
    updateLeaderboardProgress();
    
    return unlockedCount;
}

// Leaderboard functionality
const leaderboardButton = document.getElementById('leaderboard-button');
const leaderboardPanel = document.getElementById('leaderboard-panel');
const closeLeaderboard = document.getElementById('close-leaderboard');
const refreshLeaderboard = document.getElementById('refresh-leaderboard');

leaderboardButton.addEventListener('click', function() {
    leaderboardPanel.classList.add('open');
    overlay.classList.add('active');
    leaderboardButton.classList.add('hidden');
    loadLeaderboard();
});

closeLeaderboard.addEventListener('click', function() {
    leaderboardPanel.classList.remove('open');
    overlay.classList.remove('active');
    leaderboardButton.classList.remove('hidden');
});

refreshLeaderboard.addEventListener('click', function() {
    const leaderboardData = document.getElementById('leaderboard-data');
    leaderboardData.innerHTML = '<tr class="loading-row"><td colspan="3">Refreshing data...</td></tr>';
    loadLeaderboard();
});

// Function to load leaderboard data from Google Sheets
function loadLeaderboard() {
    const leaderboardData = document.getElementById('leaderboard-data');
    leaderboardData.innerHTML = '<tr class="loading-row"><td colspan="3">Loading data...</td></tr>';

    fetch(GOOGLE_SHEET_URL + '?action=getData')
    .then(response => {
        if (!response.ok && response.type !== 'opaque') {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        displayLeaderboard(data);
    })
    .catch(error => {
        console.error('Error loading leaderboard:', error);
        leaderboardData.innerHTML = 
            '<tr class="error-row"><td colspan="3">Error loading leaderboard data. Please try again.</td></tr>';
    });
}

// Function to display leaderboard data
function displayLeaderboard(data) {
    const leaderboardData = document.getElementById('leaderboard-data');
    
    // Sort data - now the sorting happens on the server with our new logic
    data.sort((a, b) => {
        if (b.badgeCount !== a.badgeCount) {
            return b.badgeCount - a.badgeCount;
        } else if (a.badgeCount === 6 && b.badgeCount === 6) {
            // If both have 6 badges, sort by timestamp (earliest timestamp first)
            return a.completionTimestamp - b.completionTimestamp;
        }
        return 0;
    });
    
    if (data.length === 0) {
        leaderboardData.innerHTML = '<tr><td colspan="3">No data available</td></tr>';
        return;
    }
    
    let html = '';
    data.forEach((player, index) => {
        const rankClass = index < 3 ? `rank-${index + 1}` : '';
        html += `
            <tr class="${rankClass}">
                <td>${index + 1}</td>
                <td>${player.username}</td>
                <td>${player.badgeCount}/6</td>
            </tr>
        `;
    });
    
    leaderboardData.innerHTML = html;
}

// Function to update player progress in the leaderboard
function updateLeaderboardProgress() {
    const username = localStorage.getItem('username');
    const badgeCount = updateBadgeStatus();

    if (username) {
        const data = {
            username: username,
            badgeCount: badgeCount
        };

        // Log data before sending
        console.log('Attempting to send data to leaderboard:', data);

        // Use no-cors mode to handle potential CORS issues
        fetch(GOOGLE_SHEET_URL + '?action=updateData', {
            method: 'POST',
            mode: 'no-cors', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            console.log('Response received:', response);
            // Note: With 'no-cors', we can't access the response content
            console.log('Leaderboard update request sent successfully');
        })
        .catch(error => {
            console.error('Error updating leaderboard:', error);
            // Add a retry mechanism with progressive backoff
            setTimeout(() => {
                console.log('Retrying update...');
                updateLeaderboardProgress();
            }, 5000); 
        });
    } else {
        console.warn('No username found in localStorage - can\'t update leaderboard');
    }
}

// Congratulation message for all badges
document.addEventListener('DOMContentLoaded', function() {
    const completeCollectionOverlay = document.getElementById('completeCollectionOverlay');
    const closeCompletionBtn = document.getElementById('closeCompletionBtn');
    
    // Check if all badges are collected
    checkForAllBadges();
    
    function checkForAllBadges() {
        const badges = ['Math-badge', 'Langaje-arts-badge', 'Reading-badge', 'Spanish-badge', 'clover-badge', 'Puzzle-badge'];
        let collectedCount = 0;
        
        badges.forEach(badge => {
            if(localStorage.getItem(badge) === 'unlocked') {
                collectedCount++;
            }
        });
        
        // If all badges are collected (6 badges)
        if(collectedCount === 6) {
            // Set badge animation delays
            const collectionBadges = document.querySelectorAll('.collection-badge');
            collectionBadges.forEach((badge, index) => {
                badge.style.setProperty('--i', index);
            });
            
            // Show congratulation message
            showCompletionMessage();
        }
    }
    
    function showCompletionMessage() {
        completeCollectionOverlay.style.display = 'flex';
    }
    
    closeCompletionBtn.addEventListener('click', function() {
        completeCollectionOverlay.style.display = 'none';
    });
});

// Username functionality
document.addEventListener('DOMContentLoaded', function() {
    const usernameModal = document.getElementById('username-modal');
    const usernameForm = document.getElementById('username-form');
    const usernameInput = document.getElementById('username-input');
    const usernameDisplay = document.getElementById('username-display');
    
    // Check if username exists in localStorage
    if (!localStorage.getItem('username')) {
        // If no username, show the modal
        usernameModal.style.display = 'flex';
    } else {
        // If username exists, display it
        displayUsername();
    }
    
    // Handle form submission
    usernameForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = usernameInput.value.trim();
        
        if (username) {
            // Save username to localStorage
            localStorage.setItem('username', username);
            
            // Close the modal
            usernameModal.style.display = 'none';
            
            // Display the username
            displayUsername();
            
            // Initialize leaderboard with the new user
            updateLeaderboardProgress();
        }
    });
    
    // Function to display username
    function displayUsername() {
        const username = localStorage.getItem('username');
        if (username) {
            usernameDisplay.textContent = username;
            document.getElementById('welcome-message').style.display = 'block';
        }
    }
});

// Update badges and leaderboard on page load
window.onload = function() {
    updateBadgeCounter();
    
    // Force update to leaderboard on every page load to ensure data is synced
    setTimeout(() => {
        forceLeaderboardUpdate();
    }, 1000); 
};

// Function to force an update to the leaderboard
function forceLeaderboardUpdate() {
    const username = localStorage.getItem('username');
    const badgeCount = updateBadgeStatus();
    
    if (username) {
        console.log('Forcing leaderboard update for', username, 'with badge count', badgeCount);
        
        const data = {
            username: username,
            badgeCount: badgeCount
        };
        
        // Use a different approach for more reliable updating
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = GOOGLE_SHEET_URL + '?action=updateData';
        form.target = 'hidden-iframe';
        
        // Create hidden iframe to receive response
        let iframe = document.getElementById('hidden-iframe');
        if (!iframe) {
            iframe = document.createElement('iframe');
            iframe.name = 'hidden-iframe';
            iframe.id = 'hidden-iframe';
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
        }
        
        // Add data as hidden inputs
        const usernameInput = document.createElement('input');
        usernameInput.type = 'hidden';
        usernameInput.name = 'username';
        usernameInput.value = username;
        form.appendChild(usernameInput);
        
        const badgeInput = document.createElement('input');
        badgeInput.type = 'hidden';
        badgeInput.name = 'badgeCount';
        badgeInput.value = badgeCount;
        form.appendChild(badgeInput);
        
        // Add stringified JSON data too (as a backup)
        const jsonData = document.createElement('input');
        jsonData.type = 'hidden';
        jsonData.name = 'jsonData';
        jsonData.value = JSON.stringify(data);
        form.appendChild(jsonData);
        
        // Submit form
        document.body.appendChild(form);
        form.submit();
        
        // Remove form after submission
        setTimeout(() => {
            document.body.removeChild(form);
        }, 1000);
    }
}