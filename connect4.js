/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

let WIDTH = 7;
let HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

// Add rows & columns to board based on WIDTH & HEIGHT values via multiple sets of arrays
// Set values of elements to undefined
function makeBoard() {
  for(let i = 0; i < HEIGHT; i++){
    let row = []
    for (let j = 0; j < WIDTH; j++) {
      row.push(undefined);
    }
    board.push(row);
  }
}

// Create HTML gameboard
function makeHtmlBoard() {
  const htmlBoard = document.getElementById("board");
  let top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  // Create top row of cells (assigned w/ id of 'x') based on the value of WIDTH.
  // This row will have an event handler.
  for (let x = 0; x < WIDTH; x++) {
    let headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }

  htmlBoard.append(top);

  // Build the remainder of the board based on HEIGHT and WIDTH values
  // Assign each cell an id based on the (x, y) coordinates within the HTML table
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const td_container = document.createElement("td");
      td_container.setAttribute("id", `${y}-${x}`);
      row.append(td_container);
    }
    htmlBoard.append(row);
  }
}

// Given column x, return topmost empty y (null if filled)
function findSpotForCol(x) {
  for (let y = HEIGHT - 1; y >= 0; y--) {
    if (!board[y][x]) {
      return y;
    }
  }
}

// Add visual marker into selected (x, y) coordinates on board
function placeInTable(y, x) {
  let gameCell = document.getElementById(`${y}-${x}`);
  gameCell.classList.add('peice', (`p${currPlayer}`));
}

function endGame(msg) {
  alert(msg);
}

// Event listener added to top row of board for player to select (x, y) location of gamepiece
function handleClick(evt) {
  let x = +evt.target.id;
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  placeInTable(y, x)

  // Update in-memory board
  board[y][x] = currPlayer;

  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
/*   function checkForTie(cells) {
    return cells.every(function ([y, x]) {
      y !== undefined &&
      x !== undefined
      alert("It's a tie!");
    })
  } */
  
  // switch players
  currPlayer === 1 ? currPlayer = 2 : currPlayer = 1;
}


// Check board cell-by-cell for "does a win start here?"

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer
    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // Loop through each row
  for (let y = 0; y < HEIGHT; y++) {
    // Loop through each column
    for (let x = 0; x < WIDTH; x++) {
      // Define scenarios of wins based on alignment of four cells
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
      // Loop through each scenario. If one of them returns true, a player has won
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
