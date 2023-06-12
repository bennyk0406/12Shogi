import { css } from "@emotion/react";
import { type EachPieceProps, Piece } from "./Piece";

const King: React.FC<EachPieceProps> = (props) => {
    return (
        <Piece
            team={props.team}
            pos={props.pos}
            selected={props.selected}
            action={props.action}
            text={"王"}
            style={css`
                background: ${props.selected ? "gray" : (props.team === 0 ? "rgb(0, 82, 32)" : "rgb(180, 7, 17)")};
                color: white;
            `}
        />
    )
}

export { King }