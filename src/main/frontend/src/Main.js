import SizeBox from "./components/common/SizeBox";
import styled from "styled-components";
import Login from "./container/user/Login";

const MainPage = () => {
    // const [data, setData] = useState(null);
    //
    // // 마운팅(값이 올때까지 대기) 작업 시 이렇게 사용하면 됨
    // useEffect(() => {
    //     axios.get('/api/data')
    //         .then(res => setData(res.data))
    //         .catch(err => console.error(err))
    // }, []);
    // <h1>{data ? data : "WAIT.."}</h1>

    // 스켈레톤(배너 광고 useEffect 로 올 때 까지)
    // map 으로 돌려서 광고가 있으면 랜더링 해주는 방법
    // [Question]
    // 처음엔 광고가 아예 없는데 어떻게 할 지?
    // 관리자 페이지에 광고 업로드 옵션을 어떻게 둘 것인가?

    // Mock API
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
        {id: "banner3", name: "광고베너3", width: "895px", height: "100px"}
    ];

    const BannerArray370x150 = [
        {id: "banner1", name: "광고베너1", width: "370px", height: "150px"},
        {id: "banner2", name: "광고베너2", width: "370px", height: "150px"},
        {id: "banner3", name: "광고베너3", width: "370px", height: "150px"}
    ];;


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
                <Login/>
                {/* LIVE CHAT */}
                {BannerArray350x180.map(banner => (
                    <SizeBox
                        key={banner.id}
                        width={banner.width}
                        height={banner.height}
                    />
                ))}
            </SecondContainer>

            <ThirdContainer>
                <SizeBox width={"895px"} height={"100px"}/>
                <SizeBox width={"895px"} height={"100px"}/>
                <SizeBox width={"895px"} height={"100px"}/>
                {/* LIVE POST */}
                <SizeBox width={"895px"} height={"100px"}/>
                <SizeBox width={"895px"} height={"100px"}/>
                <SizeBox width={"895px"} height={"100px"}/>
                <SizeBox width={"895px"} height={"100px"}/>
                <SizeBox width={"895px"} height={"100px"}/>
            </ThirdContainer>

            <FourthContainer>
                <SizeBox/>
                <SizeBox/>
                <SizeBox/>
            </FourthContainer>
        </MainContainer>
    );
}

// 우측으로 4분할 [][   ][      ][]
const MainContainer = styled.div`
    display: flex;
`

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
    margin-right: 10px;`;

export default MainPage;