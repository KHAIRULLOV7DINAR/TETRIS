export default class Controller
{
    constructor(game, view)
    {
        this.game = game;
        this.view = view;
        this.intervalID = null;

        this.upFlag = true;
        this.pauseFlag = false;

        this.currentLevel = game.level; // Сохраняем текущий уровень

        this.startTimer();

        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.addEventListener('keyup', this.handleKeyUp.bind(this));
    }

    handleKeyDown(event)
    {
        switch (event.key) {
            case 'Escape':
                if (this.pauseFlag)
                {
                    this.unpause();
                }
                else
                {
                    this.pause();
                }
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

    firstFrame()
    {
        this.view.render(this.game.getState());
    }

    update()
    {
        this.game.movePieceDown();
        this.updateView();
    }

    // Новый метод для обновления view и проверки изменения уровня
    updateView()
    {
        this.view.render(this.game.getState(),
            {score: this.game.score,
                lines: this.game.lines,
                level: this.game.level
        }, this.game.nextPiece.blocks);
        this.checkLevelChange();
    }

    // Метод для проверки изменения уровня
    checkLevelChange()
    {
        if (this.game.level !== this.currentLevel) {
            console.log(`Level changed from ${this.currentLevel} to ${this.game.level}`);
            this.currentLevel = this.game.level;
            this.restartTimerWithNewSpeed();
        }
    }

    pause()
    {
        this.stopTimer();
        this.pauseFlag = true;
        this.view.render(this.game.getState());
    }

    unpause()
    {
        this.startTimer();
        this.pauseFlag = false;
        this.view.render(this.game.getState());
    }

    startTimer()
    {
        const speed = this.getCurrentSpeed();

        if (!this.intervalID)
        {
            this.intervalID = setInterval(() => {
                this.update();
            }, speed);
            console.log(`Timer started with speed: ${speed}ms, level: ${this.game.level}`);
        }
    }

    stopTimer()
    {
        if (this.intervalID)
        {
            clearInterval(this.intervalID);
            this.intervalID = null;
            console.log('Timer stopped');
        }
    }

    // Новый метод для перезапуска таймера с новой скоростью
    restartTimerWithNewSpeed()
    {
        if (!this.pauseFlag) {
            console.log(`Restarting timer with new speed: ${this.getCurrentSpeed()}ms for level ${this.game.level}`);
            this.stopTimer();
            this.startTimer();
        }
    }

    // Метод для получения текущей скорости на основе уровня
    getCurrentSpeed()
    {
        // Более плавная таблица скоростей
        const speedTable = {
            0: 1000,   // уровень 0: 1000 мс
            1: 900,    // уровень 1: 900 мс
            2: 800,    // уровень 2: 800 мс
            3: 700,    // уровень 3: 700 мс
            4: 600,    // уровень 4: 600 мс
            5: 500,    // уровень 5: 500 мс
            6: 450,    // уровень 6: 450 мс
            7: 400,    // уровень 7: 400 мс
            8: 350,    // уровень 8: 350 мс
            9: 300,    // уровень 9: 300 мс
            10: 250,   // уровень 10: 250 мс
            11: 200,   // уровень 11: 200 мс
            12: 180,   // уровень 12: 180 мс
            13: 160,   // уровень 13: 160 мс
            14: 140,   // уровень 14: 140 мс
            15: 120,   // уровень 15: 120 мс
            16: 100,   // уровень 16: 100 мс
            17: 90,    // уровень 17: 90 мс
            18: 80,    // уровень 18: 80 мс
            19: 70,    // уровень 19: 70 мс
            20: 60,    // уровень 20: 60 мс
        };

        // Для уровней 21+ используем максимальную скорость
        return speedTable[this.game.level] || 50;
    }
}