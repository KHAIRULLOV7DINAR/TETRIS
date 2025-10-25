export default class View {
    colors = [
        'red',
        'orange',
        'yellow',
        'green',
        'blue',
        'pink',
        'purple',
    ]

    constructor(width, height, rows, columns) {
        this.width = width;
        this.height = height;

        // Получаем canvas из HTML
        this.canvas = document.querySelector('.canvas');
        this.scoreLine = document.querySelector('.score');
        this.nextFigure = document.querySelector('.info-canvas');

        console.log("Canvas:", this.canvas);

        // Устанавливаем размеры
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.border = "1px solid black";

        this.blockWidth = this.width / columns;
        this.blockHeight = this.height / rows;

        this.context = this.canvas.getContext("2d");
        this.infoContext = this.nextFigure.getContext("2d");

        console.log("View initialized. Block size:", this.blockWidth, this.blockHeight);
    }

    renderBlock(x, y, width, height, color, alpha)
    {
        this.context.save(); //изоляция прозрачности

        this.context.fillStyle = color;
        this.context.globalAlpha = alpha;
        this.context.strokeStyle = 'black';
        this.context.lineWidth = 2;
        this.context.fillRect(x, y, width, height);
        this.context.strokeRect(x, y, width, height);

        this.context.restore();
    }

    renderBlockNext(x, y, width, height, color, alpha)
    {
        this.infoContext.save(); //изоляция прозрачности

        this.infoContext.fillStyle = color;
        this.infoContext.globalAlpha = alpha;
        this.infoContext.strokeStyle = 'black';
        this.infoContext.lineWidth = 2;
        this.infoContext.fillRect(x, y, width, height);
        this.infoContext.strokeRect(x, y, width, height);

        this.infoContext.restore();
    }

    render(playfield, score, nextPiece) {
        this.clearScreen();
        this.renderGrid();
        this.renderPlayfield(playfield);
        this.renderScore(score);
        this.renderNextPiece(nextPiece);
    }

    clearScreen()
    {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.infoContext.clearRect(0, 0, this.nextFigure.width, this.nextFigure.height);
    }

    renderGrid()
    {
        this.context.save();

        this.context.strokeStyle = 'rgba(255, 255, 255, 0.2)'; // Полупрозрачные белые линии
        this.context.lineWidth = 1;

        // Вертикальные линии
        for (let x = 0; x <= this.width; x += this.blockWidth)
        {
            this.context.beginPath();
            this.context.moveTo(x, 0);
            this.context.lineTo(x, this.height);
            this.context.stroke();
        }

        // Горизонтальные линии
        for (let y = 0; y <= this.height; y += this.blockHeight)
        {
            this.context.beginPath();
            this.context.moveTo(0, y);
            this.context.lineTo(this.width, y);
            this.context.stroke();
        }

        this.context.restore();
    }

    renderPlayfield(playfield) {
        for(let y = 0; y < playfield.length; y++)
        {
            const line = playfield[y];
            for(let x = 0; x < line.length; x++)
            {
                const block = line[x];
                if(block)
                {
                    let alpha;
                    if (block > 0)
                    {
                        alpha = 1;
                    }
                    else{
                        alpha = 0.3;
                    }

                    this.renderBlock(
                        x * this.blockWidth,
                        y * this.blockHeight,
                        this.blockWidth,
                        this.blockHeight,
                        this.colors[Math.abs(block) - 1],
                        alpha
                    );
                }
            }
        }
    }

    renderScore(score) {
        if (this.scoreLine && this.scoreLine.textContent !== undefined) {
            this.scoreLine.textContent = score;
        } else {
            console.warn("Score line element not available");
        }
    }

    renderNextPiece(nextFigure){
        for(let y = 0; y < nextFigure.length; y++)
        {
            const line = nextFigure[y];
            for(let x = 0; x < line.length; x++)
            {
                const block = line[x];
                if(block)
                {
                    let alpha;
                    if (block > 0)
                    {
                        alpha = 1;
                    }
                    else{
                        alpha = 0.3;
                    }

                    this.renderBlockNext(
                        x * this.blockWidth,
                        y * this.blockHeight,
                        this.blockWidth,
                        this.blockHeight,
                        this.colors[Math.abs(block) - 1],
                        alpha
                    );
                }
            }
        }
    }
}