import styled from "styled-components";
import LoginInput from "../common/Input";

const Login = () => {
    return(
        <LoginComponent>
            <LoginInput>

            </LoginInput>
        </LoginComponent>
    );
}

const LoginComponent = styled.div`
    width: 350px;
    height: 180px;
`;



export default Login;