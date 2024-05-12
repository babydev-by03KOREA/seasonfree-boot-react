import styled from "styled-components";
import React, {useState} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faCalendarCheck} from "@fortawesome/free-regular-svg-icons";
import {LoginApi} from "../../apis/auth";
import InputComponent from "../../components/common/Input";
import ButtonComponent from "../../components/common/Button";
import Popup from "../../components/common/Popup";
import StyledCalendar from "./Calendar";
import Join from "./Join";
import FindIdOrPassword from "./FindIdOrPassword";

const Login = () => {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [isAttendancePopupOpen, setIsAttendancePopupOpen] = useState(false);
    const [isJoinPopupOpen, setIsJoinPopupOpen] = useState(false);
    const [isfindIdOrPasswordOpen, setIsFindIdOrPasswordOpen] = useState(false);

    const handleAttendanceOpenPopup = () => {
        setIsAttendancePopupOpen(true);
    };

    const handleAttendanceClosePopup = () => {
        setIsAttendancePopupOpen(false);
    };

    const handleJoinOpenPopup = () => {
        setIsJoinPopupOpen(true);
    }

    const handleJoinClosePopup = () => {
        setIsJoinPopupOpen(false);
    }

    const handleOpenFindIdOrPassword = () => {
        setIsFindIdOrPasswordOpen(true);
    }

    const handleFindIdOrPasswordClosePopup = () => {
        setIsFindIdOrPasswordOpen(false);
    }

    const Login = async () => {
        try {
            const data = await LoginApi(userId, password);
            console.log('로그인 성공:', data.body);
        } catch (error) {
            console.error('로그인 실패:', error);
            // 에러 처리 로직
        }
    };

    return(
        <LoginContainer>
            <InputComponent
                width={'320px'}
                height={'20px'}
                placeholder={'아이디를 입력하세요'}
                onChange={setUserId}
            />
            <InputComponent
                width={'320px'}
                height={'20px'}
                margin={'7px 0 0 0'}
                type={'password'}
                placeholder={'암호를 입력하세요'}
                onChange={setPassword}
            />
            <ButtonComponent
                margin={'7px 0 0 0'}
                text={'로그인'}
                onClick={Login}
            />
            <LoginRow>
                <div onClick={handleAttendanceOpenPopup}>
                    <FontAwesomeIcon icon={faCalendarCheck}/>
                    <AttendanceCheck>출석체크</AttendanceCheck>
                </div>
                <div>
                    <JoinButton onClick={handleJoinOpenPopup}>회원가입</JoinButton>
                    <FoundButton onClick={handleOpenFindIdOrPassword}>ID\PW 찾기</FoundButton>
                </div>
            </LoginRow>
            {/* 만약 '출석체크'를 눌렀다면 팝업창을 띄워주세요. */}
            {isAttendancePopupOpen && (
                <Popup
                    isOpen={isAttendancePopupOpen}
                    title="출석부"
                    content={<StyledCalendar/>}
                    onClose={handleAttendanceClosePopup}
                />
            )}
            {isJoinPopupOpen && (
                <Popup
                    isOpen={isJoinPopupOpen}
                    title="회원가입"
                    content={<Join/>}
                    onClose={handleJoinClosePopup}
                />
            )}
            {isfindIdOrPasswordOpen && (
                <Popup
                    isOpen={isfindIdOrPasswordOpen}
                    title="아이디/비밀번호 찾기"
                    content={<FindIdOrPassword/>}
                    onClose={handleFindIdOrPasswordClosePopup}
                />
            )}
        </LoginContainer>
    );
}

const LoginContainer = styled.div`
    width: 350px;
    height: 150px;
    border: 1px solid #282c34;
    margin: 5px 0;
    padding-top: 20px;
    display: flex;
    flex-flow: column;
    align-items: center;
`;

const LoginRow = styled.div`
    margin: 10px 0;
    display: flex;
`;

const AttendanceCheck = styled.span`
    font-weight: bold;
`;

const JoinButton = styled.span`
    color: dodgerblue;
    font-weight: bold;
`;

const FoundButton = styled.span`
    color: dodgerblue;
    font-weight: bold;
`;

export default Login;