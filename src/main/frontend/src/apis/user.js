import axiosInstance from "./axios";
import Swal from "sweetalert2";

export const LoginApi = async (userId, password) => {
    try {
        const response = axiosInstance.post('/user/login', {userId, password})
            .then(response => {
                localStorage.setItem('accessToken', response.data.accessToken);
                localStorage.setItem('refreshToken', response.data.refreshToken);
                console.log('로그인 성공');
            })
            .catch(error => {
                if (error.response.status === 401) {
                    console.error('로그인 실패: 자격 증명 오류');
                } else {
                    console.error('서버 오류 발생');
                }
            });
    } catch (err) {
        console.error(err);
    }
}

export const JoinApi = async (userId, password, nickname, email) => {
    try {
        const response = await axiosInstance.post('/user/join', {
            userId,
            password,
            nickname,
            email
        });
        Swal.fire({
            title: "축하합니다!",
            text: "회원가입을 환영합니다!",
            icon: "success"
        });
    } catch (err) {
        if (err.response && err.response.data) {
            Swal.fire({
                icon: "error",
                title: "에러",
                text: err.response.data,
            });
        } else {
            Swal.fire({
                icon: "error",
                title: "에러",
                text: "회원가입 처리 중 오류가 발생하였습니다.",
            });
        }
    }
}