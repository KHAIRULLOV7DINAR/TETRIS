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
    nextPiece = this.setNewActivePiece();

    static points = {
        '1' : 40,
        '2' : 100,
        '3' : 300,
        '4' : 1200
    };

    /*
    Создание и return поля с зафиксированными полями, падающей фигурой и ее призраокм снизу для класса-отрисоавщика view
    */
    getState() {
        // Копируем поле
        const renderPlayfield = this.playfield.map(row => [...row]);

        // Отрисовка призрака фигуры снизу
        if (this.activePiece && this.activePiece.blocks)
        {
            const ghostPiece = this.calculateGhostPosition();
            this.addPieceToPlayfield(renderPlayfield, ghostPiece, -Math.abs(ghostPiece.randomIndex));
        }

        // Отрисовка падающей фигуры
        if (this.activePiece && this.activePiece.blocks)
        {
            this.addPieceToPlayfield(renderPlayfield, this.activePiece, Math.abs(this.activePiece.randomIndex));
        }

        return renderPlayfield;
    }

    addPieceToPlayfield(playfield, piece, value)
    {
        const { x, y, blocks } = piece;
        const sizeY = blocks.length;
        const sizeX = blocks[0].length;

        for (let blockY = 0; blockY < sizeY; blockY++)
        {
            for (let blockX = 0; blockX < sizeX; blockX++)
            {
                if (blocks[blockY][blockX])
                {
                    const renderY = y + blockY;
                    const renderX = x + blockX;

                    if (renderY >= 0 && renderY < this.playfieldHeight &&
                        renderX >= 0 && renderX < this.playfieldWidth)
                    {
                        playfield[renderY][renderX] = value;
                    }
                }
            }
        }
    }

    calculateGhostPosition()
    {
        const ghostPiece = this.createGhostPiece();

        while (!this.isGhostPieceCollide(ghostPiece))
        {
            ghostPiece.y += 1;
        }

        ghostPiece.y -= 1;

        return ghostPiece;
    }

    isGhostPieceCollide(ghostPiece)
    {
        const { x, y, blocks, bottomY } = ghostPiece;
        const sizeY = blocks.length;
        const sizeX = blocks[0].length;

        // Проверка достижения дна
        if (y + bottomY >= this.playfieldHeight)
        {
            return true;
        }

        // Проверка столкновения с другими блоками
        for (let blockY = 0; blockY < sizeY; blockY++)
        {
            for (let blockX = 0; blockX < sizeX; blockX++)
            {
                if (blocks[blockY][blockX] !== 0)
                {
                    const fieldY = y + blockY;
                    const fieldX = x + blockX;

                    if (fieldY >= 0 && this.playfield[fieldY][fieldX] !== 0)
                    {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    createGhostPiece()
    {
        const piece = this.activePiece;
        return{
            ...piece,
            blocks: piece.blocks.map(row => [...row]), // копируем массив блоков
        };
    }
    //=======================================================================

    /*
    Создание пустого поля и новой фигуры
    */
    createPlayfield()
    {
        const playfield = [];

        for (let y = 0; y < this.playfieldHeight; y++)
        {
            playfield[y] = [];
            for(let x = 0; x < this.playfieldWidth; x++)
            {
                playfield[y][x] = 0;
            }
        }
        return playfield;
    }

    setNewActivePiece()
    {
        const newPiece = this.pieceManager.getRandomFigure();

        return {
            x: Math.floor((this.playfieldWidth - newPiece.size) / 2),
            y: 0,
            leftX: newPiece.leftRightBottom[0][0],
            rightX: newPiece.leftRightBottom[0][1],
            bottomY: newPiece.leftRightBottom[0][2],
            currentWallJump: newPiece.wallJump[0],
            ...newPiece
        };
    }
    //=======================================================================

    /*
    Проверки на коллизию
    */
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

    // Обновленный метод проверки коллизий для вращения с учетом смещений
    isPieceOutOfBordersOrCollideRotate(blocksRotated, leftRightBottom, useOffset = false, offsetX = 0, offsetY = 0)
    {
        let {x, y} = this.activePiece;

        if (useOffset)
        {
            x += offsetX;
            y += offsetY;
        }

        const [leftX, rightX, bottomY] = leftRightBottom;
        const {playfieldWidth: width, playfieldHeight: height} = this;

        const blocks = blocksRotated;
        const sizeY = blocks.length;
        const sizeX = blocks[0].length;

        // Проверка выхода за границы
        let outOfBorder = ((x + leftX) < 0) || ((x + rightX) >= width) || ((y + bottomY) >= height);
        if(outOfBorder)
        {
            return true;
        }

        // Проверка столкновения с другими блоками
        for(let blockY = 0; blockY < sizeY; blockY++)
        {
            for(let blockX = 0; blockX < sizeX; blockX++)
            {
                if(blocks[blockY][blockX] !== 0) {
                    const fieldY = y + blockY;
                    const fieldX = x + blockX;

                    // Проверяем границы
                    if (fieldX < 0 || fieldX >= width || fieldY >= height)
                    {
                        return true;
                    }

                    // Проверяем столкновение с блоками (только если полеY >= 0)
                    if (fieldY >= 0 && this.playfield[fieldY][fieldX] !== 0)
                    {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    //=======================================================================

    /*
    Вращение фигуры
    */
    rotatePiece()
    {
        let currentPiece = this.activePiece;

        let potentialRotation = (currentPiece.rotation + 1) % 4;
        let blocksRotated = currentPiece.rotations[potentialRotation];
        let leftRightBottom = currentPiece.leftRightBottom[potentialRotation];
        let wallJumpOffsets = currentPiece.wallJump[potentialRotation]; // Получаем wall jump для новой ротации

        // Пробуем обычное вращение
        if (!this.isPieceOutOfBordersOrCollideRotate(blocksRotated, leftRightBottom, false, 0)) {
            this.applyRotation(potentialRotation, 0, 0);
        }
        // Пробуем wall kick варианты
        else {
            let foundValidPosition = false;

            // Пробуем разные смещения для wall kick
            const kickTests = [
                [wallJumpOffsets[0], 0],  // смещение влево
                [wallJumpOffsets[1], 0],  // смещение вправо
                [0, wallJumpOffsets[2]],  // смещение вверх
                [wallJumpOffsets[0], wallJumpOffsets[2]], // влево + вверх
                [wallJumpOffsets[1], wallJumpOffsets[2]], // вправо + вверх
            ];

            for (let [kickX, kickY] of kickTests) {
                if (!this.isPieceOutOfBordersOrCollideRotate(blocksRotated, leftRightBottom, true, kickX, kickY)) {
                    this.applyRotation(potentialRotation, kickX, kickY);
                    foundValidPosition = true;
                    break;
                }
            }

            // Если ни один wall kick не сработал, вращение не происходит
            if (!foundValidPosition) {
                console.log("No valid wall kick position found");
            }
        }
    }

    applyRotation(potentialRotation, offsetX, offsetY) {
        this.activePiece.x += offsetX;
        this.activePiece.y += offsetY;

        this.activePiece.leftX = this.activePiece.leftRightBottom[potentialRotation][0];
        this.activePiece.rightX = this.activePiece.leftRightBottom[potentialRotation][1];
        this.activePiece.bottomY = this.activePiece.leftRightBottom[potentialRotation][2];
        this.activePiece.rotation = potentialRotation;
        this.activePiece.blocks = this.activePiece.rotations[potentialRotation];
        this.activePiece.currentWallJump = this.activePiece.wallJump[potentialRotation];

        console.log(`Rotation applied with offset: x=${offsetX}, y=${offsetY}`);
    }
    //=======================================================================

    /*
    Движение фигуры
    */
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
            let clearedLines = String(this.clearLines());
            this.updateScoreLines(clearedLines);
            this.updateLevel();

            this.activePiece = this.nextPiece;
            this.nextPiece = this.setNewActivePiece();
        }
    }

    moveToBottom()
    {
        let horVerFlag = false;
        let fieldStep = 1;

        while ( !(this.isPieceOutOfBordersOrCollide(horVerFlag, fieldStep)) )
        {
            this.activePiece.y += fieldStep;
        }
        this.placeOnField();
        let clearedLines = String(this.clearLines());
        this.updateScoreLines(clearedLines);
        this.updateLevel();

        this.activePiece = this.nextPiece;
        this.nextPiece = this.setNewActivePiece();
    }
    //=======================================================================

    /*
    Изменение состояния игры
    */
    placeOnField()
    {
        const {x, y} = this.activePiece;
        const blocks = this.activePiece.blocks;
        const randomIndex = this.activePiece.randomIndex;
        const sizeY = blocks.length;
        const sizeX = blocks[0].length;

        for(let blockY = 0; blockY < sizeY; blockY++)
        {
            for(let blockX = 0; blockX < sizeX; blockX++)
            {
                if(blocks[blockY][blockX] !== 0)
                {
                    this.playfield[y + blockY][x + blockX] = blocks[blockY][blockX] * randomIndex;
                }
            }
        }
    }

    clearLines()
    {
        const width = this.playfieldWidth;
        const height = this.playfieldHeight;
        let lines = [];

        for (let y = height - 1; y > 0; y--)
        {
            let blockNumber = 0;
            for (let x = 0; x < width; x++)
            {
                if(this.playfield[y][x])
                {
                    blockNumber++;
                }
            }

            if(blockNumber === 0)
            {
                break;
            }
            else if(blockNumber < width)
            {
                continue;
            }
            else
            {
                lines.unshift(y);
            }
        }

        for(let index of lines)
        {
            this.playfield.splice(index, 1);
            this.playfield.unshift(new Array(width).fill(0));
        }

        return lines.length;
    }

    updateScoreLines(clearedLines)
    {
        if (clearedLines > 0)
        {
            this.score += (this.level + 1) * Game.points[clearedLines];
            this.lines += Number(clearedLines);
            console.log(this.score);
        }
    }

    updateLevel()
    {
        this.level = Math.floor(this.lines / 10);
        console.log(this.level);
    }
    //=======================================================================
}