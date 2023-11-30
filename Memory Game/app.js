// Array of image paths for the memory game cards
const images = [
    "images/bounty.png",
    "images/daim.png",
    "images/Lion1.png",
    "images/Lion2.png",
    "images/kexch.png",
    "images/Kitkat.png",
    "images/mars.png",
    "images/mm.png",
    "images/tob.png",
    "images/twix.png",
    "images/milky.png",
    "images/snickers.png"
];

// Event listeners for various buttons using querySelector
document.querySelector('#playerVsPlayerBtn').addEventListener('click', selectPlayerVsPlayer);
document.querySelector('#playerVsAIBtn').addEventListener('click', selectPlayerVsAI);
document.querySelector('#startBtn').addEventListener('click', startGame);
document.querySelector('#resetBtn').addEventListener('click', resetGame);
document.querySelector('#returnToMenuBtn').addEventListener('click', returnToStart);
document.querySelector('#resetHighScoreBtn').addEventListener('click', resetHighScore);

// Duplicate the images array to create pairs
const imagesPairs = [...images, ...images];

// DOM elements and variables for game state
const gameBoard = document.querySelector('#game-board');
let cards = [];
let flippedCards = [];
let matchedCards = [];
let currentplayer = 1;
let player1Pairs = 0;
let player2Pairs = 0;
const score1 = document.querySelector('#score1');
const score2 = document.querySelector('#score2');

// Function to start the game
function startGame() {
    resetGame();
    createBoard();
}

// Function to reset the game state
function resetGame() {
    // Reset various game-related variables and elements
    flippedCards = [];
    matchedCards = [];
    currentplayer = 1;
    player1Pairs = 0;
    player2Pairs = 0;
    score1.textContent = "0";
    score2.textContent = "0";
    clearBoard();

    // Show or hide various elements after resetting the game
    document.querySelector('#startBtn').style.display = 'inline-block';
    document.querySelector('#currentPlayerTurn').style.display = 'none';
    document.querySelector('#currentPlayer').style.display = 'none';
    document.querySelector('#player1').style.display = 'none';
    document.querySelector('#player2').style.display = 'none';
    document.querySelector('.scoreboard').style.display = 'none';
    document.querySelector('#resetBtn').style.display = 'none';
}

// Function to create the game board
function createBoard() {
    shuffleCards();
    for (let i = 0; i < 24; i++) {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.image = imagesPairs[i];
        card.addEventListener("click", flipCard);
        gameBoard.appendChild(card);
        cards.push(card);
    }

    shuffleCards(); // Shuffle the cards after creating the initial board
    allowNextFlip(); // Enable click event for the initial state of the board

    // Call makeAIMove if the selected mode is 'ai'
    if (document.querySelector('#mode').value === 'ai') {
        setTimeout(() => {
            makeAIMove();
        }, 0);
    }
}

// Function to shuffle the cards
function shuffleCards() {
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = cards[i].dataset.image;
        cards[i].dataset.image = cards[j].dataset.image;
        cards[j].dataset.image = temp;
    }
}

// Function to clear the game board
function clearBoard() {
    gameBoard.innerHTML = "";
    cards = [];
}

// Function to handle card flipping
function flipCard() {
    if (flippedCards.length < 2 && !matchedCards.includes(this)) {
        this.style.backgroundImage = 'url(' + this.dataset.image + ')';
        flippedCards.push(this);
        this.classList.add('player' + currentplayer);
        this.style.backgroundSize = 'cover';
        this.classList.add('flipped'); // Add flipped class

        if (flippedCards.length === 2) {
            setTimeout(checkMatch, 1000);
        }
    }
}

// Function to check for a match
function checkMatch() {
    if (flippedCards.length === 2) {
        const [card1, card2] = flippedCards;

        // Check if card1 and card2 are valid elements
        if (card1 instanceof HTMLElement && card2 instanceof HTMLElement) {
            const image1 = card1.dataset.image;
            const image2 = card2.dataset.image;

            // Check if dataset.image is defined for both cards
            if (image1 !== undefined && image2 !== undefined) {
                if (image1 === image2) {
                    matchedCards.push(card1, card2);
                    updateScore();
                    checkWin();
                    currentPlayerMatched = true; // Set the flag to true if the match is successful
                } else {
                    setTimeout(() => {
                        card1.classList.remove('flipped');
                        card2.classList.remove('flipped');
                        card1.style.backgroundImage = '';
                        card2.style.backgroundImage = '';

                        switchTurn(); // Switch turn if the match is unsuccessful
                    }, 500);

                    currentPlayerMatched = false; // Set the flag to false if the match is unsuccessful
                }
            } else {
                console.error('Invalid card images. image1:', image1, 'image2:', image2);
            }
        } else {
            console.error('Invalid card elements. card1:', card1, 'card2:', card2);
        }

        flippedCards = [];

        // Check if the current player can continue their turn
        if (currentPlayerMatched) {
            // Continue the turn by allowing another card to be flipped
            currentPlayerMatched = false;
            allowNextFlip();
        }
    }
}

// Function to allow the next card flip
function allowNextFlip() {
    // Enable click event for all cards
    cards.forEach(card => card.addEventListener("click", flipCard));
}

// Function to update the player score
function updateScore() {
    if (currentplayer === 1) {
        player1Pairs++;
        score1.textContent = player1Pairs;
    } else {
        player2Pairs++;
        score2.textContent = player2Pairs;
    }
}

// Function to check if a player has won
function checkWin() {
    if (matchedCards.length === cards.length) {
        alert("Game Over! Player " + ((player1Pairs > player2Pairs) ? 1 : 2) + " wins!");
        updateHighScore(); // Update high score when a player wins
        resetGame();
    }
}

// Function to switch the turn between players
function switchTurn() {
    currentplayer = (currentplayer === 1) ? 2 : 1;

    // Update the current player's turn display
    document.querySelector('#currentPlayer').textContent = (currentplayer === 1) ? player1Name : player2Name;

    if (currentplayer === 2 && document.querySelector('#mode').value === 'ai') {
        // It's the AI's turn, make the move after a short delay
        setTimeout(makeAIMove, 1000);
    }
}

// Function to update the current player's turn display
function updateCurrentPlayerTurn() {
    document.querySelector('#currentPlayerElement').textContent = 'Player ' + currentplayer;
}

// DOM elements for menu-related buttons and containers
const menuButtons = document.querySelector('#menuButtons');
const playerNamesContainer = document.querySelector('#playerNames');
const aiDifficultyContainer = document.querySelector('#aiDifficulty');
const startBtn = document.querySelector('#startBtn');
const resetBtn = document.querySelector('#resetBtn');
const player1 = document.querySelector('#player1');
const player2 = document.querySelector('#player2');
const scoreElement1 = document.querySelector('#score1');
const scoreElement2 = document.querySelector('#score2');
const currentPlayerTurn = document.querySelector('#currentPlayerTurn');
const currentPlayerElement = document.querySelector('#currentPlayer');
let selectedMode = 'player'; // Default value, you can adjust as needed
// Declare currentPlayerName with a default value at the beginning of your script
let currentPlayerName = 'Player 1'; // Adjust the default value as needed

// DOM element for the "Return to Menu" button
const returnToMenuBtn = document.querySelector('#returnToMenuBtn');

// Player names and default values
let player1Name = '';
let player2Name = '';

// Function to select the player vs player mode
function selectPlayerVsPlayer() {
    menuButtons.style.display = 'none';
    playerNamesContainer.style.display = 'flex';
    aiDifficultyContainer.style.display = 'none';
    startBtn.style.display = 'inline-block';
    resetBtn.style.display = 'none';
    player1.style.display = 'none';
    player2.style.display = 'none';
    currentPlayerTurn.style.display = 'none';
    currentPlayerElement.style.display = 'none';
}

// Function to select the player vs AI mode
function selectPlayerVsAI() {
    selectedMode = 'ai'; // Declare and assign a value to selectedMode
    menuButtons.style.display = 'none';
    playerNamesContainer.style.display = 'none';
    aiDifficultyContainer.style.display = 'flex';
    startBtn.style.display = 'inline-block';
    resetBtn.style.display = 'none';
    player1.style.display = 'none';
    player2.style.display = 'none';
}

// Function for the AI to make a move
function makeAIMove() {
    const unflippedCards = cards.filter(card => !card.classList.contains('flipped'));

    if (unflippedCards.length >= 2) {
        const randomIndices = getRandomIndices(unflippedCards, 2);
        const aiCards = [unflippedCards[randomIndices[0]], unflippedCards[randomIndices[1]]];

        for (const aiCard of aiCards) {
            aiCard.click(); // Simulate a click on the AI's chosen cards
        }

        setTimeout(checkMatch, 500); // Check for a match after the AI move is completed
    } else {
        console.log('Not enough unflipped cards left for AI to choose from.');
    }
}

// Helper function to get n random indices from an array
function getRandomIndices(array, n) {
    const shuffledArray = array.slice().sort(() => Math.random() - 0.5);
    return shuffledArray.slice(0, n).map(item => array.indexOf(item));
}

// Function to start the game
function startGame() {
    // Set player names based on user input or default values
    if (selectedMode === 'player') {
        player1Name = document.querySelector('#player1Name').value || 'Player 1';
        player2Name = document.querySelector('#player2Name').value || 'Player 2';
    } else if (selectedMode === 'ai') {
        player1Name = 'Player';
        player2Name = 'AI';
        document.querySelector('#player2').style.display = 'none'; // Hide player 2 in AI mode
        
    }

    // Set the current player to player 1
    currentPlayerName = player1Name;
    document.querySelector('#currentPlayer').textContent = currentPlayerName;

    // Reset various game-related elements and start the game
    document.querySelector('#playerNames').style.display = 'none';
    resetGame();
    createBoard();

    // Get and display the initial high score from local storage
    let highScore = localStorage.getItem('highScore') || 0;

    document.querySelector('#startBtn').style.display = 'none';
    document.querySelector('#resetBtn').style.display = 'inline-block';
    document.querySelector('#player1').style.display = 'inline-block';
    document.querySelector('#player2').style.display = 'inline-block';

    // Set player names for display
    document.querySelector('#player1 h2').textContent = player1Name;
    document.querySelector('#player2 h2').textContent = player2Name;

    scoreElement1.textContent = "0";
    scoreElement2.textContent = "0";

    currentPlayerTurn.style.display = 'flex';
    document.querySelector('#returnToMenuBtn').style.display = 'inline-block';

    // Display the high score in the scoreboard
    document.querySelector('.scoreboard').style.display = 'flex';

    // If the selected mode is 'ai', let the AI take the first turn
    if (selectedMode === 'ai') {
        makeAIMove();
    }
}




// Function to handle the "Return to Menu" button
function returnToStart() {
    console.log('Returning to start...');

    // Reset any necessary game state or variables
    flippedCards = [];
    matchedCards = [];
    currentplayer = 1;
    player1Pairs = 0;
    player2Pairs = 0;
    score1.textContent = "0";
    score2.textContent = "0";

    clearBoard();

    // Reset game-related elements
    document.querySelector('#resetBtn').style.display = 'none';
    document.querySelector('#player1').style.display = 'none';
    document.querySelector('#player2').style.display = 'none';
    document.querySelector('.scoreboard').style.display = 'none';

    // Hide the "Return to Menu" button
    document.querySelector('#returnToMenuBtn').style.display = 'none';

    // Reset the game mode to its default value or the desired value
    selectedMode = 'player'; // Set it to an empty string or 'player', depending on your default mode

    // Hide the current turn display
    document.querySelector('#currentPlayerTurn').style.display = 'none';

    // Show menu-related elements
    document.querySelector('#menuButtons').style.display = 'flex';
    document.querySelector('#playerNames').style.display = 'none';
    document.querySelector('#aiDifficulty').style.display = 'none';
    document.querySelector('#startBtn').style.display = 'none';
}

// Initialize high score from localStorage or set to 0
let highScore = localStorage.getItem('highScore') || 0;
console.log('Initial High Score:', highScore);

// Call this after updating the high score
displayHighScore();

// Function to update the high score
function updateHighScore() {
    const winningPlayerScore = (player1Pairs > player2Pairs) ? player1Pairs : player2Pairs;

    if (winningPlayerScore > highScore) {
        highScore = winningPlayerScore;
        localStorage.setItem('highScore', highScore);
        console.log('New High Score:', highScore);

        // Call the displayHighScore function after updating the high score
        displayHighScore();
    }
}

// Function to display the high score
function displayHighScore() {
    console.log('High Score:', highScore);
    document.getElementById('currentHighScore').textContent = highScore;
    // Add code to display high score in your UI
}

// Function to clear the high score
function clearHighScore() {
    highScore = 0;
    localStorage.removeItem('highScore');
    console.log('High Score Cleared');

    // Call the displayHighScore function after clearing the high score
    displayHighScore();
}

// Function to reset the high score
function resetHighScore() {
    // Reset the high score in localStorage to 0
    highScore = 0;
    localStorage.setItem('highScore', highScore);

    // Update the displayed high score
    displayHighScore();
}

// Add an event listener to the reset high score button
const resetHighScoreBtn = document.getElementById('resetHighScoreBtn');
resetHighScoreBtn.addEventListener('click', resetHighScore);


