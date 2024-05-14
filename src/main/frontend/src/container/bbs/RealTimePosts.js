import styled from "styled-components";

const RealTimePosts = () => {
    return (
        <RealTimeContainer>
            <RealTimeTitle>실시간 게시물</RealTimeTitle>
            <RealTimePost/>
            <Box370150/>
        </RealTimeContainer>
    );
}

const RealTimeContainer = styled.div`
    width: 895px;
    height: 150px;
    display: flex;
    border: 1px solid black;
`;

const RealTimeTitle = styled.div`
    width: 525px;
    height: 20px;
    text-align: center;
    border: 1px solid black;
    font-weight: bold;
`;

const RealTimePost = styled.div``;

const Box370150 = styled.div`
    width: 370px;
    height: 150px;
    border: 1px solid black;
`;

export default RealTimePosts;