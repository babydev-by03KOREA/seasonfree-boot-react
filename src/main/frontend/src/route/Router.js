import {Route, Routes} from "react-router-dom";
import MainPage from "../Main";
import ListPage from "../container/bbs/List";
import WritePage from "../container/bbs/Write";
import DetailPage from "../container/bbs/Detail";

const gameRoutes = {
    lineage: {
        path: "/lineage",
        children: {
            "lineage-2": {
                path: "/lineage/lineage-2",
            },
            "remaster": {
                path: "/lineage/remaster",
            },
            "lineage-m": {
                path: "/lineage/lineage-m",
            }
        }
    },
    mue: {path: "/mue"},
    baram: {path: "/baram"},
    maple: {path: "/maple"},
    diablo: {path: "/diablo"},
    aion: {path: "/aion"},
    darkeden: {path: "/darkeden"},
    df: {path: "/df"},
    stonage: {path: "/stonage"},
    etc: {path: "/etc"},
};

const generateRoutes = (routes) => {
    return Object.keys(routes).map(gameKey => {
        const game = routes[gameKey];
        const childRoutes = game.children && Object.keys(game.children).length > 0
            ? generateRoutes(game.children)
            : [];

        return (
            <Route path={game.path} element={<ListPage gameKey={gameKey}/>}>
                {childRoutes}
            </Route>
        );
    });
};

const Router = () => {
    return (
        <Routes>
            <Route path="/" element={<MainPage/>}/>
            <Route path="/write" element={<WritePage/>}/>
            {/*<Route path="/list" element={<ListPage/>}/>*/}
            <Route path="/detail" element={<DetailPage/>}/>
            {generateRoutes(gameRoutes)}
        </Routes>
    )
}

export default Router;