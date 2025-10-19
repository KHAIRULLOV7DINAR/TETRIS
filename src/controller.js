export default class Controller
{
    constructor(game, view)
    {
        this.game = game;
        this.view = view;

        this.upFlag = true;


        setInterval(() =>
        {
            this.game.movePieceDown();
            this.view.render(this.game.getState())
        }, 1000);

        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.addEventListener('keyup', this.handleKeyUp.bind(this));
    }

    handleKeyDown(event)
    {
        switch (event.key) {
            case 'ArrowLeft':
                this.game.movePieceLeft();
                this.view.render(this.game.getState());
                break;
            case 'ArrowUp':
                if (this.upFlag)
                {
                    this.upFlag = false;
                    this.game.rotatePiece();
                    this.view.render(this.game.getState());
                }
                break;
            case 'ArrowRight':
                this.game.movePieceRight();
                this.view.render(this.game.getState());
                break;
            case 'ArrowDown':
                this.game.movePieceDown();
                this.view.render(this.game.getState());
                break;
            case ' ':
                this.game.moveToBottom();
                this.view.render(this.game.getState());
                break;
        }
    }

    handleKeyUp(event)
    {
        switch (event.key)
        {
            case 'ArrowUp':
                this.upFlag = true;
        }
    }
}