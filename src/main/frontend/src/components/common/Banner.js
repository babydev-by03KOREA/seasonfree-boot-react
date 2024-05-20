import styled from "styled-components";

const Banner = ({ id, name, width, height, imageUrl }) => {
    return (
        <BannerWrapper width={width} height={height} imageUrl={imageUrl}>
            {imageUrl ? <BannerImage src={imageUrl} alt={name} /> : <span>{name}</span>}
        </BannerWrapper>
    );
};

const BannerWrapper = styled.div`
  width: ${props => props.width};
  height: ${props => props.height};
  border: 1px solid #000; // 테두리
  background-color: ${props => (props.imageUrl ? 'transparent' : '#f0f0f0')}; // 이미지가 없을 때 기본 배경
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

const BannerImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export default Banner;