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

// Duplicate the images array to create pairs
const imagesPairs = [...images, ...images];

const gameBoard = document.getElementById('game-board');
let cards = [];
let flippedCards = [];
let matchedCards = [];
let currentplayer = 1;
let player1Pairs = 0;
let player2Pairs = 0;
const score1 = document.getElementById('score1');
const score2 = document.getElementById('score2');
 
function startGame() {
    resetGame();
    createBoard();
}

function resetGame() {
    flippedCards = [];
    matchedCards = [];
    currentplayer = 1;
    player1Pairs = 0;
    player2Pairs = 0;
    score1.textContent = "0";
    score2.textContent = "0";
    clearBoard();

     // Show the "Start Game" button after resetting the game
    startBtn.style.display = 'inline-block';
    currentPlayerTurn.style.display = 'none';
    currentPlayerElement.style.display = 'none';
    player1.style.display = 'none';
    player2.style.display = 'none';
    document.querySelector('.scoreboard').style.display = 'none';
    resetBtn.style.display = 'none';
    
    
}

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
    if (document.getElementById('mode').value === 'ai') {
        setTimeout(() => {
            makeAIMove();
        }, 0);
    }
}



function shuffleCards() {
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = cards[i].dataset.image;
        cards[i].dataset.image = cards[j].dataset.image;
        cards[j].dataset.image = temp;
    }
}

function clearBoard() {
    gameBoard.innerHTML = "";
    cards = [];
}





function flipCard() {
    if (flippedCards.length < 2 && !matchedCards.includes(this)) {
        this.style.backgroundImage = 'url(' + this.dataset.image +')';
        flippedCards.push(this);
        this.classList.add('player' + currentplayer);
        this.style.backgroundSize = 'cover';
        this.classList.add('flipped'); // Add flipped class

        if (flippedCards.length === 2) {
            setTimeout(checkMatch, 1000);
        }
    }
}



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



function allowNextFlip() {
    // Enable click event for all cards
    cards.forEach(card => card.addEventListener("click", flipCard));
}



function updateScore() {
    if (currentplayer === 1) {
        player1Pairs++;
        score1.textContent = player1Pairs;
    } else {
        player2Pairs++;
        score2.textContent = player2Pairs;
    }
}

function checkWin() {
    if (matchedCards.length === cards.length) {
        alert("Game Over! Player " + ((player1Pairs > player2Pairs) ? 1 : 2) + " wins!");
        updateHighScore();  // Update high score when a player wins
        resetGame();
    }
}

function switchTurn() {
    currentplayer = (currentplayer === 1) ? 2 : 1;
    
    // Update the current player's turn display
    document.getElementById('currentPlayer').textContent = (currentplayer === 1) ? player1Name : player2Name;
    console.log('Current player turn updated:', document.getElementById('currentPlayer').textContent);


     if (currentplayer === 2 && document.getElementById('mode').value === 'ai') {
        // It's the AI's turn, make the move after a short delay
        setTimeout(makeAIMove, 1000);
    }

}

// Add a new function to update the current player's turn display
function updateCurrentPlayerTurn() {
    currentPlayerElement.textContent = 'Player ' + currentplayer;
}

const menuButtons = document.getElementById('menuButtons');
const playerNamesContainer = document.getElementById('playerNames');
const aiDifficultyContainer = document.getElementById('aiDifficulty');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const player1 = document.getElementById('player1');
const player2 = document.getElementById('player2');
const scoreElement1 = document.getElementById('score1');
const scoreElement2 = document.getElementById('score2');
const currentPlayerTurn = document.getElementById('currentPlayerTurn');
const currentPlayerElement = document.getElementById('currentPlayer');
let selectedMode = 'player'; // Default value, you can adjust as needed
// Declare currentPlayerName with a default value at the beginning of your script
let currentPlayerName = 'Player 1'; // Adjust the default value as needed

const returnToMenuBtn = document.getElementById('returnToMenuBtn');



let player1Name = '';
let player2Name = '';



function selectPlayerVsPlayer() {
    
    console.log('Player vs Player selected');
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



function selectPlayerVsAI() {
    console.log('Player vs AI selected');
    selectedMode = 'ai'; // Declare and assign a value to selectedMode
    menuButtons.style.display = 'none';
    playerNamesContainer.style.display = 'none';
    aiDifficultyContainer.style.display = 'flex';
    startBtn.style.display = 'inline-block';
    resetBtn.style.display = 'none';
    player1.style.display = 'none';
    player2.style.display = 'none';
    


  
}

// Helper function to get n random indices from an array
function getRandomIndices(array, n) {
    const shuffledArray = array.slice().sort(() => Math.random() - 0.5);
    return shuffledArray.slice(0, n).map(item => array.indexOf(item));
}






function makeAIMove() {
    console.log('AI is making a move');
    const unflippedCards = cards.filter(card => !card.classList.contains('flipped'));

    console.log('Unflipped cards length:', unflippedCards.length);

    if (unflippedCards.length >= 2) {
        const randomIndices = getRandomIndices(unflippedCards, 2);
        const aiCards = [unflippedCards[randomIndices[0]], unflippedCards[randomIndices[1]]];

        console.log('AI chose cards:', aiCards);

        for (const aiCard of aiCards) {
            console.log('Before AI card click');
            aiCard.click(); // Simulate a click on the AI's chosen cards
            console.log('After AI card click');
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








function startGame() {
    console.log('Start game called');

    if (selectedMode === 'player') {
        player1Name = document.getElementById('player1Name').value || 'Player 1';
        player2Name = document.getElementById('player2Name').value || 'Player 2';
    } else if (selectedMode === 'ai') {
        console.log('AI mode selected');
        player1Name = 'Player';
        player2Name = 'AI';
        document.getElementById('player2').style.display = 'none'; // Hide player 2 in AI mode
        document.getElementById('score2').style.display = 'none'; // Hide player 2's score in AI mode
    }

    currentPlayerName = player1Name; // Set the current player to player 1
    console.log('Current player turn:', currentPlayerName);
    document.getElementById('currentPlayer').textContent = currentPlayerName;

    console.log('Player 1 Name:', player1Name);
    console.log('Player 2 Name:', player2Name);

    document.getElementById('playerNames').style.display = 'none';

    resetGame();
    createBoard();

    let highScore = localStorage.getItem('highScore') || 0;

    startBtn.style.display = 'none';
    resetBtn.style.display = 'inline-block';
    player1.style.display = 'inline-block';
    player2.style.display = 'inline-block';

    player1.querySelector('h2').textContent = player1Name;
    player2.querySelector('h2').textContent = player2Name;

    scoreElement1.textContent = "0";
    scoreElement2.textContent = "0";

    currentPlayerTurn.style.display = 'flex';
    document.getElementById('returnToMenuBtn').style.display = 'inline-block';

    console.log('Current player turn after creating board:', currentPlayerName);

    document.querySelector('.scoreboard').style.display = 'flex';

    // If the selected mode is 'ai', let the AI take the first turn
    if (selectedMode === 'ai') {
        console.log('AI mode selected, calling makeAIMove');
        makeAIMove();
    }
}





    
    



// Add a new function to handle the "Return to Menu" button
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
    document.getElementById('resetBtn').style.display = 'none';
    document.getElementById('player1').style.display = 'none';
    document.getElementById('player2').style.display = 'none';
    document.querySelector('.scoreboard').style.display = 'none';

    // Hide the "Return to Menu" button
    document.getElementById('returnToMenuBtn').style.display = 'none';

    // Reset the game mode to its default value or the desired value
    selectedMode = 'player'; // Set it to an empty string or 'player', depending on your default mode

    // Hide the current turn display
    document.getElementById('currentPlayerTurn').style.display = 'none';


    // Show menu-related elements
    document.getElementById('menuButtons').style.display = 'flex';
    document.getElementById('playerNames').style.display = 'none';
    document.getElementById('aiDifficulty').style.display = 'none';
    document.getElementById('startBtn').style.display = 'none';

    // Add event listeners for menu buttons
   
    document.getElementById('returnToMenuBtn').addEventListener('click', returnToStart);
     document.getElementById('playerVsAIBtn').addEventListener('click', selectPlayerVsAI);
    document.getElementById('playerVsPlayerBtn').addEventListener('click', selectPlayerVsPlayer);

    // Hide the scoreboard and gameboard when returning to start
    document.getElementById('game-board').style.display = 'none';
    document.querySelector('.scoreboard').style.display = 'none';

    

     
}








// Initialize high score from localStorage or set to 0
let highScore = localStorage.getItem('highScore') || 0;
console.log('Initial High Score:', highScore);

// Call this after updating the high score
displayHighScore();

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

function displayHighScore() {
    console.log('High Score:', highScore);
    document.getElementById('currentHighScore').textContent = highScore;
    // Add code to display high score in your UI
}

function clearHighScore() {
    highScore = 0;
    localStorage.removeItem('highScore');
    console.log('High Score Cleared');

    // Call the displayHighScore function after clearing the high score
    displayHighScore();
}

function resetHighScore() {
    // Reset the high score in localStorage to 0
    highScore = 0;
    localStorage.setItem('highScore', highScore);

    // Update the displayed high score
    displayHighScore();
}



// Add an event listener to the reset high score button
const resetHighScoreBtn = document.getElementById('resetHighScoreBtn');

// Add an event listener to the button
resetHighScoreBtn.addEventListener('click', resetHighScore);

// The resetHighScore function is already defined in your code
function resetHighScore() {
    // Reset the high score in localStorage to 0
    highScore = 0;
    localStorage.setItem('highScore', highScore);

    // Update the displayed high score
    displayHighScore();
}


