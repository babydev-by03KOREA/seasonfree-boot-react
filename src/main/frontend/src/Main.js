import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import AfterLogin from "./container/user/AfterLogin";
import Login from "./container/user/Login";
import RealTimePosts from "./container/bbs/RealTimePosts";
import {useAuthState} from "./context/Auth";

const MainPage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState({});
    const { isAuthenticated, user } = useAuthState();
    const [banners, setBanners] = useState({});
    const [newBanner, setNewBanner] = useState(null);

    useEffect(() => {
        if (isAuthenticated) {
            setIsLoggedIn(true);
            setUserInfo(user);
        }
    }, [isAuthenticated, user]);

    const BannerArray120x500 = [
        { id: "banner1", name: "광고베너1", width: "120px", height: "500px" },
        { id: "banner2", name: "광고베너2", width: "120px", height: "500px" },
        { id: "banner3", name: "광고베너3", width: "120px", height: "500px" }
    ];

    const BannerArray350x180 = [
        { id: "banner1", name: "광고베너1", width: "350px", height: "180px" },
        { id: "banner2", name: "광고베너2", width: "350px", height: "180px" },
        { id: "banner3", name: "광고베너3", width: "350px", height: "180px" }
    ];

    const BannerArray895x100 = [
        { id: "banner1", name: "광고베너1", width: "895px", height: "100px" },
        { id: "banner2", name: "광고베너2", width: "895px", height: "100px" },
        { id: "banner3", name: "광고베너3", width: "895px", height: "100px" },
        { id: "banner4", name: "광고베너4", width: "895px", height: "100px" },
        { id: "banner5", name: "광고베너5", width: "895px", height: "100px" },
        { id: "banner6", name: "광고베너6", width: "895px", height: "100px" },
        { id: "banner7", name: "광고베너7", width: "895px", height: "100px" },
        { id: "banner8", name: "광고베너8", width: "895px", height: "100px" },
        { id: "banner9", name: "광고베너9", width: "895px", height: "100px" }
    ];

    const BannerArray370x150 = [
        { id: "banner1", name: "광고베너1", width: "370px", height: "150px" },
        { id: "banner2", name: "광고베너2", width: "370px", height: "150px" },
        { id: "banner3", name: "광고베너3", width: "370px", height: "150px" }
    ];

    const handleBannerUpload = (e, bannerId) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setBanners(prevBanners => ({
                ...prevBanners,
                [bannerId]: reader.result
            }));
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const isAdmin = user?.role === 'Admin';

    return (
        <MainContainer>
            <FirstContainer>
                {BannerArray120x500.map(banner => (
                    <BannerBox key={banner.id} width={banner.width} height={banner.height}>
                        {banners[banner.id] ? (
                            <img src={banners[banner.id]} alt={banner.name} style={{ width: '100%', height: '100%' }} />
                        ) : (
                            <EmptyBanner>{banner.name}</EmptyBanner>
                        )}
                        {isAdmin && (
                            <>
                                <EditIcon>
                                    <FontAwesomeIcon icon={faPenToSquare} />
                                </EditIcon>
                                <input type="file" accept="image/*" onChange={(e) => handleBannerUpload(e, banner.id)} />
                            </>
                        )}
                    </BannerBox>
                ))}
            </FirstContainer>

            <SecondContainer>
                {isLoggedIn ? (
                    <AfterLogin {...userInfo} />
                ) : (
                    // <Login setIsLoggedIn={setIsLoggedIn} setUserInfo={setUserInfo} />
                    <Login/>
                )}
                {BannerArray350x180.map(banner => (
                    <BannerBox key={banner.id} width={banner.width} height={banner.height}>
                        {banners[banner.id] ? (
                            <img src={banners[banner.id]} alt={banner.name} style={{ width: '100%', height: '100%' }} />
                        ) : (
                            <EmptyBanner>{banner.name}</EmptyBanner>
                        )}
                        {isAdmin && (
                            <>
                                <EditIcon>
                                    <FontAwesomeIcon icon={faPenToSquare} />
                                </EditIcon>
                                <input type="file" accept="image/*" onChange={(e) => handleBannerUpload(e, banner.id)} />
                            </>
                        )}
                    </BannerBox>
                ))}
            </SecondContainer>

            <ThirdContainer>
                <div>
                    {BannerArray895x100.slice(0, 3).map(banner => (
                        <BannerBox key={banner.id} width={banner.width} height={banner.height}>
                            {banners[banner.id] ? (
                                <img src={banners[banner.id]} alt={banner.name} style={{ width: '100%', height: '100%' }} />
                            ) : (
                                <EmptyBanner>{banner.name}</EmptyBanner>
                            )}
                            {isAdmin && (
                                <>
                                    <EditIcon>
                                        <FontAwesomeIcon icon={faPenToSquare} />
                                    </EditIcon>
                                    <input type="file" accept="image/*" onChange={(e) => handleBannerUpload(e, banner.id)} />
                                </>
                            )}
                        </BannerBox>
                    ))}
                    <RealTimePosts />
                    {BannerArray895x100.slice(3).map(banner => (
                        <BannerBox key={banner.id} width={banner.width} height={banner.height}>
                            {banners[banner.id] ? (
                                <img src={banners[banner.id]} alt={banner.name} style={{ width: '100%', height: '100%' }} />
                            ) : (
                                <EmptyBanner>{banner.name}</EmptyBanner>
                            )}
                            {isAdmin && (
                                <>
                                    <EditIcon>
                                        <FontAwesomeIcon icon={faPenToSquare} />
                                    </EditIcon>
                                    <input type="file" accept="image/*" onChange={(e) => handleBannerUpload(e, banner.id)} />
                                </>
                            )}
                        </BannerBox>
                    ))}
                </div>
            </ThirdContainer>

            <FourthContainer>
                {BannerArray120x500.map(banner => (
                    <BannerBox key={banner.id} width={banner.width} height={banner.height}>
                        {banners[banner.id] ? (
                            <img src={banners[banner.id]} alt={banner.name} style={{ width: '100%', height: '100%' }} />
                        ) : (
                            <EmptyBanner>{banner.name}</EmptyBanner>
                        )}
                        {isAdmin && (
                            <>
                                <EditIcon>
                                    <FontAwesomeIcon icon={faPenToSquare} />
                                </EditIcon>
                                <input type="file" accept="image/*" onChange={(e) => handleBannerUpload(e, banner.id)} />
                            </>
                        )}
                    </BannerBox>
                ))}
            </FourthContainer>
        </MainContainer>
    );
};

const MainContainer = styled.div`
    /* Main container styles */
    display: flex;
`;

const FirstContainer = styled.div`
    /* First container styles */
    margin-right: 10px;
`;

const SecondContainer = styled.div`
    /* Second container styles */
    margin-right: 10px;
`;

const ThirdContainer = styled.div`
    /* Third container styles */
    margin-right: 10px;
`;

const FourthContainer = styled.div`
    /* Fourth container styles */
    margin-right: 10px;
`;

const BannerBox = styled.div`
    width: ${(props) => props.width};
    height: ${(props) => props.height};
    border: 1px solid #000;
    position: relative;
`;

const EmptyBanner = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const EditIcon = styled.div`
    position: absolute;
    top: 5px;
    left: 5px;
    background-color: rgba(255, 255, 255, 0.8);
    padding: 5px;
    border-radius: 50%;
    cursor: pointer;
`;

export default MainPage;
