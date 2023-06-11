import { type EachPieceProps, Piece } from "./Piece";

const Hoo: React.FC<EachPieceProps> = (props) => {
    return (
        <Piece
            team={props.team}
            pos={props.pos}
            selected={props.selected}
            action={props.action}
            text={"侯"}
        />
    )
}

export { Hoo }