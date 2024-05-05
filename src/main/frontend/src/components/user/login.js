import styled from "styled-components";
import InputComponent from "../common/Input";
import React, {useState} from "react";
import ButtonComponent from "../common/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faCalendarCheck} from "@fortawesome/free-regular-svg-icons";

const Login = () => {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');

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
                placeholder={'패스워드를 입력하세요'}
                onChange={setPassword}
            />
            <ButtonComponent
                margin={'7px 0 0 0'}
                text={'로그인'}
            />
            <LoginRow>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <FontAwesomeIcon icon={faCalendarCheck}/>
                    <Attendance>출석체크</Attendance>
                </div>
                <JoinAndFound>회원가입 ID\PW 찾기</JoinAndFound>
            </LoginRow>
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
    justify-content: space-between;  // 각 요소를 양 끝으로 밀어내기
    align-items: center;  // 세로 중앙 정렬
    width: 100%;  // 옵셔널: 컨테이너 전체 너비 사용
`;

const Attendance = styled.span`
    font-weight: bold;
`;

const JoinAndFound = styled.span`
    color: dodgerblue;
`;


export default Login;