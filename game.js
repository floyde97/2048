export default class Game {
    constructor(size) {
        this.size = size;
        this.onMoveCalls = [];
        this.onWinCalls = [];
        this.onLoseCalls = [];
        this.setupNewGame();
    }

    setupNewGame() {
        this.board = new Array(this.size*this.size);
        this.board.fill(0);
        this.score = 0;
        this.won = false;
        this.over = false;
        this.newTile();
        this.newTile();
    }    
    loadGame(gameState) {
        this.board = gameState.board;
        this.score = gameState.score;
        this.won = gameState.won;
        this.over = gameState.over;
    }
    move(direction) {
        let beforeMove = this.toString();
        let validMove = true;
        switch (direction) {
            case 'left':
               this.shiftLeft();
               for (let i=0; i<this.size; i++) {
                   for (let j=i*this.size; j<(i+1)*this.size-1; j++) {
                        if (this.board[j] === 0) {
                            continue;
                        }
                       if (this.board[j] === this.board[j+1]) {
                        let temp = this.board[j] * 2;
                        this.board[j] = temp;
                        this.board[j+1] = 0;
                        this.score += temp;
                       }
                   }
               }
               if (beforeMove === this.toString()) {
                   validMove = false;
                   break;
               }
               this.shiftLeft();
               this.newTile();
               break;
            case 'right':
                this.shiftRight();
                for (let i=0; i<this.size; i++) {
                    for (let j=(i+1)*this.size-1;j>i*this.size; j--) {
                        if (this.board[j] === 0) {
                            continue;
                        }
                        if (this.board[j] === this.board[j-1]) {
                            let temp = this.board[j] * 2;
                            this.board[j] = temp;
                            this.board[j-1] = 0;
                            this.score += temp;
                        }
                    }
                }
                if (beforeMove === this.toString()) {
                    validMove = false;
                    break;
                }
                this.shiftRight();
                this.newTile();
                break;
            case 'up':
                this.shiftUp();
                for (let i=0; i<this.size; i++) {
                    for (let j=i; j<(this.size-1)*this.size+i; j+=this.size) {
                        if (this.board[j] === 0) {
                            continue;
                        }
                        if (this.board[j] === this.board[j+this.size]) {
                            let temp = this.board[j] * 2;
                            this.board[j] = temp;
                            this.board[j+this.size] = 0;
                            this.score += temp;
                        }
                    }
                }
                if (beforeMove === this.toString()) {
                    validMove = false;
                    break;
                }
               this.shiftUp();
               this.newTile();
               break;
            case 'down':
                this.shiftDown();
                for (let i=0; i<this.size; i++) {
                    for (let j=(this.size-1)*this.size+i; j>i; j-=this.size) {
                        if (this.board[j] === 0) {
                            continue;
                        }
                        if (this.board[j] === this.board[j-this.size]) {
                            let temp = this.board[j] * 2;
                            this.board[j] = temp;
                            this.board[j-this.size] = 0;
                            this.score += temp;
                        }
                    }
                }
                if (beforeMove === this.toString()) {
                    validMove = false;
                    break;
                }
               this.shiftDown();
               this.newTile();
               break;
        }
        if (validMove) {
            for (let i=0; i< this.onMoveCalls.length; i++) {
                this.onMoveCalls[i](this.getGameState());
            }
        }
        for (let i=0; i<this.board.length; i++) {
            if (this.board[i] === 2048) {
                this.won = true;
                for (let i=0; i< this.onWinCalls.length; i++) {
                    this.onWinCalls[i](this.getGameState());
                }
            }
        }
        let isOver = true;
        for (let i=0; i<this.size; i++) {
            for (let j=i*this.size; j<(i+1)*this.size-1; j++) {
                if (this.board[j] == this.board[j+1] || this.board[j] == 0 || this.board[j+1] == 0) {
                    isOver = false;
                    break;
                }
            }
            for (let j=i; j<(this.size-1)*this.size+i; j+=this.size) {
                if (this.board[j] == this.board[j+this.size] || 
                    this.board[j] == 0 || this.board[j+this.size] == 0) {
                    isOver = false;
                    break;
                }
            }
            if (isOver == false) {
                break;
            }
        }
        if (isOver) {
            this.over = true;
            for (let i=0; i< this.onLoseCalls.length; i++) {
                this.onLoseCalls[i](this.getGameState());
            }
        }
    }
    toString() {
        let gameBoard = this.getGameState().board;
        let string = "";
        for (let i=0; i<this.size; i++) {
            for (let j=i*this.size; j<(i+1)*this.size; j++) {
                string += "[" + gameBoard[j] + "] ";
            }
            string += '\n'
        }
        return string;
    }

    onMove(callback) {
        this.onMoveCalls.push(callback);
    }
    onWin(callback) {
        this.onWinCalls.push(callback);
    }
    onLose(callback) {
        this.onLoseCalls.push(callback);
    }
    getGameState() {
        let gameState = {};
        gameState.board = this.board;
        gameState.score = this.score;
        gameState.won = this.won;
        gameState.over = this.over;
        return gameState;
    }

    newTile() {
        let tile = -1;
        let index = 0;
        while (tile != 0) {
            index = Math.floor((Math.random()*(this.size*this.size)));
            tile = this.board[index];
        }
        let rand = Math.random();
        if (rand >= 0.9) {
            this.board[index] = 4;
        } else {
            this.board[index] = 2;
        }
    }

    shiftLeft() {
        let zeroPos;
        for (let i=0; i<this.size; i++) {
            for (let j=i*this.size; j<(i+1)*this.size-1; j++) {
                if (this.board[j] == 0) {
                    zeroPos = j.valueOf();
                    let temp = j.valueOf()+1;
                    while (this.board[temp] == 0 && temp <(i+1)*this.size-1) {
                        temp++;
                    }
                    if (this.board[temp] != 0) {
                        this.board[zeroPos] = this.board[temp];
                        this.board[temp] = 0;
                    }
                }
            }
        }
    }

    shiftRight() {
        let zeroPos = undefined;
        for (let i=0; i<this.size; i++) {
            for (let j=(i+1)*this.size-1; j>i*this.size; j--) {
                if (this.board[j] == 0) {
                    zeroPos = j.valueOf();
                    let temp = j.valueOf()-1;
                    while (this.board[temp] == 0 && temp >i*this.size) {
                        temp--;
                    }
                    if (this.board[temp] != 0) {
                        this.board[zeroPos] = this.board[temp];
                        this.board[temp] = 0;
                    }
                }
            }
        }
    }

    shiftUp() {
        let zeroPos = undefined;
        for (let i=0; i<this.size; i++) {
            for (let j=i; j<(this.size-1)*this.size+i; j+=this.size) {
                if (this.board[j] == 0) {
                    zeroPos = j.valueOf();
                    let temp = j.valueOf()+this.size;
                    while (this.board[temp] == 0 && temp < (this.size-1)*this.size+i) {
                        temp += this.size;
                    }
                    if (this.board[temp] != 0) {
                        this.board[zeroPos] = this.board[temp];
                        this.board[temp] = 0;
                    }
                }
            }
        }
    }

    shiftDown() {
        let zeroPos = undefined;
        for (let i=0; i<this.size; i++) {
            for (let j=(this.size-1)*this.size+i; j>i; j-=this.size) {
                if (this.board[j] == 0) {
                    zeroPos = j.valueOf();
                    let temp = j.valueOf()-this.size;
                    while (this.board[temp] == 0 && temp > i) {
                        temp -= this.size;
                    }
                    if (this.board[temp] != 0) {
                        this.board[zeroPos] = this.board[temp];
                        this.board[temp] = 0;
                    }
                }
            }
        }
    }
}



