import {Route, Routes} from "react-router-dom";
import LineageMain from "../container/bbs/Lineage";
import MainPage from "../Main";

const Router = () => {
    return (
        <Routes>
            <Route path="/" element={<MainPage/>}/>
            <Route path="/lineage" element={<LineageMain/>}/>
        </Routes>
    )
}

export default Router;