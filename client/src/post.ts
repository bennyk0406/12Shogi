import type { ClientRes, ServerRes } from '../../interface'

let ws: WebSocket

const connectWS = (onServerRes: (serverRes: ServerRes) => void) => {
    ws = new WebSocket("ws://localhost:80")
    ws.addEventListener("message", (event) => {
        onServerRes(JSON.parse(event.data) as ServerRes)
    })
}

const send = (clientRes: ClientRes) => {
    ws.send(JSON.stringify(clientRes))
}

export { connectWS, send }