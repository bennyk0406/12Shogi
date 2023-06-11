/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import { useNavigate } from "react-router-dom"

const Home = () => {
    const navigate = useNavigate()

    return (
        <div
            css={css`
                display: flex;
                gap: 50px;
            `}
        >
            <div
                css={css`
                    padding: 50px;
                    background: #f7f7f7;
                    font-size: 40px;
                    border-radius: 10px;
                    border: 2px black solid;
                `}
                onClick={() => navigate("./game")}
            >
                게임 시작
            </div>
        </div>
    )
}

export { Home }