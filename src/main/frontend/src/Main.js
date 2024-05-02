import {useEffect, useState} from "react";
import axios from "axios";

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

    return (
        <>
            <h1>컨텐츠들이 이곳에 표시됩니다.</h1>
        </>
    );
}

export default MainPage;