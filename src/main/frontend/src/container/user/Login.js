import styled from "styled-components";
import React, {useState} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faCalendarCheck} from "@fortawesome/free-regular-svg-icons";
import {LoginApi} from "../../apis/user";
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
    const [isFindIdOrPasswordOpen, setIsFindIdOrPasswordOpen] = useState(false);

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
        // validation

        await LoginApi(userId, password);
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
            <OptionRow>
                <CalendarCheck onClick={handleAttendanceOpenPopup}>
                    <FontAwesomeIcon icon={faCalendarCheck}/>
                    <AttendanceCheck>출석체크</AttendanceCheck>
                </CalendarCheck>
                <JoinAndFound>
                    <JoinButton onClick={handleJoinOpenPopup}>회원가입</JoinButton>
                    <FoundButton onClick={handleOpenFindIdOrPassword}>ID\PW 찾기</FoundButton>
                </JoinAndFound>
            </OptionRow>
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
            {isFindIdOrPasswordOpen && (
                <Popup
                    isOpen={isFindIdOrPasswordOpen}
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

const OptionRow = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%; // 전체 너비를 사용하도록 설정
`;

const CalendarCheck = styled.div`
    cursor: pointer;
    display: flex;
    align-items: center; // 아이콘과 텍스트를 세로 중앙 정렬
    margin-left: 10px;
`;

const AttendanceCheck = styled.span`
    margin-left: 2px;
`; // div 대신 span 사용을 권장 (인라인 요소로)

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