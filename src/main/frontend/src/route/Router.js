import {Route, Routes} from "react-router-dom";
import MainPage from "../Main";
import ListPage from "../container/bbs/List";
import WritePage from "../container/bbs/Write";
import DetailPage from "../container/bbs/Detail";

// const gameRoutes = {
//     lineage: {path: "/lineage"},
//     lineage2: {path: "/lineage-2"},
//     lineageRemaster: {path: "/lineage-remaster"},
//     lineageM: {path: "/lineage-m"},
//     mue: {path: "/mue"},
//     baram: {path: "/baram"},
//     maple: {path: "/maple"},
//     diablo: {path: "/diablo"},
//     aion: {path: "/aion"},
//     darkeden: {path: "/darkeden"},
//     df: {path: "/df"},
//     stonage: {path: "/stonage"},
//     etc: {path: "/etc"},
// };
//
// const generateRoutes = (routes) => {
//     return Object.keys(routes).map(gameKey => {
//         const game = routes[gameKey];
//         return (
//             <Route key={game.path} path={game.path} element={<ListPage gameKey={gameKey} />} />
//         );
//     });
// };

const Router = () => {
    return (
        <Routes>
            {/*<Route path="/" element={<MainPage/>}/>*/}
            {/*<Route path="/write" element={<WritePage/>}/>*/}
            {/*<Route path="/detail" element={<DetailPage/>}/>*/}
            {/*{generateRoutes(gameRoutes)}*/}

            <Route path="/" element={<MainPage />} />
            <Route path="/:gameKey" element={<ListPage />} />
            <Route path="/:gameKey/write" element={<WritePage />} />
            <Route path="/:gameKey/detail" element={<DetailPage />} />
        </Routes>
    )
}

export default Router;