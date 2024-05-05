import Header from "../Header";
import GlobalStyle from "../../styles/GlobalStyle";

const Layout = ({children}) => {
    return (
        <>
            <GlobalStyle/>
            <Header/>
            <div className="main-content">
                {children}
            </div>
        </>
    );
}

export default Layout;