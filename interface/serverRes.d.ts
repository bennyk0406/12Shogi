import { Game } from "../server/src/table";

interface ServerResTemplate {
    type: string
    content: object | null
}

interface ServerResStart extends ServerResTemplate {
    type: "start"
    content: {
        sessionKey: string
    }
}

interface ServerResError extends ServerResTemplate {
    type: "error"
    content: {
        message: string
    }
}

interface ServerResGameData extends ServerResTemplate {
    type: "gameData"
    content: {
        game: Game
    }
}

type ServerRes =
    ServerResStart |
    ServerResError |
    ServerResGameData

export type { ServerRes }