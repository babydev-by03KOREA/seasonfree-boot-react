import styled from "styled-components";
import logoImage from "../assets/images/logo.png";
import {useNavigate} from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();

    const navigationMain = () => {
        navigate("/");
    };

    return (
        <MainHeader>
            <LogoImage onClick={navigationMain}/>
            <GameMenu>리니지</GameMenu>
            <GameMenu>뮤</GameMenu>
            <GameMenu>바람의 나라</GameMenu>
            <GameMenu>메이플</GameMenu>
            <GameMenu>디아블로</GameMenu>
            <GameMenu>아이온</GameMenu>
            <GameMenu>다크에덴</GameMenu>
            <GameMenu>던파</GameMenu>
            <GameMenu>스톤에이지</GameMenu>
            <GameMenu>기타</GameMenu>
            <CSMenu>고객센터</CSMenu>
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
`;

const CSMenu = styled.div`
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
`;

export default Header;