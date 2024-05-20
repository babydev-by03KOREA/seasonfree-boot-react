import styled from "styled-components";
import React, {useState} from "react";
import InputComponent from "../../components/common/Input";
import ButtonComponent from "../../components/common/Button";
import Popup from "../../components/common/Popup";
import Join from "./Join";
import FindIdOrPassword from "./FindIdOrPassword";
import {LoginApi} from "../../apis/User";
import {useAuthDispatch, useAuthState} from "../../context/Auth";

const Login = () => {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [isJoinPopupOpen, setIsJoinPopupOpen] = useState(false);
    const [isFindIdOrPasswordOpen, setIsFindIdOrPasswordOpen] = useState(false);

    const handleJoinOpenPopup = () => {
        setIsJoinPopupOpen(true);
    };

    const handleJoinClosePopup = () => {
        setIsJoinPopupOpen(false);
    };

    const handleOpenFindIdOrPassword = () => {
        setIsFindIdOrPasswordOpen(true);
    };

    const handleFindIdOrPasswordClosePopup = () => {
        setIsFindIdOrPasswordOpen(false);
    };

    const dispatch = useAuthDispatch();

    const handleLogin = async () => {
        await LoginApi(userId, password, dispatch);
    };

    return (
        <LoginContainer>
            <InputComponent
                width={'320px'}
                height={'20px'}
                placeholder={'아이디를 입력하세요'}
                onChange={e => setUserId(e.target.value)}
            />
            <InputComponent
                width={'320px'}
                height={'20px'}
                margin={'7px 0 0 0'}
                type={'password'}
                placeholder={'암호를 입력하세요'}
                onChange={e => setPassword(e.target.value)}
            />
            <ButtonComponent
                margin={'7px 0 0 0'}
                text={'로그인'}
                onClick={handleLogin}
            />
            <OptionRow>
                <JoinAndFound>
                    <JoinButton onClick={handleJoinOpenPopup}>회원가입</JoinButton>
                    <FoundButton onClick={handleOpenFindIdOrPassword}>ID/PW 찾기</FoundButton>
                </JoinAndFound>
            </OptionRow>
            {isJoinPopupOpen && (
                <Popup
                    isOpen={isJoinPopupOpen}
                    title="회원가입"
                    content={<Join />}
                    onClose={handleJoinClosePopup}
                />
            )}
            {isFindIdOrPasswordOpen && (
                <Popup
                    isOpen={isFindIdOrPasswordOpen}
                    title="아이디/비밀번호 찾기"
                    content={<FindIdOrPassword />}
                    onClose={handleFindIdOrPasswordClosePopup}
                />
            )}
        </LoginContainer>
    );
};

const LoginContainer = styled.div`
    width: 350px;
    height: 150px;
    border: 1px solid #282c34;
    padding-top: 20px;
    display: flex;
    flex-flow: column;
    align-items: center;
    margin-bottom: 5px;
`;

const OptionRow = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%; // 전체 너비를 사용하도록 설정
`;

const JoinAndFound = styled.div`
    display: flex;
    gap: 10px; // 버튼 사이에 간격 추가
`;

const JoinButton = styled.span`
    padding: 5px 0;
    color: dodgerblue;
    cursor: pointer;
`;

const FoundButton = styled.span`
    padding: 5px 0;
    cursor: pointer;
    color: dodgerblue;
    margin-right: 10px;
`;

export default Login;