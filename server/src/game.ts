type PieceName = "King" | "Sang" | "Jang" | "Ja" | "Hoo"
type CellName = "Blank" | PieceName

class Blank {
    public readonly name = "Blank"
}

class Piece {
    public name: PieceName
    public team: 0 | 1
    public direction: [number, number][]
    public value: number

    constructor(team: 0 | 1, name: PieceName, direction: [number, number][], value: number) {
        this.name = name
        this.team = team
        this.direction = direction
        this.value = value
    }

    changeTeam() {
        this.team ^= 1
    }
}

class KingPiece extends Piece {
    public readonly name = "King"

    constructor(team: 0 | 1) {
        super(team, "King", [[0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0], [-1, 1]], 100)
        this.name = "King"
    }
}

class SangPiece extends Piece {
    public readonly name = "Sang"

    constructor(team: 0 | 1) {
        super(team, "Sang", [[1, 1], [1, -1], [-1, -1], [-1, 1]], 9)
        this.name = "Sang"
    }
}

class JangPiece extends Piece {
    public readonly name = "Jang"

    constructor(team: 0 | 1) {
        super(team, "Jang", [[0, 1], [1, 0], [0, -1], [-1, 0]], 8)
        this.name = "Jang"
    }
}

class JaPiece extends Piece {
    public readonly name = "Ja"

    constructor(team: 0 | 1) {
        super(team, "Ja", [team === 1 ? [1, 0] : [-1, 0]], 6)
    }

    changeTeam() {
        this.team ^= 1
        this.direction = [this.team === 1 ? [1, 0] : [-1, 0]]
    }
}

class HooPiece extends Piece {
    public readonly name = "Hoo"

    constructor(team: 0 | 1) {
        super(team, "Hoo", team === 1 ? [[0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, 0]] : [[0, 1], [1, 0], [0, -1], [-1, -1], [-1, 0], [-1, 1]], 13)
    }
}

type PieceType = KingPiece | SangPiece | JangPiece | JaPiece | HooPiece
type CellType = Blank | PieceType

class Game {
    public board: Board
    public player: 0 | 1

    constructor() {
        this.board = new Board()
        this.player = Math.floor(Math.random() * 2) as 0 | 1
    }

    move(from: number, to: number) {
        return this.board.move(from, to, this.player)
    }

    placeDown(pieceName: PieceName, pos: number) {
        return this.board.placeDown(pieceName, pos, this.player)
    }

    nextTurn() {
        this.player ^= 1
    }
}

const copyCell = (cell: CellType) => {
    if (cell.name === "King") {
        return new KingPiece(cell.team)
    }
    if (cell.name === "Sang") {
        return new SangPiece(cell.team)
    }
    if (cell.name === "Jang") {
        return new JangPiece(cell.team)
    }
    if (cell.name === "Ja") {
        return new JaPiece(cell.team)
    }
    if (cell.name === "Hoo") {
        return new HooPiece(cell.team)
    }
    return new Blank()
}

const copyCellList = (cellList: CellType[]) => {
    return cellList.map((cell) => copyCell(cell))
}

const copyPOW = (pow: [PieceType[], PieceType[]]) => {
    return [pow[0].map((piece) => copyCell(piece)), pow[1].map((piece) => copyCell(piece))] as [PieceType[], PieceType[]]
}

class Board {
    public cellList: CellType[]
    public pow: [PieceType[], PieceType[]]

    constructor(rawBoard?: Board) {
        this.cellList = rawBoard ? copyCellList(rawBoard.cellList) : [
            new JangPiece(1),
            new KingPiece(1),
            new SangPiece(1),
            new Blank(),
            new JaPiece(1),
            new Blank(),
            new Blank(),
            new JaPiece(0),
            new Blank(),
            new SangPiece(0),
            new KingPiece(0),
            new JangPiece(0)
        ]
        this.pow = rawBoard ? copyPOW(rawBoard.pow) : [[], []]
    }

    getCell(pos: number) {
        return this.cellList[pos]
    }

    setCell(pos: number, piece: CellType) {
        return this.cellList[pos] = piece
    }

    withinBoard(y: number, x: number) {
        return 0 <= x && x < 3 && 0 <= y && y < 4
    }

    posFromCoord(y: number, x: number) {
        return 3 * y + x
    }

    coordFromPos(pos: number) {
        return [Math.floor(pos / 3), pos % 3]
    }

    canMove(from: number, to: number, player: 0 | 1) {
        const fromCell = this.getCell(from)
        const toCell = this.getCell(to)
        if (fromCell instanceof Blank || fromCell.team !== player) return false
        const [fromY, fromX] = this.coordFromPos(from)
        const [toY, toX] = this.coordFromPos(to)
        if (!fromCell.direction.some(([dy, dx]) => toY === fromY + dy && toX === fromX + dx)) return false
        if (toCell instanceof Piece && fromCell.team === toCell.team) return false
        return true
    }

    move(from: number, to: number, player: 0 | 1) {
        if (!this.canMove(from, to, player)) return false
        const fromCell = this.getCell(from) as Piece
        const toCell = this.getCell(to)
        this.setCell(from, new Blank())
        if (fromCell instanceof JaPiece) {
            if (player === 0) {
                if (0 <= to && to < 3) this.setCell(to, new HooPiece(player))
                else this.setCell(to, fromCell)
            }
            else {
                if (9 <= to && to < 12) this.setCell(to, new HooPiece(player))
                else this.setCell(to, fromCell)
            }
        }
        else this.setCell(to, fromCell)
        if (toCell instanceof Piece) {
            if (toCell instanceof HooPiece) {
                this.pow[player].push(new JaPiece(player))
            }
            else {
                toCell.changeTeam()
                this.pow[player].push(toCell)
            }
        }
        return true
    }

    canPlaceDown(pieceName: PieceName, pos: number, player: 0 | 1, powList: PieceType[]) {
        if (powList.every((piece) => piece.name !== pieceName) || this.getCell(pos) instanceof Piece) return false
        if (player === 0 && 0 <= pos && pos < 3) return false
        if (player === 1 && 9 <= pos && pos < 12) return false
        return true
    }

    placeDown(pieceName: PieceName, pos: number, player: 0 | 1) {
        const powList = this.pow[player]
        if (!this.canPlaceDown(pieceName, pos, player, powList)) return false
        const pieceIndex = powList.findIndex((piece) => piece.name === pieceName)
        this.setCell(pos, powList[pieceIndex])
        powList.splice(pieceIndex, 1)
        return true
    }

    allMoves(player: 0 | 1) {
        const ans = []
        for (let i = 0; i < 12; i++) {
            const cell = this.getCell(i)
            if (cell instanceof Blank || cell.team !== player) continue
            const [y, x] = this.coordFromPos(i)
            for (const [dy, dx] of cell.direction) {
                const newY = y + dy
                const newX = x + dx
                const newPos = this.posFromCoord(newY, newX)
                if (this.withinBoard(newY, newX) && this.canMove(i, newPos, player)) ans.push([i, newPos])
            }
        }
        return ans
    }

    boardAfterMove(from: number, to: number, player: 0 | 1) {
        const newBoard = new Board(this)
        newBoard.move(from, to, player)
        return newBoard
    }

    allPlaceDown(player: 0 | 1): [("Sang" | "Jang" | "Ja"), number][] {
        const pieceName = ["Sang", "Jang", "Ja"] as const
        const ans: [("Sang" | "Jang" | "Ja"), number][] = []
        for (const name of pieceName) {
            for (let i = 0; i < 12; i++) {
                const cell = this.getCell(i)
                if (cell instanceof Piece) {
                    for (let j = 0; j < 12; j++) {
                        if (this.canPlaceDown(name, j, player, this.pow[player])) ans.push([name, j])
                    }
                    break
                }
            }
        }
        return ans
    }

    boardAfterPlaceDown(pieceName: PieceName, pos: number, player: 0 | 1) {
        const newBoard = new Board(this)
        newBoard.placeDown(pieceName, pos, player)
        return newBoard
    }

    value(player: 0 | 1) {
        let v = 0
        for (let i = 0; i < 12; i++) {
            const cell = this.getCell(i)
            if (cell instanceof Piece) {
                let cellValue = cell.value
                if (cell instanceof KingPiece) {
                    if (cell.team === 0 && 0 <= i && i < 3) cellValue *= 2
                    if (cell.team === 1 && 9 <= i && i < 12) cellValue *= 2
                }
                if (cell.team === player) v += cellValue
                else v -= cellValue
            }
        }
        return v
    }

    isFinished(player: 0 | 1): {result: true, winner: 0 | 1} | {result: false} {
        if (!this.cellList.some((cell) => cell instanceof KingPiece && cell.team === 0)) return {result: true, winner: 1}
        if (!this.cellList.some((cell) => cell instanceof KingPiece && cell.team === 1)) return {result: true, winner: 0}
        if (player === 0 && this.cellList.slice(0, 3).some((cell) => cell instanceof KingPiece && cell.team === 0)) return {result: true, winner: 0}
        if (player === 1 && this.cellList.slice(9, 12).some((cell) => cell instanceof KingPiece && cell.team === 1)) return {result: true, winner: 1}
        return {result: false}
    }
}

export { Game, Board, type PieceName, KingPiece, SangPiece, JangPiece, JaPiece, Blank }