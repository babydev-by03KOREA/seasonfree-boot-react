import React, { useEffect, useState } from "react";
import SizeBox from "./components/common/SizeBox";
import styled from "styled-components";
import Login from "./container/user/Login";
import RealTimePosts from "./container/bbs/RealTimePosts";
import AfterLogin from "./container/user/AfterLogin";

const MainPage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState({});

    const BannerArray120x500 = [
        {id: "banner1", name: "광고베너1", width: "120px", height: "500px"},
        {id: "banner2", name: "광고베너2", width: "120px", height: "500px"},
        {id: "banner3", name: "광고베너3", width: "120px", height: "500px"}
    ];

    const BannerArray350x180 = [
        {id: "banner1", name: "광고베너1", width: "350px", height: "180px"},
        {id: "banner2", name: "광고베너2", width: "350px", height: "180px"},
        {id: "banner3", name: "광고베너3", width: "350px", height: "180px"}
    ];

    const BannerArray895x100 = [
        {id: "banner1", name: "광고베너1", width: "895px", height: "100px"},
        {id: "banner2", name: "광고베너2", width: "895px", height: "100px"},
        {id: "banner3", name: "광고베너3", width: "895px", height: "100px"},
        {id: "banner4", name: "광고베너4", width: "895px", height: "100px"},
        {id: "banner5", name: "광고베너5", width: "895px", height: "100px"},
        {id: "banner6", name: "광고베너6", width: "895px", height: "100px"},
        {id: "banner7", name: "광고베너7", width: "895px", height: "100px"},
        {id: "banner8", name: "광고베너8", width: "895px", height: "100px"},
        {id: "banner9", name: "광고베너9", width: "895px", height: "100px"}
    ];

    const BannerArray370x150 = [
        {id: "banner1", name: "광고베너1", width: "370px", height: "150px"},
        {id: "banner2", name: "광고베너2", width: "370px", height: "150px"},
        {id: "banner3", name: "광고베너3", width: "370px", height: "150px"}
    ];

    return (
        <MainContainer>
            <FirstContainer>
                {BannerArray120x500.map(banner => (
                    <SizeBox
                        key={banner.id}
                        width={banner.width}
                        height={banner.height}
                    />
                ))}
            </FirstContainer>

            <SecondContainer>
                {isLoggedIn ? (
                    <AfterLogin {...userInfo} />
                ) : (
                    <Login setIsLoggedIn={setIsLoggedIn} setUserInfo={setUserInfo} />
                )}
                {BannerArray350x180.map(banner => (
                    <SizeBox
                        key={banner.id}
                        width={banner.width}
                        height={banner.height}
                    />
                ))}
            </SecondContainer>

            <ThirdContainer>
                <div>
                    {BannerArray895x100.slice(0, 3).map(banner => (
                        <SizeBox key={banner.id} width={banner.width} height={banner.height}>
                            {banner.name}
                        </SizeBox>
                    ))}
                    <RealTimePosts />
                    {BannerArray895x100.slice(3).map(banner => (
                        <SizeBox key={banner.id} width={banner.width} height={banner.height}>
                            {banner.name}
                        </SizeBox>
                    ))}
                </div>
            </ThirdContainer>

            <FourthContainer>
                {BannerArray370x150.map(banner => (
                    <SizeBox
                        key={banner.id}
                        width={banner.width}
                        height={banner.height}
                    />
                ))}
            </FourthContainer>
        </MainContainer>
    );
};

const MainContainer = styled.div`
    display: flex;
`;

const FirstContainer = styled.div`
    margin-right: 10px;
`;

const SecondContainer = styled.div`
    margin-right: 10px;
`;

const ThirdContainer = styled.div`
    margin-right: 10px;
`;

const FourthContainer = styled.div`
    margin-right: 10px;
`;

export default MainPage;
