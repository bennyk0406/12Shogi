import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Home } from "./Home"
import { Game } from "./Game"

const App = () =>
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/game" element={<Game />} />
        </Routes>
    </BrowserRouter>

export default App