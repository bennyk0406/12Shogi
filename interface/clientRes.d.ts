import { PieceName } from "../server/src/table"

interface ClientResTemplate {
    query: string
    content: object | null
    sessionKey: string
}

interface ClientResStart extends ClientResTemplate {
    query: "start"
    content: null
}

interface ClientResMove extends ClientResTemplate {
    query: "move"
    content: {
        from: number
        to: number
    }
}

interface ClientResPlaceDown extends ClientResTemplate {
    query: "placeDown"
    content: {
        pieceName: PieceName
        pos: number
    }
}


type ClientRes =
    ClientResStart |
    ClientResMove |
    ClientResPlaceDown

export type { ClientRes }