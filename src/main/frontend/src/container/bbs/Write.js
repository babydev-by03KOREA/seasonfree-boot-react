import {useState} from "react";
import InputComponent from "../../components/common/Input";
import styled from "styled-components";
import Editor from "../../components/common/Editor";
import ButtonComponent from "../../components/common/Button";

const WritePage = () => {
    const [title, setTitle] = useState("");
    const [context, setContext] = useState("");
    const [urlFirst, setUrlFirst] = useState("");
    const [urlSecond, setUrlSecond] = useState("");

    const handleValueChange = (content) => {  // 입력값 변경 처리
        setContext(content);
    };

    return (
        <div>
            <WriteHeader>게시글 작성</WriteHeader>
            <TextWrite>글쓰기</TextWrite>
            <DivideHr/>

            <TitleRow>
                <TitleText>제목</TitleText>
                <InputComponent
                    width={"100%"}
                    height={"25px"}
                    onChange={setTitle}
                />
            </TitleRow>
            <DivideHr/>

            <Editor value={context} onChange={handleValueChange}/>

            <TitleRow style={{marginBottom: "10px"}}>
                <TitleText>관련 링크</TitleText>
                <InputComponent
                    width={"100%"}
                    height={"25px"}
                    onChange={setUrlFirst}
                    placeholder={"https://..."}
                />
            </TitleRow>
            <TitleRow>
                <TitleText>관련 링크</TitleText>
                <InputComponent
                    width={"100%"}
                    height={"25px"}
                    onChange={setUrlSecond}
                    placeholder={"https://..."}
                />
            </TitleRow>
            <DivideHr/>
            자동 등록 방지
            도메인 구매 후 reCaptcha 도입 예정
            <DivideHr/>
            <ButtonRow>
                <ButtonComponent height={"50px"} text={"취소"} background={"white"} fontsize={"20px"}/>
                <ButtonComponent height={"50px"} text={"확인"} background={"black"} color={"white"} fontsize={"20px"} />
            </ButtonRow>
        </div>
    );
}

const WriteHeader = styled.span`
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

const TextWrite = styled.span`
    font-weight: bold;
    font-size: 25px;
`;

const TitleRow = styled.div`
    display: flex;
    align-items: center; // 세로 중앙 정렬
`;

const TitleText = styled.span`
    width: auto; // 너비 자동 조절
    flex-shrink: 0; // 크기 축소 방지
    margin-right: 20px; // 오른쪽 여백 설정
`;

const ButtonRow = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-bottom: 100px;
`;

const DivideHr = styled.hr``;

export default WritePage;