import {Route, Routes} from "react-router-dom";
import MainPage from "../Main";
import ListPage from "../container/bbs/List";
import WritePage from "../container/bbs/Write";

// const gameRoutes = {
//     lineage: {
//         path: "/lineage",
//         children: {
//             "lineage-2": {
//                 path: "/lineage/lineage-2",
//             },
//             "remaster": {
//                 path: "/lineage/remaster",
//             },
//             "lineage-m": {
//                 path: "/lineage/lineage-m",
//             }
//         }
//     },
// };
//
// const generateRoutes = (routes) => {
//     return Object.keys(routes).map(gameKey => {
//         const game = routes[gameKey];
//         const childRoutes = game.children && Object.keys(game.children).length > 0
//             ? generateRoutes(game.children)
//             : [];
//
//         return (
//             <Route path={game.path} element={<ListPage gameKey={gameKey}/>}>
//                 {childRoutes}
//             </Route>
//         );
//     });
// };

const Router = () => {
    return (
        <Routes>
            <Route path="/" element={<MainPage/>}/>
            <Route path="/write" element={<WritePage/>}/>
            <Route path="/list" element={<ListPage/>}/>
            {/*{generateRoutes(gameRoutes)}*/}
        </Routes>
    )
}

export default Router;