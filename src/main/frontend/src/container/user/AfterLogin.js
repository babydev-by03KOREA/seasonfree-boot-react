import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import Popup from "../../components/common/Popup";
import StyledCalendar from "./Calendar";
import React, {useEffect, useState} from "react";
import {faCalendarCheck} from "@fortawesome/free-regular-svg-icons";

const AfterLogin = ({ nickname, points, imageUrl }) => {
    const onLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        Swal.fire({
            title: "로그아웃",
            text: "로그아웃 처리되었습니다.",
            icon: "success"
        }).then(() => {
            window.location.reload();
        });
    };

    const [isAttendancePopupOpen, setIsAttendancePopupOpen] = useState(false);

    const handleAttendanceOpenPopup = () => {
        setIsAttendancePopupOpen(true);
    };

    const handleAttendanceClosePopup = () => {
        setIsAttendancePopupOpen(false);
    };

    return (
        <LoginContainer>
            <ProfileRow>
                <ProfileIcon>
                    {imageUrl ? (
                        <ProfileImage src={imageUrl} alt="user profile" />
                    ) : (
                        <FontAwesomeIcon icon={faUser} size="lg" />
                    )}
                </ProfileIcon>
                <NickNameAndPointBox>
                    <Nickname>{nickname || "Nickname"}</Nickname>
                    <Points>{points ? `${points} 포인트` : "0 포인트"}</Points>
                </NickNameAndPointBox>
            </ProfileRow>
            <CalendarCheck onClick={handleAttendanceOpenPopup}>
                <FontAwesomeIcon icon={faCalendarCheck} />
                <AttendanceCheck>출석체크</AttendanceCheck>
            </CalendarCheck>
            <LogoutButton onClick={onLogout}>
                <FontAwesomeIcon icon={faSignOutAlt} /> 로그아웃
            </LogoutButton>
            {isAttendancePopupOpen && (
                <Popup
                    isOpen={isAttendancePopupOpen}
                    title="출석부"
                    content={<StyledCalendar />}
                    onClose={handleAttendanceClosePopup}
                />
            )}
        </LoginContainer>
    );
};

const LoginContainer = styled.div`
    width: 350px;
    height: 150px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    border: 1px solid #282c34;
`;

const ProfileRow = styled.div`
    display: flex;
    align-items: center;
`;

const ProfileIcon = styled.div`
    width: 50px;  /* 사이즈 조정 */
    height: 50px; /* 사이즈 조정 */
    background-color: gray;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    margin-right: 20px;  /* 좌측 간격 조정 */

    svg {
        width: 100%;
        height: auto;
        color: white;
    }
`;

const CalendarCheck = styled.div`
    cursor: pointer;
    display: flex;
    align-items: center; // 아이콘과 텍스트를 세로 중앙 정렬
    margin-left: 10px;
`;

const AttendanceCheck = styled.span`
    margin-left: 2px;
`;

const ProfileImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

const NickNameAndPointBox = styled.div`
    display: flex;
    flex-direction: column;
    margin-right: 10px; /* 마진 조정 */
`;

const Nickname = styled.span`
    font-size: 16px;
    font-weight: bold;
`;

const Points = styled.span`
    font-size: 14px;
`;

const LogoutButton = styled.button`
    padding: 5px 10px;
    background-color: white;  /* 배경 색상 변경 */
    color: black;
    font-size: 14px;
    border: none;
    border-radius: 30%;  /* border-radius 조정 */
    cursor: pointer;
    display: flex;
    align-items: center;
    svg {
        margin-right: 5px;
    }
`;

export default AfterLogin;
