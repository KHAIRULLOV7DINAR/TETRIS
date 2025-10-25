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
        this.canvas = document.getElementById('gameCanvas');

        console.log("Canvas:", this.canvas);

        // Устанавливаем размеры
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.border = "1px solid black";

        this.blockWidth = this.width / columns;
        this.blockHeight = this.height / rows;

        this.context = this.canvas.getContext("2d");

        console.log("View initialized. Block size:", this.blockWidth, this.blockHeight);
    }

    render(playfield) {
        this.clearScreen();
        this.renderPlayfield(playfield);
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

    clearScreen() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    renderBlock(x, y, width, height, color, alpha) {
        this.context.fillStyle = color;
        this.context.globalAlpha = alpha;
        this.context.strokeStyle = 'black';
        this.context.lineWidth = 2;
        this.context.fillRect(x, y, width, height);
        this.context.strokeRect(x, y, width, height);
    }
}