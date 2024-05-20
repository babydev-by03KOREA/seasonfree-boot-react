import styled from "styled-components";
import logoImage from "../assets/images/logo.png";
import Lineage from "../assets/images/games/Untitled-2-01.png";
import Mue from "../assets/images/games/Untitled-2-02.png"
import CountryOfWind from "../assets/images/games/Untitled-2-03.png"
import Maple from "../assets/images/games/Untitled-2-04.png"
import Diablo from "../assets/images/games/Untitled-2-05.png"
import Iron from "../assets/images/games/Untitled-2-06.png"
import Dunpa from "../assets/images/games/Untitled-2-07.png"
import DarkYeden from "../assets/images/games/Untitled-2-08.png"
import StonAge from "../assets/images/games/Untitled-2-09.png"
import Etc from "../assets/images/games/Untitled-2-10.png"
import CS from "../assets/images/games/Untitled-2-11.png"
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import Popup from "./common/Popup";
import CustomerService from "../container/user/CustomerService";
import {useAuthState} from "../context/Auth";

const Header = () => {
    const navigate = useNavigate();
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const { user } = useAuthState();

    const handleOpenPopup = () => {
        setIsPopupOpen(true);
    }

    const handleClosePopup = () => {
        setIsPopupOpen(false);
    }

    const navigationMain = () => {
        navigate("/");
    };

    const handleCustomerServiceClick = () => {
        handleOpenPopup();
    };

    const handleNavigate = (path) => {
        navigate(path);
    }

    const handleOptionClick = (option) => {
        switch(option) {
            case "리니지2":
                handleNavigate('/lineage2');
                break;
            case "리마스터":
                handleNavigate('/remaster');
                break;
            case "리니지M":
                handleNavigate('/lineage_m');
                break;
            default:
                break;
        }
    };

    const MenuValues = [
        {
            name: "리니지",
            image: Lineage,
            path: "/lineage",
            hoverOptions: {
                option1: "리니지2",
                option2: "리마스터",
                option3: "리니지M"
            },
            onOptionClick: handleOptionClick
        },
        {name: "뮤", image: Mue, hoverOptions: {}, path: "/mue"},
        {name: "바람의나라", image: CountryOfWind, hoverOptions: {},  path: "/baram"},
        {name: "메이플", image: Maple, hoverOptions: {},  path: "/maple"},
        {name: "디아블로", image: Diablo, hoverOptions: {},  path: "/diablo"},
        {name: "아이온", image: Iron, hoverOptions: {}, path: "/aion"},
        {name: "다크에덴", image: DarkYeden, hoverOptions: {}, path: "/darkeden"},
        {name: "던파", image: Dunpa, hoverOptions: {}, path: "/df"},
        {name: "스톤에이지", image: StonAge, hoverOptions: {}, path: "/stonage"},
        {name: "기타", image: Etc, hoverOptions: {}, path: "/etc"},
        {
            name: user && user.role === 'ROLE_ADMIN' ? "문의내용" : "고객센터",
            image: CS,
            hoverOptions: {},
            onClick: user && user.role === 'ROLE_ADMIN' ? () => handleNavigate('/admin/support') : handleOpenPopup
        }
    ];

    return (
        <MainHeader>
            <LogoImage onClick={navigationMain}/>
            {MenuValues.map((game) => (
                <GameMenu key={game.name}>
                    <GameImage style={{backgroundImage: `url(${game.image})`}} onClick={() => game.onClick ? game.onClick() : handleNavigate(game.path)} />
                    <GameName onClick={() => game.onClick ? game.onClick() : handleNavigate(game.path)}>{game.name}</GameName>
                    {Object.keys(game.hoverOptions).length > 0 && (
                        <DropdownContent className="dropdown-content">
                            {Object.entries(game.hoverOptions).map(([key, value]) => (
                                <DropdownItem key={key} onClick={() => game.onOptionClick(value)}>
                                    {value}
                                </DropdownItem>
                            ))}
                        </DropdownContent>
                    )}
                </GameMenu>
            ))}
            {isPopupOpen && (
                <Popup
                    isOpen={isPopupOpen}
                    title={"고객센터에 문의하기"}
                    content={<CustomerService />}
                    onClose={handleClosePopup}
                />
            )}
        </MainHeader>
    );
}

const MainHeader = styled.header`
    width: 100%;
    height: 70px;
    margin: 0 auto;
    display: flex;
    color: white;
    background-color: black;
`;

const LogoImage = styled.div`
    background-image: url(${logoImage});
    width: 200px;
    height: 100%;
    padding-right: 10px;
    background-size: contain;
    background-repeat: no-repeat;
    cursor: pointer;
`;

// 내부에 이미지 혹은 아이콘 좌측 배치,
const GameMenu = styled.div`
    // 아이템이 자신의 내용에 따라 크기 조정
    flex: 0 1 auto;
    padding: 0 10px; // 패딩으로 내부 여백 추가
    display: flex;
    align-items: center; // 세로 중앙 정렬
    justify-content: center; // 가로 중앙 정렬
    cursor: pointer;
    position: relative; // 드롭다운 위치를 위해 relative 설정

    &:hover {
        background-color: white; // 호버 배경색 변경
        color: black;
        font-weight: bold;

        > div.dropdown-content {
            display: block; // 드롭다운 보여주기
            background-color: black;
        }
    }
`;

const GameImage = styled.div`
    width: 40px; // 이미지의 너비 지정
    height: 40px; // 이미지의 높이 지정
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white; // 텍스트 색상 변경 가능
    margin: 0 5px; // 각 이미지 간 간격 조정
`;

const DropdownContent = styled.div`
    display: none; // 기본적으로 숨김
    position: absolute;
    background-color: #f9f9f9;
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    z-index: 1; // 다른 내용 위에 표시
    left: 0; // GameMenu의 왼쪽 정렬
    top: 100%; // GameMenu 아래에 위치
`;

const DropdownItem = styled.div`
    color: white;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
    cursor: pointer;
    //  밑줄 긋는법
    border-bottom: gray;
`;

const GameName = styled.div`
    font-weight: bold;
`;

export default Header;