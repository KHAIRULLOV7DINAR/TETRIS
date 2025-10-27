import Game from './game.js';
import { savePlayerResult, getLastPlayer, loadLeaderboard } from './gameStorage.js';

export default class Controller
{
    constructor(game, view)
    {
        this.game = game;
        this.view = view;
        this.intervalID = null;

        this.upFlag = true;
        this.pauseFlag = false;
        this.newGameFlag = true;

        this.currentLevel = game.level;

        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.addEventListener('keyup', this.handleKeyUp.bind(this));

        this.initializePlayer();
        this.view.renderNewGame();
    }

    initializePlayer()
    {
        const lastPlayer = getLastPlayer();
        const playerNameElement = document.getElementById('player-name');

        if (lastPlayer)
        {
            playerNameElement.textContent = lastPlayer;
        } else
        {
            const name = prompt('Введите ваше имя:', 'Игрок') || 'Игрок';
            playerNameElement.textContent = name;
        }
    }

    handleKeyDown(event)
    {
        const modal = document.querySelector('.modal');
        if (modal.classList.contains('active'))
        {
            if (event.key === 'Enter' || event.key === 'Escape')
            {
                this.restartGame();
            }
            return;
        }

        if (this.newGameFlag)
        {
            if (event.key === 'Enter')
            {
                this.game = new Game();
                this.startGame();
            }
            return;
        }

        if (this.pauseFlag)
        {
            if (event.key === 'Escape')
            {
                this.unpause();
            }
            return;
        }

        switch (event.key)
        {
            case 'Escape':
                this.pause();
                break;
            case 'ArrowLeft':
                this.game.movePieceLeft();
                this.updateView();
                break;
            case 'ArrowUp':
                if (this.upFlag)
                {
                    this.upFlag = false;
                    this.game.rotatePiece();
                    this.updateView();
                }
                break;
            case 'ArrowRight':
                this.game.movePieceRight();
                this.updateView();
                break;
            case 'ArrowDown':
                this.stopTimer();
                this.game.movePieceDown();
                this.updateView();
                break;
            case ' ':
                this.game.moveToBottom();
                this.updateView();
                break;
        }
    }

    startGame()
    {
        this.newGameFlag = false;
        this.startTimer();
    }

    handleKeyUp(event)
    {
        switch (event.key)
        {
            case 'ArrowUp':
                this.upFlag = true;
                break;
            case 'ArrowDown':
                this.startTimer();
        }
    }

    update()
    {
        if (this.pauseFlag || this.newGameFlag)
        {
            return;
        }
        this.game.movePieceDown();
        this.updateView();
        this.checkLevelChange();
    }

    updateView()
    {
        if (this.game.topOut)
        {
            this.handleGameOver();
            return;
        }
        if (this.pauseFlag || this.newGameFlag)
        {
            return;
        }

        let offSet = this.game.nextPiece.rightX - this.game.nextPiece.leftX + 1;
        let renderPiece = this.game.nextPiece.type === 'O' ? [[1, 1],[1, 1]] : this.game.nextPiece.blocks;

        this.view.render(this.game.getState(),
            {score: this.game.score,
                lines: this.game.lines,
                level: this.game.level
            }, renderPiece, offSet, this.game.nextPiece.randomIndex);
    }

    handleGameOver()
    {
        this.stopTimer();
        this.newGameFlag = true;

        const playerName = document.getElementById('player-name').textContent;
        const score = this.game.score;
        const lines = this.game.lines;
        const level = this.game.level;

        // Сохранение результата
        savePlayerResult(playerName, score, lines, level);

        // Показ модального окна
        this.showGameOverModal();

        this.view.renderGameOver();
    }

    showGameOverModal()
    {
        const modal = document.querySelector('.modal');
        const finalScore = document.getElementById('final-score');

        // Обновление счета
        if (finalScore)
        {
            finalScore.textContent = this.game.score;
        }

        // Загрузка таблицы рекордов
        loadLeaderboard();

        // Показ модального окна
        modal.classList.add('active');

        const restartBtn = document.getElementById('restart-btn');
        if (restartBtn)
        {
            restartBtn.onclick = () => {
                this.restartGame();
            };
        }
    }

    hideGameOverModal()
    {
        const modal = document.querySelector('.modal');
        modal.classList.remove('active');
    }

    restartGame() {
        this.hideGameOverModal();
        this.game = new Game();
        this.newGameFlag = false;
        this.pauseFlag = false;
        this.currentLevel = this.game.level;
        this.startTimer();
        this.updateView();
    }

    checkLevelChange()
    {
        if (this.game.level !== this.currentLevel) {
            this.currentLevel = this.game.level;
            this.restartTimerWithNewSpeed();
        }
    }

    pause()
    {
        this.stopTimer();
        this.pauseFlag = true;
        this.updateView();
        this.view.renderPause();
    }

    unpause()
    {
        this.startTimer();
        this.pauseFlag = false;
        this.updateView();
    }

    startTimer()
    {
        this.updateView();

        const speed = this.getCurrentSpeed();

        if (!this.intervalID)
        {
            this.intervalID = setInterval(() => {
                this.update();
            }, speed);
        }
    }

    stopTimer()
    {
        if (this.intervalID)
        {
            clearInterval(this.intervalID);
            this.intervalID = null;
        }
    }

    restartTimerWithNewSpeed()
    {
        if (!this.pauseFlag) {
            this.stopTimer();
            this.startTimer();
        }
    }

    getCurrentSpeed()
    {
        const speedTable = {
            0: 1000, 1: 900, 2: 800, 3: 700, 4: 600, 5: 500,
            6: 450, 7: 400, 8: 350, 9: 300, 10: 250,
            11: 200, 12: 180, 13: 160, 14: 140, 15: 120,
            16: 100, 17: 90, 18: 80, 19: 70, 20: 60,
        };
        return speedTable[this.game.level] || 50;
    }
}