import React, {useState, useEffect} from 'react';
import {useNavigate, useLocation, useParams} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    faMagnifyingGlass,
    faPen,
    faThumbsUp,
    faLessThan,
    faGreaterThan,
    faAnglesLeft,
    faAnglesRight
} from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import {GetPost} from "../../apis/BBS";

const ListPage = () => {
    const {gameKey} = useParams();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const rowsPerPage = 15;

    const navigate = useNavigate();
    const location = useLocation();

    // Get the current page from URL query
    const queryParams = new URLSearchParams(location.search);
    const currentPage = parseInt(queryParams.get('page')) || 1;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const { posts, totalRows } = await GetPost(gameKey, currentPage);
                setPosts(posts);
                setTotalRows(totalRows);
            } catch (error) {
                console.error('Error fetching data:', error);
                setPosts([]);
                setTotalRows(0);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [gameKey, currentPage]);

    const totalPages = Math.ceil(totalRows / rowsPerPage);
    const maxPageButtons = 10;
    const startPage = Math.floor((currentPage - 1) / maxPageButtons) * maxPageButtons + 1;
    const endPage = Math.min(startPage + maxPageButtons - 1, totalPages);

    const handleClick = (pageNumber) => {
        navigate(`?page=${pageNumber}`);
    };

    const handlePrevPageGroup = () => {
        if (startPage > 1) {
            navigate(`?page=${startPage - 1}`);
        }
    };

    const handleNextPageGroup = () => {
        if (endPage < totalPages) {
            navigate(`?page=${endPage + 1}`);
        }
    };

    const handleFirstPage = () => {
        navigate(`?page=1`);
    };

    const handleLastPage = () => {
        navigate(`?page=${totalPages}`);
    };

    const renderRows = () => {
        return posts.map(post => (
            <TableRow
                key={post.id}
                title={post.title}
                nickname={post.author}
                date={post.writeDate}
                views={post.watch}
            />
        ));
    };

    const renderPagination = () => {
        const buttons = [];

        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <PageButton
                    key={i}
                    active={i === currentPage}
                    onClick={() => handleClick(i)}
                >
                    {i}
                </PageButton>
            );
        }

        return (
            <Pagination>
                <PageButton onClick={handleFirstPage} disabled={currentPage === 1}>
                    <FontAwesomeIcon icon={faAnglesLeft}/>
                </PageButton>
                <PageButton onClick={handlePrevPageGroup} disabled={startPage === 1}>
                    <FontAwesomeIcon icon={faLessThan}/>
                </PageButton>
                {buttons}
                <PageButton onClick={handleNextPageGroup} disabled={endPage === totalPages}>
                    <FontAwesomeIcon icon={faGreaterThan}/>
                </PageButton>
                <PageButton onClick={handleLastPage} disabled={currentPage === totalPages}>
                    <FontAwesomeIcon icon={faAnglesRight}/>
                </PageButton>
            </Pagination>
        );
    };

    const writePost = () => {
        navigate(`/${gameKey}/write`);
    }

    return (
        <ListBox>
            <BBSHeader>홍보게시판</BBSHeader>
            <OptionRow>
                <OptionButton>전체</OptionButton>
                <OptionButton>리니지</OptionButton>
                <OptionButton>리니지2</OptionButton>
                <OptionButton>리마스터</OptionButton>
            </OptionRow>
            <DivideHr/>

            <FlexRow>
                <TitleText>리니지 M</TitleText>
                <SearchAndWriteRow>
                    <FontAwesomeIcon icon={faMagnifyingGlass}/>
                    <WriteButton onClick={writePost}><FontAwesomeIcon icon={faPen}/> 쓰기</WriteButton>
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
                <tbody>{loading ? <tr><Td colSpan={5}>Loading...</Td></tr> : renderRows()}</tbody>
            </DataTable>

            {renderPagination()}
        </ListBox>
    );
};

const TableRow = ({title, nickname, date, views}) => (
    <tr>
        <Td>
            <HighlightButton>
                <FontAwesomeIcon icon={faThumbsUp}/> 추천
            </HighlightButton>
        </Td>
        <Td>{title}</Td>
        <Td>{nickname}</Td>
        <Td>{date}</Td>
        <Td>{views}</Td>
    </tr>
);

const PageButton = styled.button`
    background-color: ${props => (props.active ? 'blue' : 'white')};
    color: ${props => (props.active ? 'white' : 'black')};
    border: 1px solid black;
    margin: 0 5px;
    padding: 8px 16px;
    cursor: pointer;

    &:disabled {
        cursor: not-allowed;
        opacity: 0.5;
    }
`;

const Pagination = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 20px;
`;

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
    display: flex;
    justify-content: space-between;
`;

const TitleText = styled.span`
    width: auto;
    flex-shrink: 0;
    margin-right: 20px;
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
`;

const ThTitle = styled.th`
    width: 60%;
    background-color: #f4f4f4;
    padding: 8px;
`;

const Th = styled.th`
    background-color: #f4f4f4;
    padding: 8px;
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

const Td = styled.td`
    padding: 8px;
    border: 1px solid #ddd;
    text-align: center;
`;

export default ListPage;
