import PieceManager from './pieceManager.js';

export default class Game{
    score = 0;
    lines = 0;
    level = 0;

    playfieldWidth = 10;
    playfieldHeight = 20;
    playfield = this.createPlayfield();
    pieceManager = PieceManager;

    activePiece  = this.setNewActivePiece();

    getState() {
        const renderPlayfield = [];

        // 1. КОПИРУЕМ ИГРОВОЕ ПОЛЕ
        for (let y = 0; y < this.playfieldHeight; y++) {
            renderPlayfield[y] = [];
            for (let x = 0; x < this.playfieldWidth; x++) {
                renderPlayfield[y][x] = this.playfield[y][x];
            }
        }

        // 2. ПРОВЕРКА АКТИВНОЙ ФИГУРЫ
        if (!this.activePiece || !this.activePiece.blocks) {
            console.error('Active piece or blocks are undefined');
            return renderPlayfield;
        }

        // 3. ПОЛУЧАЕМ ДАННЫЕ АКТИВНОЙ ФИГУРЫ
        const { x: fieldX, y: fieldY, blocks } = this.activePiece;
        const sizeY = blocks.length;
        const sizeX = blocks[0].length;

        // 4. ДОБАВЛЯЕМ АКТИВНУЮ ФИГУРУ НА ПОЛЕ
        for (let blockY = 0; blockY < sizeY; blockY++) {
            for (let blockX = 0; blockX < sizeX; blockX++) {
                if (blocks[blockY][blockX]) { // ← ИСПРАВЛЕНИЕ: blocks, а не activePiece
                    const renderY = fieldY + blockY;
                    const renderX = fieldX + blockX;

                    // Проверяем границы
                    if (renderY >= 0 && renderY < this.playfieldHeight &&
                        renderX >= 0 && renderX < this.playfieldWidth) {
                        renderPlayfield[renderY][renderX] = blocks[blockY][blockX];
                    }
                }
            }
        }

        return renderPlayfield;
    }

    createPlayfield(){
        const playfield = [];

        for (let y = 0; y < 20; y++){
            playfield[y] = [];
            for(let x = 0; x < 10; x++){
                playfield[y][x] = 0;
            }
        }
        return playfield;
    }

    setNewActivePiece() {
        const newPiece = this.pieceManager.getRandomFigure();

        return {
            x: Math.floor((this.playfieldWidth - newPiece.size) / 2),
            y: 0,
            type: newPiece.type,
            size: newPiece.size,
            leftX: newPiece.leftRightBottom[0][0],
            rightX: newPiece.leftRightBottom[0][1],
            bottomY: newPiece.leftRightBottom[0][2],
            rotation: 0,
            blocks: newPiece.blocks,
            rotations: newPiece.rotations,
            leftRightBottom: newPiece.leftRightBottom,
            color: newPiece.color
        };
    }


    isPieceOutOfBordersOrCollide(horVerFlag, fieldStep)
    {
        const {x, y, leftX, rightX, bottomY} = this.activePiece;
        const {playfieldWidth: width, playfieldHeight: height} = this;

        const blocks = this.activePiece.blocks;
        const sizeY = blocks.length;
        const sizeX = blocks[0].length;

        // Получение потенциальных координат
        let checkX, checkY;
        if(horVerFlag)
        {
            checkX = x + fieldStep;
            checkY = y;
        }
        else
        {
            checkX = x;
            checkY = y + fieldStep;
        }

        // Проверка выхода за границы слева, справа и снизу
        let outOfBorder = ((checkX + leftX) < 0) || ((checkX + rightX) >= width) || ((checkY + bottomY) >= height);
        if(outOfBorder)
        {
            return true;
        }

        let collide = false;

        for(let blockY = 0; blockY < sizeY; blockY++)
        {
            for(let blockX = 0; blockX < sizeX; blockX++)
            {
                if(blocks[blockY][blockX] !== 0)
                {
                    if(this.playfield[checkY + blockY][checkX + blockX] !== 0)
                    {
                        collide = true;
                        break;
                    }
                }
            }
        }
        return collide;
    }

    isPieceOutOfBordersOrCollideRotate(blocksRotated, leftRightBottom)
    {
        const {x, y} = this.activePiece;
        const [leftX, rightX, bottomY] = leftRightBottom;
        const {playfieldWidth: width, playfieldHeight: height} = this;

        const blocks = blocksRotated;
        const sizeY = blocks.length;
        const sizeX = blocks[0].length;


        // Проверка выхода за границы слева, справа и снизу
        let outOfBorder = ((x + leftX) < 0) || ((x + rightX) >= width) || ((y + bottomY) >= height);
        if(outOfBorder)
        {
            return true;
        }

        let collide = false;

        for(let blockY = 0; blockY < sizeY; blockY++)
        {
            for(let blockX = 0; blockX < sizeX; blockX++)
            {
                if(blocks[blockY][blockX] !== 0)
                {
                    if(this.playfield[y + blockY][x + blockX] !== 0)
                    {
                        collide = true;
                        break;
                    }
                }
            }
        }
        return collide;
    }

    rotatePiece()
    {
        let currentPiece = this.activePiece;

        let potentialRotation = (currentPiece.rotation + 1) % 4;
        let blocksRotated = currentPiece.rotations[potentialRotation];
        let leftRightBottom = currentPiece.leftRightBottom[potentialRotation];

        if (!(this.isPieceOutOfBordersOrCollideRotate(blocksRotated, leftRightBottom))){
            this.activePiece.leftX = this.activePiece.leftRightBottom[potentialRotation][0];
            this.activePiece.rightX = this.activePiece.leftRightBottom[potentialRotation][1];
            this.activePiece.bottomY = this.activePiece.leftRightBottom[potentialRotation][2];
            this.activePiece.rotation = potentialRotation;
            this.activePiece.blocks = this.activePiece.rotations[potentialRotation];
        }
    }

    movePieceLeft()
    {
        let horVerFlag = true;
        let fieldStep = -1;

        if ( !(this.isPieceOutOfBordersOrCollide(horVerFlag, fieldStep)) )
        {
            this.activePiece.x += fieldStep;
        }
    }

    movePieceRight()
    {
        let horVerFlag = true;
        let fieldStep = 1;

        if ( !(this.isPieceOutOfBordersOrCollide(horVerFlag, fieldStep)) )
        {
            this.activePiece.x += fieldStep;
        }
    }

    movePieceDown()
    {
        let horVerFlag = false;
        let fieldStep = 1;

        if ( !(this.isPieceOutOfBordersOrCollide(horVerFlag, fieldStep)) )
        {
            this.activePiece.y += fieldStep;
        }
        else
        {
            this.placeOnField();
            this.activePiece = this.setNewActivePiece();
        }
    }

    placeOnField()
    {
        const {x, y} = this.activePiece;
        const blocks = this.activePiece.blocks;
        const sizeY = blocks.length;
        const sizeX = blocks[0].length;

        for(let blockY = 0; blockY < sizeY; blockY++)
        {
            for(let blockX = 0; blockX < sizeX; blockX++)
            {
                if(blocks[blockY][blockX] !== 0)
                {
                    this.playfield[y + blockY][x + blockX] = blocks[blockY][blockX];
                }
            }
        }
    }
}