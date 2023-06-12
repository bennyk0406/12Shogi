/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import { useEffect, useState } from "react"
import { King } from "./Piece/King"
import { Sang } from "./Piece/Sang"
import { Jang } from "./Piece/Jang"
import { Blank } from "./Piece/Blank"
import { Ja } from "./Piece/Ja"
import { connectWS, send } from "./post"
import { Game as GameData } from "./interface"
import { POW } from "./POW"
import type { ServerRes } from "../../interface"
import { Hoo } from "./Piece/Hoo"

const Game = () => {
    const [game, setGame] = useState<GameData>(new GameData())
    const [selectedPos, setSelectedPos] = useState<number>(-1)
    const [selectedPOWOrder, setSelectedPOWOrder] = useState<number>(-1)

    const clickPiece = async (pos: number) => {
        if (game.player !== 0) return
        if (selectedPOWOrder !== -1) {
            setSelectedPOWOrder(-1)
            send({
                query: "placeDown",
                content: {
                    pieceName: game.board.pow[0][selectedPOWOrder].name,
                    pos
                },
                sessionKey: localStorage["sessionKey"]
            })
        }
        setSelectedPOWOrder(-1)
        if (selectedPos === -1) {
            const toCell = game.board.cellList[pos]
            if (toCell.name === "Blank" || toCell.team === 1) return
            setSelectedPos(pos)
            return
        }
        if (selectedPos === pos) {
            setSelectedPos(-1)
            return
        }
        send({
            query: "move",
            content: {
                from: selectedPos,
                to: pos
            },
            sessionKey: localStorage["sessionKey"]
        })
        setSelectedPos(-1)
    }

    const clickPOWPiece = async (order: number) => {
        setSelectedPos(-1)
        if (selectedPOWOrder === -1) {
            setSelectedPOWOrder(order)
            return
        }
        if (selectedPOWOrder === order) {
            setSelectedPOWOrder(-1)
            return
        }
    }

    const onServerRes = (serverRes: ServerRes) => {
        if (serverRes.type === "gameData") {
            setGame(serverRes.content.game)
            return
        }
        if (serverRes.type === "error") {
            window.alert(serverRes.content.message)
            return
        }
        if (serverRes.type === "start") {
            localStorage["sessionKey"] = serverRes.content.sessionKey
        }
    }
    
    useEffect(() => {
        connectWS(onServerRes)
    }, [])

    return (
        <div css={css`
            display: flex;
            flex-direction: row;
            gap: 50px;
        `}>
            <div css={css`
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
            `}>
                <POW game={game} POW={game.board.pow[1]} team={1} selectedOrder={selectedPOWOrder} action={clickPOWPiece} />
            </div>
            <div css={css`
                display: grid;
                height: 90vh;
                aspect-ratio: 3/4;
                grid-template-columns: repeat(3, 1fr);
                grid-template-rows: repeat(4, 1fr);
                border: 1px solid black;
                background: #E3A955;
            `}>
                {
                    game.board.cellList.map((cell, pos) => {
                        if (cell.name === "King") return <King team={cell.team} pos={pos} selected={pos === selectedPos} action={() => { clickPiece(pos) }} />
                        if (cell.name === "Sang") return <Sang team={cell.team} pos={pos} selected={pos === selectedPos} action={() => { clickPiece(pos) }} />
                        if (cell.name === "Jang") return <Jang team={cell.team} pos={pos} selected={pos === selectedPos} action={() => { clickPiece(pos) }} />
                        if (cell.name === "Ja") return <Ja team={cell.team} pos={pos} selected={pos === selectedPos} action={() => { clickPiece(pos) }} />
                        if (cell.name === "Hoo") return <Hoo team={cell.team} pos={pos} selected={pos === selectedPos} action={() => { clickPiece(pos) }} />
                        return <Blank pos={pos} selected={pos === selectedPos} action={() => { clickPiece(pos) }} />
                    }).map((element, pos) =>
                        <div css={css`
                            border: 1px solid black;
                            display: flex;
                            width: 100%;
                            height: 100%;
                            padding: 10px;
                            box-sizing: border-box;
                            background: ${0 <= pos && pos < 3 ? "rgb(170, 88, 72)" : (9 <= pos && pos < 12 ? "rgb(137, 159, 88)" : "rgb(224, 197, 142)")};
                        `}>
                            {element}
                        </div>
                    )
                }
            </div>
            <div css={css`
                display: flex;
                flex-direction: column;
                justify-content: flex-end;
            `}>
                <POW game={game} POW={game.board.pow[0]} team={0} selectedOrder={selectedPOWOrder} action={clickPOWPiece} />
            </div>
        </div>
    )
}

export { Game }