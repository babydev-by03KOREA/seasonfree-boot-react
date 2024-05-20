import Router from "./route/Router";
import Layout from "./components/layouts/Layout";
import {AuthProvider} from "./context/Auth";

function App() {
    return (
        <AuthProvider>
            <Layout>
                <Router/>
            </Layout>
        </AuthProvider>
    );
}

export default App;
