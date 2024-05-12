import {Route, Routes} from "react-router-dom";
import MainPage from "../Main";
import Write from "../container/bbs/Write";

const Router = () => {
    return (
        <Routes>
            <Route path="/" element={<MainPage/>}/>
            <Route path="/write" element={<Write/>}/>
        </Routes>
    )
}

export default Router;