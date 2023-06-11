import { Board, PieceName } from "./game"

interface ActionMove {
    type: "move"
    from: number
    to: number
}

interface ActionPlaceDown {
    type: "placeDown"
    pieceName: PieceName
    pos: number
}

type Action = ActionMove | ActionPlaceDown | null

class AlphaBeta {
    public readonly MAX = 1000
    public readonly MIN = -1000
    public readonly threshold = 9
    public board: Board
    public player: 0 | 1
    public enemy: 0 | 1

    constructor(board: Board, player: 0 | 1) {
        this.board = board
        this.player = player
        this.enemy = (player ^ 1) as 0 | 1
    }

    async autoMove() {
        const action = this.findMax(this.board, this.MIN, this.MAX, 0)[1]
        if (!action) return
        if (action.type === "move") this.board.move(action.from, action.to, this.player)
        else this.board.placeDown(action.pieceName, action.pos, this.player)
    }

    findMax(board: Board, alpha: number, beta: number, depth: number): [number, Action] {
        if (depth >= this.threshold || board.isFinished().result) {
            return [board.value(this.player), null]
        }
        
        let bestAction = null
        const moves = board.allMoves(this.player)
        const places = board.allPlaceDown(this.player)
        const actions = [
            ...moves.map(([from, to]) => ({ type: "move", from, to } as ActionMove)),
            ...places.map(([pieceName, pos]) => ({ type: "placeDown", pieceName, pos } as ActionPlaceDown))
        ].sort(() => Math.random() - 0.5)

        for (const action of actions) {
            if (action.type === "move") {
                const nextBoard = board.boardAfterMove(action.from, action.to, this.player)
                const [newAlpha] = this.findMin(nextBoard, alpha, beta, depth + 1)
                if (alpha < newAlpha) {
                    alpha = newAlpha
                    bestAction = action
                }
                if (beta <= alpha) break
            }
            else {
                const nextBoard = board.boardAfterPlaceDown(action.pieceName, action.pos, this.player)
                const [newAlpha] = this.findMin(nextBoard, alpha, beta, depth + 1)
                if (alpha < newAlpha) {
                    alpha = newAlpha
                    bestAction = action
                }
                if (beta <= alpha) break
            }
        }
        return [alpha, bestAction]
    }

    findMin(board: Board, alpha: number, beta: number, depth: number): [number, Action] {
        if (depth >= this.threshold || board.isFinished().result) {
            return [board.value(this.player), null]
        }
        
        let bestAction = null

        const moves = board.allMoves(this.enemy)
        const places = board.allPlaceDown(this.enemy)
        const actions = [
            ...moves.map(([from, to]) => ({ type: "move", from, to } as ActionMove)),
            ...places.map(([pieceName, pos]) => ({ type: "placeDown", pieceName, pos } as ActionPlaceDown))
        ].sort(() => Math.random() - 0.5)

        for (const action of actions) {
            if (action.type === "move") {
                const nextBoard = board.boardAfterMove(action.from, action.to, this.enemy)
                const [newBeta] = this.findMax(nextBoard, alpha, beta, depth + 1)
                if (beta > newBeta) {
                    beta = newBeta
                    bestAction = action
                }
                if (beta <= alpha) break
            }
            else {
                const nextBoard = board.boardAfterPlaceDown(action.pieceName, action.pos, this.enemy)
                const [newBeta] = this.findMax(nextBoard, alpha, beta, depth + 1)
                if (beta > newBeta) {
                    beta = newBeta
                    bestAction = action
                }
                if (beta <= alpha) break
            }
        }
        return [beta, bestAction]
    }
}

export { AlphaBeta }