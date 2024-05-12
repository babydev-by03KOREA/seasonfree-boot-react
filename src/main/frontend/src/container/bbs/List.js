import styled from "styled-components";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass, faPen, faThumbsUp} from "@fortawesome/free-solid-svg-icons";
import {useState} from "react";

const ListPage = ({gameKey}) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);

    return (
        <ListBox>
            <BBSHeader>홍보게시판</BBSHeader>
            <OptionRow>
                {/* TODO API */}
                <OptionButton>전체</OptionButton>
                <OptionButton>리니지</OptionButton>
                <OptionButton>리니지2</OptionButton>
                <OptionButton>리마스터</OptionButton>
            </OptionRow>
            <DivideHr/>

            <FlexRow>
                {/* TODO API */}
                <TitleText>리니지 M</TitleText>
                <SearchAndWriteRow>
                    {/* TODO API */}
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                    <WriteButton><FontAwesomeIcon icon={faPen}/> 쓰기</WriteButton>
                </SearchAndWriteRow>
            </FlexRow>
            <DivideHrBold/>

            <DataTable>
                <thead>
                <tr>
                    <ThThumb>추천</ThThumb>
                    <ThTitle>제목</ThTitle>
                    <Th>닉네임</Th>
                    <Th>작성일</Th>
                    <Th>조회수</Th>
                </tr>
                </thead>
                {/* TODO API */}
                <tbody>
                {/*{posts ? posts.map((post, index) => (*/}
                {/*    <tr key={index}>*/}
                {/*        <Td></Td>*/}
                {/*        <Td></Td>*/}
                {/*        <Td></Td>*/}
                {/*        <Td></Td>*/}
                {/*        <Td></Td>*/}
                {/*    </tr>*/}
                {/*)) : (*/}
                {/*    <tr>*/}
                {/*        <Td colSpan={5}>게시글이 없습니다.</Td>*/}
                {/*    </tr>*/}
                {/*)}*/}
                <tr>
                    <Td>
                        <HighlightButton>
                            <FontAwesomeIcon icon={faThumbsUp} /> 추천
                        </HighlightButton>
                    </Td>
                    <Td>행복서버 행복하러 오세요!</Td>
                    <Td>빵떡이</Td>
                    <Td>2024.05.12</Td>
                    <Td>11</Td>
                </tr>
                </tbody>
            </DataTable>
        </ListBox>
    );
}

// Write 의 경우 800px 로 Editor 가 고정되었기 때문!
// 해당 역할을 여기선 ListBox 가!
const ListBox = styled.div`
    width: 80%;
`;

const BBSHeader = styled.span`
    width: 100%;
    font-size: 40px;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px 0;
    margin-bottom: 20px;
    text-align: center;
`;

const OptionRow = styled.div`
    width: 100%;
    height: 40px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
`;

const OptionButton = styled.button`
    padding: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: black solid 2px;
    background-color: #fff;
    font-size: 15px;
`;

const FlexRow = styled.div`
    //height: 40px;
    display: flex;
    justify-content: space-between;
`;

const TitleText = styled.span`
    width: auto; // 너비 자동 조절
    flex-shrink: 0; // 크기 축소 방지
    margin-right: 20px; // 오른쪽 여백 설정
`;

const SearchAndWriteRow = styled.div``;

const WriteButton = styled.button`
    margin-left: 20px;
    width: 70px;
    height: 30px;
    background-color: #282c34;
    color: white;
`;

const DivideHr = styled.hr``;

const DivideHrBold = styled.hr`
    height: 10px;
    background: black;
    border: 0;
`;

const DataTable = styled.table`
    width: 100%;
    border-collapse: collapse;
`;

const ThThumb = styled.th`
    width: 100px;
    background-color: #f4f4f4;
    padding: 8px;
    //border: 1px solid #ddd;
`;

const ThTitle = styled.th`
    width: 60%;
    background-color: #f4f4f4;
    padding: 8px;
    //border: 1px solid #ddd;
`;

const Th = styled.th`
    background-color: #f4f4f4;
    padding: 8px;
    //border: 1px solid #ddd;
`;

const HighlightButton = styled.button`
    width: 100px;
    height: 40px;
    font-size: 20px;
    background-color: greenyellow;
    color: lightslategray;
    font-weight: bold;
    border-radius: 5px;
    border: 0;
    box-shadow: 2px 2px;
`;

const HighlightTitle = styled.div`

`;

const Td = styled.td`
    padding: 8px;
    border: 1px solid #ddd;
    text-align: left;
`;

export default ListPage;
