import styled from "styled-components";
import {useState} from "react";

/**
 * [제목]
 * ==========================
 * 작성자  작성시간    조회수
 *
 *     내용
 *
 *    (사진)
 * (본인이 쓴 게시글이면)수정/삭제
 * ==========================
 *     댓글
 * */

const DetailPage = () => {
    const [text, setText] = useState('');
    const maxLength = 255;

    const handleChange = (event) => {
        if (event.target.value.length <= maxLength) {
            setText(event.target.value);
        } else {
            alert(`최대 ${maxLength}자까지 입력 가능합니다.`);
        }
    };

    return (
        <DetailBox>
            <DetailHeader>예시 타이틀입니다.</DetailHeader>
            <WriteHeader>
                <Writer>작성자: 빵떡이</Writer>
                <WriteTime>작성시간: 2024.05.12</WriteTime>
                <WatchCount>조회수: 10</WatchCount>
            </WriteHeader>
            <DivideHr/>
            <DetailBody>
                서버로부터 받아온 값이 여기로 넘어옵니다. <br/>
                이미지도 이쪽으로 넘어옵니다.
            </DetailBody>
            <DivideHr/>
            <CommentHeader>댓글</CommentHeader>
            <DivideHr/>

            {/* TODO 만약 게시글에 댓글이 있다면 */}
            <WriteComment>
                <Nickname>빵떡이</Nickname>
                <Comment>댓글 처음 남겨봐요~ 잘 부탁드려요~</Comment>
                <RegisterTime>2024.05.12 09:10:33</RegisterTime>
            </WriteComment>
            <DivideHr/>

            <CommentBox>
                <CommentInput
                    value={text}
                    onChange={handleChange}
                    placeholder="최대 255자까지 입력 가능합니다."
                />
                <CommentButton>등록</CommentButton>
            </CommentBox>
        </DetailBox>
    );
}

const DetailBox = styled.div`
    width: 80%;
`;

const DetailHeader = styled.span`
    width: 100%;
    font-size: 30px;
    font-weight: bold;
    display: flex;
    justify-content: start;
    padding: 20px 0;
    margin-bottom: 20px;
    text-align: center;
`;

const WriteHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const Writer = styled.span`
    flex-grow: 1; /* 나머지 공간을 모두 차지하도록 설정 */
`;

const WriteTime = styled.span`
    margin-right: 20px; /* 시각적으로 구분을 주기 위해 오른쪽에 여백을 줌 */
`;

const WatchCount = styled.span`
    /* 추가적인 스타일링이 필요하면 여기에 작성 */
`;


const DivideHr = styled.hr``;

const DetailBody = styled.div`
    width: 100%;
    padding: 20px 0;
`;

const CommentHeader = styled.span`
    width: 100%;
    font-size: 30px;
    font-weight: bold;
    display: flex;
    justify-content: start;
    padding: 10px 0;
    //margin-bottom: 20px;
    text-align: center;
`;

const WriteComment = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    flex-wrap: wrap; /* 자식 요소들이 영역을 넘어가면 다음 줄로 넘김 */
`;

const Nickname = styled.span`
    margin-left: 2px;
    color: gray;
    font-weight: bold;
    flex: none; /* flex-grow, flex-shrink, flex-basis를 모두 무시하고 원래 크기를 유지 */
`;

const Comment = styled.span`
    margin-left: 5%;
    flex: 1; /* 사용 가능한 공간을 모두 차지하도록 설정 */
    white-space: normal; /* 텍스트가 자동으로 줄바꿈 되도록 설정 */
`;

const RegisterTime = styled.span`
    margin-left: auto; /* 왼쪽의 모든 여유 공간을 차지하여 오른쪽에 배치 */
    color: gray;
    font-weight: bold;
    flex: none;
`;

const CommentBox = styled.div`
    width: 100%;
    display: flex;
`;

const CommentInput = styled.textarea`
    width: 90%;
    height: 80px;
    margin-right: 10px;
    overflow-y: auto;
    resize: none;
`;

const CommentButton = styled.button`
    width: 10%;
    background-color: black;
    color: white;
    font-size: 23px;
    border-radius: 4px;
`;

export default DetailPage;