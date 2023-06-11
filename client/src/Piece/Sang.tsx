import { type EachPieceProps, Piece } from "./Piece";

const Sang: React.FC<EachPieceProps> = (props) => {
    return (
        <Piece
            team={props.team}
            pos={props.pos}
            selected={props.selected}
            action={props.action}
            text={"相"}
        />
    )
}

export { Sang }