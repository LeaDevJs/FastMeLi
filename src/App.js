import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Aplication } from './components/Aplication';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/XwGqmmBuEvRcDaeSpL1CQng3" replace />} />
                <Route path="/:key" element={<Aplication />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;