// Get references to elements
const startGameButton = document.getElementById('startGame');
const startGameModalButton = document.getElementById('startGameModal');
const closeModal = document.getElementById('closePlayerAddModal');
const closeWinners = document.getElementById('closeWinnerModal');
const playerNameInput = document.getElementById('playerInput');
const addPlayerButton = document.getElementById('addPlayer');
const actionDropdown = document.getElementById('actionDropdown');
const submitActionButton = document.getElementById('submitAction');
const ballTypeLabel = document.getElementById('ballTypeLabel');
const totalPlayers = document.getElementById('totalPlayers');

// Array to store player names
const players = [];

// Variables to keep track of ball types and scores
let ballType = "Stripes"; // Initial ball type
let stripesLeft = 7; // Number of stripes left on the table
let solidsLeft = 7; // Number of solids left on the table

let isGameOver = false;

// Function to clear table data
function clearTable() {
    const tbody = document.querySelector('tbody');
    tbody.innerHTML = '';
}

// Function to open the player input modal
function openModal() {
    players.length = 0; // Clear the player list
    renderPlayers();
	startGameModalButton.setAttribute('disabled', 'true');
    const modal = document.getElementById('playerAddModal');
    modal.style.display = 'block';
}

// Function to close the player input modal
function closeModalFunc() {
    const modal = document.getElementById('playerAddModal');
    modal.style.display = 'none';
}

// Function to close the player input modal
function closeWinnerFunc() {
    const modal = document.getElementById('winnerModal');
    modal.style.display = 'none';
}

// Function to add a player to the list
function addPlayer() {
    const playerName = playerNameInput.value.trim();
    if (playerName !== '') {
        players.push(playerName);
        playerNameInput.value = '';
        renderPlayers();
		totalPlayers.textContent = players.length;
		
        if (players.length >= 3 && players.length <= 11) {
            startGameModalButton.removeAttribute('disabled');
            addPlayerButton.removeAttribute('disabled'); // Enable the "Add Player" button
        } else {
            startGameModalButton.setAttribute('disabled', 'true');
        }
		
		if (players.length == 11) {
            addPlayerButton.setAttribute('disabled', 'true'); 
        }
    }
}

// Function to render the list of players
function renderPlayers() {
    const playerList = document.querySelector('.player-list');
    playerList.innerHTML = '<h3>Player List:</h3>';
    players.forEach((player, index) => {
        const listItem = document.createElement('p');
        listItem.textContent = `${index + 1}. ${player}`;
        playerList.appendChild(listItem);
    });
}

// Function to start a new game
function startNewGame() {
	isGameOver = false;
	submitActionButton.removeAttribute('disabled');
	actionDropdown.removeAttribute('disabled');
    clearTable();
    players.forEach((player) => {
        const tbody = document.querySelector('tbody');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td></td>
            <td>${player}</td>
            <td>0</td>
            <td>0</td>
        `;
        tbody.appendChild(row);
    });
    closeModalFunc();
    actionDropdown.removeAttribute('disabled');
    submitActionButton.removeAttribute('disabled');
	
	const gameArea = document.querySelector('.gameArea');
    gameArea.style.display = 'block';

    // Highlight the first player's turn
    highlightPlayer(0);
}

// Function to highlight the current player's turn
function highlightPlayer(currentIndex) {
    const rows = document.querySelectorAll('tbody tr');
    rows.forEach((row, index) => {
        if (index === currentIndex) {
            row.classList.add('current-player'); // Add the class to the current player's row
        } else {
            row.classList.remove('current-player'); // Remove the class from other rows
        }
    });
}

// Function to update the ball type label
function updateBallTypeLabel() {
    ballTypeLabel.textContent = `Current Ball Type: ${ballType}`;
}

function EndTurn()
{
		// Get the current player's row
        const rows = document.querySelectorAll('tbody tr');
        const currentPlayerRow = rows[currentPlayerIndex];
		
        // Move to the next player's turn
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;

        // Highlight the next player's turn
        highlightPlayer(currentPlayerIndex);
}


function CheckHighest(currentPlayerRow, currentScore) {
    let currentHighestScore = parseInt(currentPlayerRow.querySelector('td:nth-child(4)').textContent);
	currentHighestScore = currentScore > currentHighestScore ? currentScore : currentHighestScore;
	currentPlayerRow.querySelector('td:nth-child(4)').textContent = currentHighestScore;
}

// Event listener for "Add Player" button click
addPlayerButton.addEventListener('click', addPlayer);

// Event listener for "Start Game" button click in the modal
startGameModalButton.addEventListener('click', () => {
    if (players.length >= 3 && players.length <= 11) {
		ballType = "/";
        startNewGame();
        highlightPlayer(0); // Call this to highlight the first player's row
        updateBallTypeLabel(); // Initialize the ball type label
    } else {
        alert('Please add between 3 to 11 players before starting the game.');
    }
});

function highlightHighestScorer() {
    const rows = document.querySelectorAll('tbody tr');

    // Find the highest score and the highest highest score
    let highestScore = -1;
    let highestHighestScore = -1;

    rows.forEach((row) => {
        const score = parseInt(row.querySelector('td:nth-child(3)').textContent);
        const highest = parseInt(row.querySelector('td:nth-child(4)').textContent);

        highestScore = Math.max(highestScore, score);
        highestHighestScore = Math.max(highestHighestScore, highest);
    });

    // Remove previous gold dots
    rows.forEach((row) => {
        const firstColumn = row.querySelector('td:first-child');
        firstColumn.innerHTML = '';
    });
	
	if (highestScore !== 0) 
	{
		// Highlight the highest scorer(s)
		rows.forEach((row) => {
			const score = parseInt(row.querySelector('td:nth-child(3)').textContent);
			const highest = parseInt(row.querySelector('td:nth-child(4)').textContent);

			if (score === highestScore && highest === highestHighestScore) {
				const firstColumn = row.querySelector('td:first-child');
				const animatedDot = document.createElement('div');
				animatedDot.className = 'animated-dot';
				firstColumn.appendChild(animatedDot);
			}
		});
	}
	else if(highestHighestScore !== 0) 
	{
		// Highlight the highest scorer(s)
		rows.forEach((row) => {
			const score = parseInt(row.querySelector('td:nth-child(3)').textContent);
			const highest = parseInt(row.querySelector('td:nth-child(4)').textContent);

			if (score === highestScore && highest === highestHighestScore) {
				const firstColumn = row.querySelector('td:first-child');
				const animatedDot = document.createElement('div');
				animatedDot.className = 'animated-dot';
				firstColumn.appendChild(animatedDot);
			}
		});
	}
}

function EndGame() {
	isGameOver = true;
	ballTypeLabel.textContent = "GAME OVER";
	submitActionButton.setAttribute('disabled', 'true'); 
	actionDropdown.setAttribute('disabled', 'true'); 
    // Array to store winners
    const winners = [];

     // Iterate through player rows
    const rows = document.querySelectorAll('tbody tr');
    rows.forEach((row) => {
        const playerName = row.querySelector('td:nth-child(2)').textContent;
		const playerScore = row.querySelector('td:nth-child(3)').textContent;
		const playerHighestScore = row.querySelector('td:nth-child(4)').textContent;
        const hasAnimatedDot = row.querySelector('.animated-dot');

        if (hasAnimatedDot) {
		winners.push(`${playerName} | Score: ${playerScore} | Highest Score: ${playerHighestScore}`);
        }
    });

    // Get the winner modal and winners list element
    const winnerModal = document.getElementById('winnerModal');
    const winnersList = document.getElementById('winnersList');

    // Clear previous winners
    while (winnersList.firstChild) {
        winnersList.removeChild(winnersList.firstChild);
    }

    // Display the winners in the modal
    winners.forEach((winner) => {
        const listItem = document.createElement('p');
        listItem.textContent = winner;
        winnersList.appendChild(listItem);
    });

    // Show the winner modal
    winnerModal.style.display = 'block';
}


// Event listener for "Start New Game" button click
startGameButton.addEventListener('click', () => {
    openModal();

    
});

// Define a variable to keep track of the current player's index
let currentPlayerIndex = 0;

// Event listener for "Submit Action" button click
submitActionButton.addEventListener('click', () => {
    const selectedAction = actionDropdown.value;
    
    // Check if the selected action is "Miss"
    if (selectedAction === "Miss") {
        // Get the current player's row
        const rows = document.querySelectorAll('tbody tr');
        const currentPlayerRow = rows[currentPlayerIndex];

        // Calculate the current player's new score
        let currentScore = parseInt(currentPlayerRow.querySelector('td:nth-child(3)').textContent);
        currentScore = Math.max(currentScore - 10, 0); // Minimum score capped at 0

        // Update the current player's score
        currentPlayerRow.querySelector('td:nth-child(3)').textContent = currentScore;

        // Move to the next player's turn
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;

        // Highlight the next player's turn
        highlightPlayer(currentPlayerIndex);
	} else if (selectedAction === "Sink White") {
        // Get the current player's row
        const rows = document.querySelectorAll('tbody tr');
        const currentPlayerRow = rows[currentPlayerIndex];

        // Calculate the current player's new score
        let currentScore = parseInt(currentPlayerRow.querySelector('td:nth-child(3)').textContent);
        currentScore = Math.max(currentScore - 20, 0); // Minimum score capped at 0

        // Update the current player's score
        currentPlayerRow.querySelector('td:nth-child(3)').textContent = currentScore;

        // Move to the next player's turn
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;

        // Highlight the next player's turn
        highlightPlayer(currentPlayerIndex);
		
    } else if (selectedAction === "Sink Black") {
        const currentPlayerRow = document.querySelectorAll('tbody tr')[currentPlayerIndex];
        let currentScore = parseInt(currentPlayerRow.querySelector('td:nth-child(3)').textContent);
        currentScore += ballType === "Black" ? 20 : -currentScore;
		if (currentScore < 0) {
			currentScore = 0; // Ensure the score never goes below 0
		}
		
		CheckHighest(currentPlayerRow, currentScore);
		
        currentPlayerRow.querySelector('td:nth-child(3)').textContent = currentScore;
		
		highlightHighestScorer();
		EndGame();
		
    }	else if (selectedAction === "Sink White & Black") {
        // Get the current player's row
        const rows = document.querySelectorAll('tbody tr');
        const currentPlayerRow = rows[currentPlayerIndex];

        currentScore = 0;

        // Update the current player's score
        currentPlayerRow.querySelector('td:nth-child(3)').textContent = currentScore;

		highlightHighestScorer();
		EndGame();
	   
    }	else if (selectedAction === "Sink Stripe") {
        stripesLeft--;
		ballType = ballType === "/" ? "Stripes" : ballType
		let lastType = ballType;
		if (stripesLeft <= 0) {
			ballType = solidsLeft > 0 ? "Solids" : "Black";
			submitActionButton.setAttribute('disabled', 'true');
		}
        updateBallTypeLabel();
        const currentPlayerRow = document.querySelectorAll('tbody tr')[currentPlayerIndex];
        let currentScore = parseInt(currentPlayerRow.querySelector('td:nth-child(3)').textContent);
        currentScore += ballType === "Stripes" ? 10 : -10;
		if (currentScore < 0) {
			currentScore = 0; // Ensure the score never goes below 0
		}
		CheckHighest(currentPlayerRow, currentScore);
		
        currentPlayerRow.querySelector('td:nth-child(3)').textContent = currentScore;
		
		if(lastType != "Stripes")
		{
			EndTurn();
		}
    } else if (selectedAction === "Sink Solid") {
        solidsLeft--;
		ballType = ballType === "/" ? "Solids" : ballType
		let lastType = ballType;
		if (solidsLeft <= 0) {
			ballType = stripesLeft > 0 ? "Stripes" : "Black";
			submitActionButton.setAttribute('disabled', 'true');
		}
        updateBallTypeLabel();
        const currentPlayerRow = document.querySelectorAll('tbody tr')[currentPlayerIndex];
        let currentScore = parseInt(currentPlayerRow.querySelector('td:nth-child(3)').textContent);
        currentScore += ballType === "Solids" ? 10 : -10;
		if (currentScore < 0) {
			currentScore = 0; // Ensure the score never goes below 0
		}
		CheckHighest(currentPlayerRow, currentScore);
		
        currentPlayerRow.querySelector('td:nth-child(3)').textContent = currentScore;
		
		if(lastType != "Solids")
		{
			EndTurn();
		}
    } else if (selectedAction === "Touch Solid") {
        const currentPlayerRow = document.querySelectorAll('tbody tr')[currentPlayerIndex];
        let currentScore = parseInt(currentPlayerRow.querySelector('td:nth-child(3)').textContent);
        currentScore += ballType === "Solids" ? 0 : -10;
		if (currentScore < 0) {
			currentScore = 0; // Ensure the score never goes below 0
		}
        currentPlayerRow.querySelector('td:nth-child(3)').textContent = currentScore;
		
		EndTurn();
		
    } else if (selectedAction === "Touch Stripe") {
        const currentPlayerRow = document.querySelectorAll('tbody tr')[currentPlayerIndex];
        let currentScore = parseInt(currentPlayerRow.querySelector('td:nth-child(3)').textContent);
        currentScore += ballType === "Stripes" ? 0 : -10;
		if (currentScore < 0) {
			currentScore = 0; // Ensure the score never goes below 0
		}
        currentPlayerRow.querySelector('td:nth-child(3)').textContent = currentScore;
		
		EndTurn();
		
    } else if (selectedAction === "Touch Black") {
        const currentPlayerRow = document.querySelectorAll('tbody tr')[currentPlayerIndex];
        let currentScore = parseInt(currentPlayerRow.querySelector('td:nth-child(3)').textContent);
        currentScore += ballType === "Black" ? 0 : -10;
		if (currentScore < 0) {
			currentScore = 0; // Ensure the score never goes below 0
		}
        currentPlayerRow.querySelector('td:nth-child(3)').textContent = currentScore;
		
		EndTurn();
		
    }
	
	// Call the function to highlight the highest scorer(s)
	highlightHighestScorer();
    
});

// Event listener for changes in the selected action
actionDropdown.addEventListener('change', () => {
    const selectedAction = actionDropdown.value;

    // Check if the selected action contains "Stripe" and there are no stripes left
    if (selectedAction.includes("Stripe") && stripesLeft <= 0) {
        submitActionButton.setAttribute('disabled', 'true');
    }
    // Check if the selected action contains "Solid" and there are no solids left
    else if (selectedAction.includes("Solid") && solidsLeft <= 0) {
        submitActionButton.setAttribute('disabled', 'true');
    } 
    // Enable the submit button for other cases
    else {
        submitActionButton.removeAttribute('disabled');
    }
});

closeModal.addEventListener('click', () => {
    closeModalFunc();
});

closeWinners.addEventListener('click', () => {
    closeWinnerFunc();
});
