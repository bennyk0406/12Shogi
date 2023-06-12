/** @jsxImportSource @emotion/react */
import { SerializedStyles, css } from "@emotion/react";

interface CellProps {
    pos?: number;
    selected?: boolean;
    action?: () => void;
}

interface EachPieceProps extends CellProps {
    team: number;
}

interface PieceProps extends EachPieceProps {
    text: string;
    style?: SerializedStyles
}

const Piece: React.FC<PieceProps> = (props) => {
    return (
        <div css={css`
            border: 5px solid ${props.team === 1 ? "#c34e48" : "#47783c"}; 
            aspect-ratio: 1/1;
            transform: ${props.team === 1 ? "rotate(180deg)" : ""};
            flex-grow: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 60px;
            background-color: ${props.selected ? "gray" : "white"};
            ${props.style}
        `} onClick={props.action}>
            {props.text}
        </div>
    )
}

export { type CellProps, type EachPieceProps, Piece }