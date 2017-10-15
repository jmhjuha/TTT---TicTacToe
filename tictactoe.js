// Start
'use strict'
var readlineSync = require('readline-sync');
//-----------------------------------------------------------------------------
// Homework 14.10.2017
//-----------------------------------------------------------------------------
/**
 * @author 	Juha Havulinna
 */

/**
 * The propabity computer will defence. Value 0.3 means 30% propability to defence and 70% to attack.
 */
const DEFENCE_RATION = 0.3;

const emptySlot = '_'
const X = 'x';
const O = 'o';
const newLine = `
`;     

let boardSize = 0;

if (process.argv.length == 3) {
    let inx = 2;
    boardSize = Number(process.argv[inx++]);
  } else {
    console.log('Usage:' + process.argv[0] + ' [ <board size> ]');
    return; // Should be exit, is it?
};

/**
 * Change row number to row letter eg. 0 -> 'A'.
 * @param {number} row is the row number
 * @return {String}
 * @see {rowCharToy}
 */
function yToRowChar(_row) {
  return String.fromCharCode('A'.charCodeAt(0) + _row);
};

/**
 * Change row letter to number e.g. 'B' -> 1.
 * @param {char} char is the row identy for s user.
 * @return {number} 
 * @see {yToRowChar}
 */
function rowCharToy(_char) {
  return _char.charCodeAt(0) - 'A'.charCodeAt(0);
};



//-----------------------------------------------------------------------------
/**
 * @constructor
 * @param {Number} x game table slot x-coordinate.
 * @param {Number} y game table slot y-coordinate 
 * @param {Number} defenceScore not used.
 * @param {Number} attackScore not used.
 * @return {Object} game table slot object.
 */
function Square(_kumma_x, _kumma_y, _defenceScore, _attackScore) { 
  // let x = _x;
  // let y = _y;
  let kumma_x = _kumma_x;
  let kumma_y = _kumma_y;
  let defenceScore = _defenceScore;
  let attackScore = _attackScore;
  let badge = emptySlot; // `init x:${kumma_x} y:${kumma_y}`
  var object = {
    setBadge : function(_badge) {
      badge = _badge;
      // badge = `set:${kumma_x},${kumma_y}`;
      // console.log('set >> Badge:', kumma_x, kumma_y, badge);
    },
    getBadge : function() {
      // console.log('getBadge:', badge);
      // console.log('get << Badge:', kumma_x, kumma_y, badge);
      return badge;
    },
    setDefenceScore : function(_score) {
      defenceScore = _score;
    },
    setAttackScore : function(_score) {
      attackScore = _score;
    },
    getDefenceScore : function () {
      return defenceScore;
    },
    getAttackScore : function () {
      return attackScore;
    },
  };
  return object;
};

//-----------------------------------------------------------------------------
/**
 * Game table for the game moves. The table is a square, size x size.
 * @constructor
 * @param {Number} size is the game table size.
 * @return {Object} Game table object.
 */
function TableOfSquares(_size) {
  let size = _size;
  let board = Array(_size);
  let maxMoves = _size * _size; // maximum moves in one game for this board size.
  let moves = 0; // count of moves in one game.
    var object = {
    getSize : function() {
      return size;
    },
    getMaxMoves : function() {
      return maxMoves;
    },
    getMoves : function() {
      return moves;
    },
    setMaxMoves : function() {
      maxMoves = _size * _size;
      moves = 0;
    },
    // Count moves in game.
    moveDone : function() {
      moves++;
      return (moves >= maxMoves);   // true if game is over
    },
    square : function(x, y) {
      // console.log(`x:${x},y:${y}`);
      return board[x][y];
    },
    init : function() {
      let xi = 0;
      let yi = 0;
      this.setMaxMoves();
      moves = 0;
      for (let i = 0; i < size; i++) { // [.] = [...]
        board[i] = new Array(size);
      }
      // console.log('size:', size);
      for (yi = 0; yi < size; yi++) {
        for (xi = 0; xi < size; xi++) {
            board[xi][yi] = new Square(xi, yi, 0, 0);  
        };
      };
      return object;
    }, 
    // Return current game table for a display.
    print : function () {
      let printThis = ' ';
      let xi = 0;
      let yi = 0;
      for (xi = 0; xi < size; xi++) {
        printThis += ` ${xi + 1}`
      }
      printThis += newLine;
      for (yi = 0; yi < size; yi++) {
        printThis += yToRowChar(yi);
        for (xi = 0; xi < size; xi++) {
          printThis += '|' + board[xi][yi].getBadge();
        }
        printThis += '|'
        printThis += newLine;
      }
      return printThis;
    },
    // Find the first free slot in a column starting from offset.
    findFreeInCol : function (_col, _offset) {
      for (let yi = _offset; yi < size; yi++) {
        console.log('Free in col, check row:', yi);
        if (emptySlot == board[_col][yi].getBadge()) {
          console.log('yes');
          return yi;
        };
      };
      console.log('no');
      return null;
    },
    // Find the first free slot in a row starting from offset.
    findFreeInRow : function (_row, _offset) {
      for (let xi = _offset; xi < size; xi++) {
        console.log('Free in row, check col:', xi);
        if (emptySlot == board[xi][_row].getBadge()) {
          console.log('yes');          
          return xi;
        };
      };
      console.log('no');
      return null;
    },
    // Find free based on corner 0 => Case A: x(0)y(0) else => Case B: x(0),y(size - 1)  
    findFreeInDiagonal : function (_corner, _offset) {
      let score = 0;
      console.log('Free in diagonal:', _corner);      
      if (_corner == 0) {
        for (let i = _offset; i < _size; i++) {
          if (emptySlot == board[i][i].getBadge()) {
            console.log('yes');            
            return i;
          };
        };
      } else {
        for (let i = _offset; i < _size; i++) {
          //console.log(`x:${i},y:${size - 1 - i}`);
          if (emptySlot == board[i][size - 1 - i].getBadge()) {
            console.log('yes');
            return i;
          };
        };
      }
      console.log('no');
      return null;
    },
    // Count the number of buttons in a column.
    countColScore : function (_col, _button) {
      let score = 0;
      for (let yi = 0; yi < size; yi++) {
        if (_button == board[_col][yi].getBadge()) {
          score++;
        };
      };
      return score;
    },
    // Count the number of buttons in a row.    
    countRowScore : function (_row, _button) {
      let score = 0;
      for (let xi = 0; xi < size; xi++) {
        if (_button == board[xi][_row].getBadge()) {
          score++;
        };
      };
      return score;
    },
    // Get score based on corner 0 => Case A: x(0)y(0) else => Case B: x(0),y(size - 1)  
    countDiagonalScore : function (_corner, _button) {
      let score = 0;
      if (_corner == 0) {
        for (let i = 0; i < _size; i++) {
          if (_button == board[i][i].getBadge()) {
            score++;
          };
        };
      } else {
        for (let i = 0; i < _size; i++) {
          if (_button == board[i][size - 1 - i].getBadge()) {
            score++;
          };
        };
      }
      return score;
    },
    // return [ MaxRow, MaxCol, MaxDiag-A, MaxDiag-B ]
    findSpotsForScore : function (_button, _noButton) {
      let titles = ['row','col','dia','dib'];
      let rowSums = Array(size);
      let highestRow = 0;
      let highestRowSum = 0;
      let colSums = Array(size);
      let highestCol = 0;
      let highestColSum = 0;
      let diagA = 0;
      let diagB = 0;
      let count = 0;
      for (let n = 0; n < _size; n++) {
        if (this.countRowScore(n, _noButton) == 0) {
          rowSums[n] = this.countRowScore(n, _button);
          if (rowSums[n] > highestRowSum) {
            highestRowSum = rowSums[n];
            highestRow = n;
          };
        } else {
          rowSums[n] = 0;
        };
        if (this.countColScore(n, _noButton) == 0) {
          colSums[n] = this.countColScore(n, _button);
          if (colSums[n] > highestColSum) {
            highestColSum = colSums[n];
            highestCol = n;
          };
        } else {
          colSums[n] = 0;
        };
      };
      if (this.countDiagonalScore(0, _noButton) == 0) {
          diagA = this.countDiagonalScore(0, _button);
      };
      if (this.countDiagonalScore(_size, _noButton) == 0) {
          diagB = this.countDiagonalScore(_size, _button);
      };
      let maxims = [highestRowSum, highestColSum, diagA, diagB];
      let inxeses = [highestRow, highestCol, 0, _size];
      let highesScore = 0;
      let highesScoreIndex = NaN;
      for (let i in maxims) {
        if (maxims[i] > highesScore) {
          highesScore = maxims[i];
          highesScoreIndex = Number(i);
        };
      };
      let spot_x = null;
      let spot_y = null;
      let spot_d = null;
      // console.log('highesScoreIndex:', highesScoreIndex);
      switch (highesScoreIndex) {
        case (0) :
          // console.log('case 0, highestRow:', highestRow);
          spot_x = this.findFreeInRow(highestRow,0);
          if (spot_x != null) {
            return [spot_x, highestRow]
          }; // fall if no free spots
        case (1) :
          // console.log('case 1');
          spot_y = this.findFreeInCol(highestCol,0);
          if (spot_y != null) {
            return [highestCol, spot_y]
          };  // fall if no free spots
        case (2) :
          // console.log('case 3');
          spot_d = this.findFreeInDiagonal(0,0);
          if (spot_d != null) {
            return [spot_d, spot_d];
          };  // fall if no free spots
        case (3) :
        // console.log('case 3');
          spot_d = this.findFreeInDiagonal(_size,0);
          if (spot_d != null) {
            console.log('spot_d:', spot_d);
            return [spot_d, _size - spot_d - 1];
          };  // fall if no free spots
        default:
          // console.log('case default? - highesScoreIndex:', highesScoreIndex, typeof(highesScoreIndex));
          break;
      };    
      return [ null, null ];  // next will be a random move.
    },
    // Check for a winner in rows, cols and diagonals.
    checkWin : function () {
      for (let _button of [ X, O ]) {
        for (let n = 0; n < _size; n++) {
          if (this.countColScore(n, _button) >= _size) {
            return true;
          };
          if (this.countRowScore(n, _button) >= _size) {
            return true;
          }
        };
        if (this.countDiagonalScore(0, _button) >= _size) {
          return true;
        };
        if (this.countDiagonalScore(_size, _button) >= _size) {
          return true;
        };
      };
      return false;
    },
    // Check if slot is free.
    isSquareFree : function (_x ,_y) {
      if ((_x == null) || (_y == null) || (_x < 0) || (_y < 0) || (_x > _size - 1) || (_y >= _size)) {      // *** TODO ***
        return false;
      }
      if (board[_x][_y].getBadge() == emptySlot) {
        return true;
      } else {
        return false;
      }
    },
    // 
    /**
     * Check that requested game slot is free. 
     * @param {Array} move 
     * @param {Number} size
     * @return {Boolean}
     */
    moveIsValid : function (_move) {
      let _x = _move[0];
      let _y = _move[1];
      if ((_x >= 0) && (_x < _size) && (_y >= 0) && (_y < _size)) {
        if (!this.isSquareFree(_x,_y)) {
          console.log(`Square ${yToRowChar(_y)}${_x + 1} is reserved.`);
          return false
        } else {
          return true
        } 
      } else {
        console.log(`Square ${yToRowChar(_y)}${_x + 1} does not fit.`);
        return false
      };
      console.assert('*** bug ***');
      return false
    },

  };
  return object;
};
//
function testRowsCols(_size) {
  let tictactoe = new TableOfSquares(_size);
  tictactoe.init();  
  tictactoe.square(0,0).setBadge('A');
  tictactoe.square(0,1).setBadge('A');
  tictactoe.square(0,2).setBadge('i');
  tictactoe.square(1,0).setBadge('A');
  tictactoe.square(1,1).setBadge('i');
  tictactoe.square(1,2).setBadge('A');
  tictactoe.square(2,0).setBadge('A');
  tictactoe.square(2,1).setBadge('A');
  tictactoe.square(2,2).setBadge('A');
  console.log(tictactoe.print());
  console.log('A - col 0:', tictactoe.countColScore(0, 'A'));
  console.log('A - col 1:', tictactoe.countColScore(1, 'A'));
  console.log('A - col 2:', tictactoe.countColScore(2, 'A'));
  console.log('i - row 0:', tictactoe.countRowScore(0, 'i'));
  console.log('i - row 1:', tictactoe.countRowScore(1, 'i'));
  console.log('i - row 2:', tictactoe.countRowScore(2, 'i'));
  console.log('A - top left to low right:', tictactoe.countDiagonalScore(0, 'A'));
  console.log('i - top left to low right:', tictactoe.countDiagonalScore(0, 'i'));
  console.log('A - bottom left to top right:', tictactoe.countDiagonalScore(_size, 'A'));
  console.log('i - bottom left to top right:', tictactoe.countDiagonalScore(_size, 'i'));
  console.log(isCorner(2, 3, _size));
  console.log(isCorner(0, 0, _size));
  console.log(isCorner(0, 3, _size));
  console.log(isCorner(3, 0, _size));
  console.log(isCorner(3, 3, _size));
}

//
/**
 * Returns true if coodinates [x,y] points to a corner.
 * @param {Number} x 
 * @param {Number} y 
 * @param {Number} size Game table size.
 * @return {Boolean} 
 */
function isCorner(_x, _y, _size) {
  return (
    ((_x == 0) && (_y == 0)) ||
    ((_x == 0) && (_y == _size - 1)) ||
    ((_x == _size - 1) && (_y == 0)) ||
    ((_x == _size - 1) && (_y == _size - 1))
  );
};
//
/**
 * Coordinates location freedom i.e. is it free is not checked. 
 * @param {Number} size 
 * @return {Array} [x,y]
 * @see {computerRandomMove}
 */
function randomMove(_size) {
  let x = Math.floor(Math.random() * _size);
  let y = Math.floor(Math.random() * _size);
  return [x, y];
}
//
/**
 * Returns random [x,y] game coordinates.
 * Coordinates location is it free for a move.
 * @param {Number} _gameTable
 * @return {Array} [x,y]
 */
function computerRandomMove(_gameTable) {
  let size = _gameTable.getSize();
  let searchMove = true
  let sanityCount = 1000;
  while (searchMove) {
    let move = randomMove(size);
    if (_gameTable.isSquareFree(move[0],move[1])) {
      return move;
      searchMove = false
    } else {
      sanityCount--;
      if (sanityCount > 0) {
        continue;
      } else {
        assert('No space found in time.')
        return [null, null];
      };
    };
  }
  return [x, y];
};
//
/**
 * ReadMove reads game table coordinates from user.
 * The format is <char><number>.
 * For examle: user input 'A1' gives [0,0] and 'A2' gives [1,0].
 * @return {Array} x,y
 */
function readMove() {
  let question = 'Move? ';
  let answer = null;
  answer = readlineSync.question(question).toLocaleUpperCase();
  let y = rowCharToy(answer[0]); //  {answer[0].charCodeAt(0) - 'A'.charCodeAt(0);
  let x = answer[1] - 1;
  return [x, y];
}

/**
 * Play a tictactoe game with given board size.
 * Game ends when either player wins, user or computer,
 * or there is no more moves available.
 * @param {Number} size 
 */
function playGame(_size) {
  let tictactoe = new TableOfSquares(_size);
  let defenceRation = DEFENCE_RATION  
  tictactoe.init();
  let ok = true;
  let gameOver = false;
  console.log('GAME START');
  while (!gameOver) {
    console.log('x ----------->')
    console.log(tictactoe.print());
    let move = readMove();
    if (tictactoe.moveIsValid(move)) {
      tictactoe.square(move[0],move[1]).setBadge(O);
      gameOver = tictactoe.moveDone();
      if (gameOver)
        break;
      // console.log(tictactoe.print());
      if (tictactoe.checkWin()) {
        console.log('You win!');
        break;
      };
      let computerMove = [];
      if (tictactoe.getMoves() <= 4) {
        console.log('Corner...')
        let corner = true;
        do {
          computerMove = computerRandomMove(tictactoe);
          if (!tictactoe.moveIsValid(computerMove)) {
            console.log('Not valid:', computerMove);
            continue;
          };
          corner = isCorner(computerMove[0], computerMove[1], tictactoe.getSize());
        } while (!corner);
      } else {
        if (Math.random() >= defenceRation) {
          // console.log('Attack...')
          computerMove = tictactoe.findSpotsForScore(X,O);     // attack
        } else {
          // console.log('Defence...')
          computerMove = tictactoe.findSpotsForScore(O,X);     // defence
          if (!tictactoe.moveIsValid(computerMove)) {
            // console.log('no, it an attack.')
            computerMove = tictactoe.findSpotsForScore(X,O);     // attack
          };
        };
      };
      // console.log('ComputerMove:', computerMove);
      if (computerMove[0] == null || computerMove[1] == null) {
        // console.log('random');
        computerMove = computerRandomMove(tictactoe);
      };
      if (tictactoe.moveIsValid(computerMove)) {
        tictactoe.square(computerMove[0], computerMove[1]).setBadge(X);
        gameOver = tictactoe.moveDone();
      } else {
        console.assert('*** Programmer error ***');
      };
      // console.log( computerRandomMove(tictactoe) );
      if (tictactoe.checkWin()) {
        console.log('Computer wins!');
        break;
      };
    };
  };
  console.log(tictactoe.print());
  console.log('GAME OVER');
};

playGame(boardSize);

// The End.