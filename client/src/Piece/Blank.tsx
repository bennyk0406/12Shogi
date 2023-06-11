/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { type CellProps } from "./Piece";

const Blank: React.FC<CellProps> = (props) => {
    return (
        <div css={css`
            width: 100%;
            height: 100%;
        `} onClick={props.action}>
        </div>
    )
}

export { Blank }