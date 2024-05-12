import React, { useState } from 'react';
import styled from 'styled-components';
import FindId from "./FindId";
import ChangePassword from "./ChangePassword";

const FindIdOrPassword = () => {
    // 현재 선택된 탭을 저장하는 state
    const [selectedTab, setSelectedTab] = useState('id');

    // 탭을 클릭할 때 실행되는 함수
    const handleTabClick = (tab) => {
        setSelectedTab(tab);
    };

    return (
        <div>
            <FindIdOrPasswordRow>
                <IdOrPasswordOption
                    active={selectedTab === 'id'}
                    onClick={() => handleTabClick('id')}
                >
                    ID 찾기
                </IdOrPasswordOption>
                <IdOrPasswordOption
                    active={selectedTab === 'password'}
                    onClick={() => handleTabClick('password')}
                >
                    비밀번호 변경하기
                </IdOrPasswordOption>
            </FindIdOrPasswordRow>
            <ContentArea>
                {selectedTab === 'id' ? <FindId/> : <ChangePassword/>}
            </ContentArea>
        </div>
    );
};

const FindIdOrPasswordRow = styled.div`
    display: flex;
    justify-content: space-evenly;
`;

const IdOrPasswordOption = styled.div`
    font-weight: bold;
    padding: 8px 50px;
    cursor: pointer;
    border-bottom: ${(props) => (props.active ? '5px solid #282c34' : 'none')};
`;

const ContentArea = styled.div`
    margin-top: 20px;
`;

export default FindIdOrPassword;
