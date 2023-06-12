/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import { PieceType } from "./interface"
import { King } from "./Piece/King"
import { Sang } from "./Piece/Sang"
import { Jang } from "./Piece/Jang"
import { Ja } from "./Piece/Ja"

interface POWProps {
    POW: PieceType[]
    team: 0 | 1
    selectedOrder: number
    action: (order: number) => void
}

const POW: React.FC<POWProps> = (props) => {
    return (
        <div css={css`
            width: 300px;
            border: 2px solid black;
            display: flex;
            flex-direction: column;
            align-items: center;
        `}>
            <div css={css`
                font-size: 30px;
                padding: 10px 0;
            `}>
                Prisoners
            </div>
            <div css={css`
                display: grid;
                width: 260px;
                height: 400px;
                gap: 20px;
                padding-bottom: 20px;
                grid-template-columns: 1fr 1fr;
                grid-template-rows: 1fr 1fr 1fr;
            `}>
                {props.POW.map((piece, order) => {  
                    const isSelected = props.selectedOrder === order && piece.team === 0
                    const action = props.team === 0 ? () => props.action(order) : () => { }
                    if (piece.name === "King") return <King team={props.team} selected={isSelected} action={action} />
                    if (piece.name === "Sang") return <Sang team={props.team} selected={isSelected} action={action} />
                    if (piece.name === "Jang") return <Jang team={props.team} selected={isSelected} action={action} />
                    if (piece.name === "Ja") return <Ja team={props.team} selected={isSelected} action={action} />
                })}
            </div>
        </div>
    )
}

export { POW }