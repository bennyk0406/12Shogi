import { resolve } from "path"
import express from "express"
import { ClientRes, ServerRes } from "../../interface"
import { Game } from "./game"
import { RawData, WebSocket } from "ws"
import { AlphaBeta } from "./ai"

const app = express()
app.use(express.static(resolve(__dirname, "../../client/build")))
app.use(express.json())
app.get("*", (_, res) => {
    res.sendFile(resolve(__dirname, "../../client/build/index.html"));
})
const server = app.listen(80, () => {
    console.log("The server has started!")
})

const wsServer = new WebSocket.Server({ server })

class UserData {
    socket: WebSocket
    game: Game
    alphabeta: AlphaBeta

    constructor(socket: WebSocket) {
        this.game = new Game()
        this.alphabeta = new AlphaBeta(this.game.board, 1)
        this.socket = socket
    }
}

const users: Map<string, UserData> = new Map()

const generateSessionKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let sessionKey = '';

    for (let i = 0; i < 10; i++) {
        sessionKey += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return sessionKey;
}

wsServer.on("connection", async (socket) => {
    const sessionKey = generateSessionKey()
    users.set(sessionKey, new UserData(socket))
    socket.on("message", response)
    socket.on("close", () => users.delete(sessionKey))
    socket.send(JSON.stringify({
        type: "start",
        content: {
            sessionKey
        }
    }))
    const userData = users.get(sessionKey)
    if (!userData) return
    userData.socket.send(JSON.stringify({
        type: "error",
        content: {
            message: `${userData.game.player === 1 ? "AI" : "당신"}부터 시작합니다`
        }
    }))
    if (userData.game.player === 1) {
        await userData.alphabeta.autoMove()
        userData.game.nextTurn()
        const reply: ServerRes = {
            type: "gameData",
            content: {
                game: userData.game
            }
        }
        userData.socket.send(JSON.stringify(reply))
    }
})

const response = async (data: RawData) => {
    const { query, content, sessionKey } = JSON.parse(data.toString()) as ClientRes
    const userData = users.get(sessionKey) as UserData
    const { game, alphabeta } = userData

    const send = (serverRes: ServerRes) => {
        const { socket } = userData
        if (!socket) return false
        socket.send(JSON.stringify(serverRes))
    }

    const sendGameData = () => {
        const reply: ServerRes = {
            type: "gameData",
            content: {
                game
            }
        }
        send(reply)
    }

    const sendError = (message: string) => {
        const reply: ServerRes = {
            type: "error",
            content: {
                message
            }
        }
        send(reply)
    }

    const nextTurn = async () => {
        game.nextTurn()
        sendGameData()
        const finished = game.board.isFinished(game.player)
        if (finished.result) {
            if (finished.winner === 0) sendError("You win!")
            else sendError("You are defeated.")
            return
        }
    }

    if (query === "move") {
        const result = game.move(content.from, content.to)
        if (result) {
            nextTurn()
            await alphabeta.autoMove()
            nextTurn()
        }
        else sendError("You cannot move it.")
        return
    }
    if (query === "placeDown") {
        const result = game.placeDown(content.pieceName, content.pos)
        if (result) {
            nextTurn()
            await alphabeta.autoMove()
            nextTurn()
        }
        else sendError("You cannot place down it.")
        return
    }
}