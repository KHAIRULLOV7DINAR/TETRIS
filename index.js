import Game from './src/game.js';
import View from './src/view.js';

const root = document.querySelector('#root')

const game = new Game();
const view = new View(root, 320, 640, 20, 10);

window.game = game;
window.view = view;

document.addEventListener('keydown', event => {
    switch (event.key) {
        case 'ArrowLeft':
            game.movePieceLeft();
            view.render(game.getState());
            break;
        case 'ArrowUp':
            game.rotatePiece();
            view.render(game.getState());
            break;
        case 'ArrowRight':
            game.movePieceRight();
            view.render(game.getState());
            break;
        case 'ArrowDown':
            game.movePieceDown();
            view.render(game.getState());
            break;
        case ' ':
            game.placeOnField();
            view.renderPlayfield(game.getState());
            break;
        // case 'p':
        // case 'P':
        //     game.togglePause();
        //     view.renderPlayfield(game.getState());
        //     break;
        // case 'r':
        // case 'R':
        //     game.restart();
        //     view.renderPlayfield(game.getState());
        //     break;
    }
});

view.renderPlayfield(game.getState())
