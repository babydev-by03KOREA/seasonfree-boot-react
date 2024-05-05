import styled from "styled-components";

const SizeBox = ({width = '120px', height = '500px'}) => {
    return <BannerSizeBox width={width} height={height} />;
}

const BannerSizeBox = styled.div`
    width: ${props => props.width};
    height: ${props => props.height};
    border: 1px solid #282c34; // border 스타일 수정
    display: block;
    margin: 5px 0;
`;

export default SizeBox;