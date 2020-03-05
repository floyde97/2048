import Game from "./engine/game.js";

$(document).ready(() => {
    let game = new Game(4);
    configureUI(game.getGameState());
    $("#reset").on('click', () => {
        game.setupNewGame();
        configureUI(game.getGameState());
    });
    game.onMove(() => {
        configureUI(game.getGameState());
    });
    game.onWin(() => {
        window.confirm("You have won! You may click the reset button to play again");
    });
    game.onLose(() => {
        window.confirm(`Game over. You may click the reset button to play again.`);
    });
    // $(".modal-close").click(function() {
    //     $(document).getElementById('modal').removeClass('is-active');
    // })
    $(document).keydown(function(e) {
        if (e.keyCode >= 37 && e.keyCode <= 40) {
            e.preventDefault();
        }
        switch (e.keyCode) {
            case 39:
                game.move('right');
                break;
            case 37:
                game.move('left');
    
                break;
            case 40:
                game.move('down');
                break;
            case 38:
                game.move('up');
                break;
        }
    });
});

let configureUI = (gamestate) => {
    setupBoard(gamestate);
    updateScore(gamestate);
    colorTiles(gamestate);
}

let setupBoard = (gamestate) => {
    for (let i=0; i<16; i++) {
        if (gamestate.board[i] == 0) {
            document.getElementById(i).innerHTML = `<p></p>`;
        } else {
            let t = `<p>${gamestate.board[i]}</p>`;
            document.getElementById(i).innerHTML = t;
        }
    }
}
let updateScore = (gamestate) => {
    let s = `<p id='score' class='scorelabel has-text-weight-bold'>Score: ${gamestate.score}</p>`;
    document.getElementById('scorecontainer').innerHTML = s;
}

let colorTiles = (gamestate) => {
    let colors = {0: "#FFFFFF", 2: "#B8B8B8", 4: "#FC9F8B", 8: "#D9FC8B", 16: "#8BFCAC", 32: "#8BD1FC", 
    64: "#D08BFC", 128: "#FC8BC0", 256: "#FF4747", 512: "#F9FF37", 1024: "#37FF61", 2048: "#3751FF"};
    for (let i=0; i<16; i++) {
        document.getElementById(i).style.backgroundColor = colors[gamestate.board[i]];
    }
}