document.addEventListener('DOMContentLoaded', () => {
    const board = document.querySelector('#game-board');
    const scoreDisplay = document.querySelector('#score');
    const boardWidth = 10;
    const boardHeight = 20;
    let timerId;
    let score = 0;
    let currentPosition = 4;
    let currentRotation = 0;

    // Create the board
    let squares = Array.from({ length: boardWidth * boardHeight }, () => {
        const square = document.createElement('div');
        board.appendChild(square);
        return square;
    });

    // Create invisible row for collision detection
    for (let i = 0; i < boardWidth; i++) {
        const takenSquare = document.createElement('div');
        takenSquare.classList.add('taken');
        board.appendChild(takenSquare);
        squares.push(takenSquare);
    }

    // Tetromino shapes (4 rotations for each)
    const tetrominoes = [
        [ // T shape
            [1, boardWidth, boardWidth + 1, boardWidth + 2],
            [1, boardWidth, boardWidth + 1, boardWidth * 2 + 1],
            [boardWidth, boardWidth + 1, boardWidth + 2, boardWidth * 2 + 1],
            [1, boardWidth, boardWidth + 1, boardWidth * 2 + 1]
        ],
        [ // L shape
            [1, boardWidth + 1, boardWidth * 2 + 1, boardWidth * 2 + 2],
            [boardWidth, boardWidth + 1, boardWidth + 2, boardWidth * 2],
            [1, 2, boardWidth + 1, boardWidth * 2 + 1],
            [boardWidth, boardWidth + 1, boardWidth + 2, boardWidth * 2 + 2]
        ],
        [ // I shape
            [1, boardWidth + 1, boardWidth * 2 + 1, boardWidth * 3 + 1],
            [boardWidth, boardWidth + 1, boardWidth + 2, boardWidth + 3],
            [1, boardWidth + 1, boardWidth * 2 + 1, boardWidth * 3 + 1],
            [boardWidth, boardWidth + 1, boardWidth + 2, boardWidth + 3]
        ],
        // Add more tetromino shapes here (Z, O, etc.)
    ];

    // Randomize starting tetromino
    let random = Math.floor(Math.random() * tetrominoes.length);
    let current = tetrominoes[random][currentRotation];

    // Draw the tetromino
    function draw() {
        current.forEach(index => {
            if (squares[currentPosition + index]) {
                squares[currentPosition + index].classList.add('tetromino');
            }
        });
    }

    // Undraw the tetromino
    function undraw() {
        current.forEach(index => {
            if (squares[currentPosition + index]) {
                squares[currentPosition + index].classList.remove('tetromino');
            }
        });
    }

    // Move down
    function moveDown() {
        undraw();
        currentPosition += boardWidth;
        draw();
        freeze();
    }

    // Freeze tetromino and generate a new one
    function freeze() {
        if (current.some(index => squares[currentPosition + index + boardWidth].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'));
            // Nueva pieza
            random = Math.floor(Math.random() * tetrominoes.length);
            currentRotation = 0;
            current = tetrominoes[random][currentRotation];
            currentPosition = 4;
            draw();
            gameOver();
            addScore();
        }
    }

    // Move left
    function moveLeft() {
        undraw();
        const isAtLeftEdge = current.some(index => (currentPosition + index) % boardWidth === 0);

        if (!isAtLeftEdge) currentPosition -= 1;
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1;
        }
        draw();
    }

    // Move right
    function moveRight() {
        undraw();
        const isAtRightEdge = current.some(index => (currentPosition + index) % boardWidth === boardWidth - 1);

        if (!isAtRightEdge) currentPosition += 1;
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1;
        }
        draw();
    }

    // Rotate the tetromino
    function rotate() {
        undraw();
        currentRotation = (currentRotation + 1) % tetrominoes[random].length;
        current = tetrominoes[random][currentRotation];
        draw();
    }

    // Add score
    function addScore() {
        for (let i = 0; i < boardWidth * boardHeight; i += boardWidth) {
            const row = Array.from({ length: boardWidth }, (_, index) => i + index);

            if (row.every(index => squares[index].classList.contains('taken'))) {
                row.forEach(index => squares[index].classList.remove('taken', 'tetromino'));
                const removedSquares = squares.splice(i, boardWidth);
                squares = removedSquares.concat(squares);
                squares.forEach(cell => board.appendChild(cell));
                score += 10;
                scoreDisplay.innerHTML = score;
                clearInterval(timerId);
                timerId = setInterval(moveDown, Math.max(1000 - score * 10, 200)); // Aumentar velocidad
            }
        }
    }

    // Game over
    function gameOver() {
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            clearInterval(timerId);
            document.body.innerHTML += `<div class="sad-emoji">😢 Game Over!</div>`;
        }
    }
    
    function victory() {
        clearInterval(timerId);
        document.body.innerHTML += `<div class="confetti"></div><div class="win-message">🎉 You Win!</div>`;
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            document.body.appendChild(confetti);
        }
    }


    // Start game
    timerId = setInterval(moveDown, 1000);

    // Controls
    document.getElementById('left-button').addEventListener('click', moveLeft);
    document.getElementById('rotate-button').addEventListener('click', rotate);
    document.getElementById('right-button').addEventListener('click', moveRight);
    document.getElementById('down-button').addEventListener('click', moveDown);
});





       