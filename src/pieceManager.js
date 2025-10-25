export default class PieceManager {
    static PieceType = Object.freeze({
        I: 'I',
        J: 'J',
        L: 'L',
        O: 'O',
        S: 'S',
        T: 'T',
        Z: 'Z'
    });

    static Pieces = {
        [this.PieceType.I]: [
            [
                [0, 0, 0, 0],
                [1, 1, 1, 1],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ],
            [
                [0, 0, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 1, 0]
            ],
            [
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [1, 1, 1, 1],
                [0, 0, 0, 0]
            ],
            [
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0]
            ]
        ],

        [this.PieceType.J]: [
            [
                [1, 0, 0],
                [1, 1, 1],
                [0, 0, 0]
            ],
            [
                [0, 1, 1],
                [0, 1, 0],
                [0, 1, 0]
            ],
            [
                [0, 0, 0],
                [1, 1, 1],
                [0, 0, 1]
            ],
            [
                [0, 1, 0],
                [0, 1, 0],
                [1, 1, 0]
            ]
        ],

        [this.PieceType.L]: [
            [
                [0, 0, 1],
                [1, 1, 1],
                [0, 0, 0]
            ],
            [
                [0, 1, 0],
                [0, 1, 0],
                [0, 1, 1]
            ],
            [
                [0, 0, 0],
                [1, 1, 1],
                [1, 0, 0]
            ],
            [
                [1, 1, 0],
                [0, 1, 0],
                [0, 1, 0]
            ]
        ],

        [this.PieceType.O]: [
            [
                [0, 0, 0, 0],
                [0, 1, 1, 0],
                [0, 1, 1, 0],
                [0, 0, 0, 0]
            ],
            [
                [0, 0, 0, 0],
                [0, 1, 1, 0],
                [0, 1, 1, 0],
                [0, 0, 0, 0]
            ],
            [
                [0, 0, 0, 0],
                [0, 1, 1, 0],
                [0, 1, 1, 0],
                [0, 0, 0, 0]
            ],
            [
                [0, 0, 0, 0],
                [0, 1, 1, 0],
                [0, 1, 1, 0],
                [0, 0, 0, 0]
            ]
        ],

        [this.PieceType.S]: [
            [
                [0, 1, 1],
                [1, 1, 0],
                [0, 0, 0]
            ],
            [
                [0, 1, 0],
                [0, 1, 1],
                [0, 0, 1]
            ],
            [
                [0, 0, 0],
                [0, 1, 1],
                [1, 1, 0]
            ],
            [
                [1, 0, 0],
                [1, 1, 0],
                [0, 1, 0]
            ]
        ],

        [this.PieceType.T]: [
            [
                [0, 1, 0],
                [1, 1, 1],
                [0, 0, 0]
            ],
            [
                [0, 1, 0],
                [0, 1, 1],
                [0, 1, 0]
            ],
            [
                [0, 0, 0],
                [1, 1, 1],
                [0, 1, 0]
            ],
            [
                [0, 1, 0],
                [1, 1, 0],
                [0, 1, 0]
            ]
        ],

        [this.PieceType.Z]: [
            [
                [1, 1, 0],
                [0, 1, 1],
                [0, 0, 0]
            ],
            [
                [0, 0, 1],
                [0, 1, 1],
                [0, 1, 0]
            ],
            [
                [0, 0, 0],
                [1, 1, 0],
                [0, 1, 1]
            ],
            [
                [0, 1, 0],
                [1, 1, 0],
                [1, 0, 0]
            ]
        ]
    };

    static boxSizes = {
        [this.PieceType.I]: 4,
        [this.PieceType.J]: 3,
        [this.PieceType.L]: 3,
        [this.PieceType.O]: 4,
        [this.PieceType.S]: 3,
        [this.PieceType.T]: 3,
        [this.PieceType.Z]: 3,
    };

    static leftRightBottom = {
        [this.PieceType.I]: [
            [0, 3, 1],
            [2, 2, 3],
            [0, 3, 2],
            [1, 1, 3]
        ],
        [this.PieceType.J]: [
            [0, 2, 1],
            [1, 2, 2],
            [0, 2, 2],
            [0, 1, 2]
        ],
        [this.PieceType.L]: [
            [0, 2, 1],
            [1, 2, 2],
            [0, 2, 2],
            [0, 1, 2]
        ],
        [this.PieceType.O]: [
            [1, 2, 2],
            [1, 2, 2],
            [1, 2, 2],
            [1, 2, 2]
        ],
        [this.PieceType.S]: [
            [0, 2, 1],
            [1, 2, 2],
            [0, 2, 2],
            [0, 1, 2]
        ],
        [this.PieceType.T]: [
            [0, 2, 1],
            [1, 2, 2],
            [0, 2, 2],
            [0, 1, 2]
        ],
        [this.PieceType.Z]: [
            [0, 2, 1],
            [1, 2, 2],
            [0, 2, 2],
            [0, 1, 2]
        ]
    };

    static wallJump = {
        [this.PieceType.I]: [
            // I-piece имеет особые смещения
            [-2, 1, 0],   // rotation 0: left, right, up (0->1)
            [-1, 2, 0],   // rotation 1: left, right, up (1->2)
            [2, -1, 0],   // rotation 2: left, right, up (2->3)
            [1, -2, 0]    // rotation 3: left, right, up (3->0)
        ],
        [this.PieceType.J]: [
            // J, L, S, T, Z используют стандартные SRS
            [-1, 1, 0],   // rotation 0: left, right, up
            [-1, 1, -1],  // rotation 1: left, right, up
            [-1, 1, 0],   // rotation 2: left, right, up
            [-1, 1, 1]    // rotation 3: left, right, up
        ],
        [this.PieceType.L]: [
            [-1, 1, 0],   // rotation 0
            [-1, 1, -1],  // rotation 1
            [-1, 1, 0],   // rotation 2
            [-1, 1, 1]    // rotation 3
        ],
        [this.PieceType.O]: [
            [0, 0, 0],    // rotation 0
            [0, 0, 0],    // rotation 1
            [0, 0, 0],    // rotation 2
            [0, 0, 0]     // rotation 3
        ],
        [this.PieceType.S]: [
            [-1, 1, 0],   // rotation 0
            [-1, 1, -1],  // rotation 1
            [-1, 1, 0],   // rotation 2
            [-1, 1, 1]    // rotation 3
        ],
        [this.PieceType.T]: [
            [-1, 1, 0],   // rotation 0
            [-1, 1, -1],  // rotation 1
            [-1, 1, 0],   // rotation 2
            [-1, 1, 1]    // rotation 3
        ],
        [this.PieceType.Z]: [
            [-1, 1, 0],   // rotation 0
            [-1, 1, -1],  // rotation 1
            [-1, 1, 0],   // rotation 2
            [-1, 1, 1]    // rotation 3
        ]
    };

    static piecesArray = [
        this.PieceType.I,
        this.PieceType.J,
        this.PieceType.L,
        this.PieceType.O,
        this.PieceType.S,
        this.PieceType.T,
        this.PieceType.Z,
    ];

    static colors = [
        'red',
        'orange',
        'yellow',
        'green',
        'blue',
        'pink',
        'purple',
    ]

    static getRandomFigure()
    {
        const randomIndex = Math.floor(Math.random() * 7);
        const pieceType = this.piecesArray[randomIndex];

        return {
            type : pieceType,
            size : this.boxSizes[pieceType],
            leftRightBottom : this.leftRightBottom[pieceType],
            wallJump: this.wallJump[pieceType],
            rotations : this.Pieces[pieceType],
            rotation : 0,
            blocks : this.Pieces[pieceType][0],
            color : this.colors[randomIndex],
            randomIndex: randomIndex + 1,
        }
    }
}




