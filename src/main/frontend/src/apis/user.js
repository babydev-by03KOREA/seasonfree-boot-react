import Swal from "sweetalert2";
import axiosInstance from "./axios";

export const LoginApi = async (userId, password, setIsLoggedIn, setUserInfo) => {
    try {
        const response = await axiosInstance.post('/user/login', { userId, password });

        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        console.log('로그인 성공');

        // 로그인 상태 변경
        setIsLoggedIn(true);

        // 사용자 정보 가져오기
        const userInfoResponse = await axiosInstance.get('/user/info');
        const userInfo = userInfoResponse.data;
        console.log(`userInfo: ${JSON.stringify(userInfo)}`);

        // setUserInfo에 올바르게 설정
        setUserInfo({
            nickname: userInfo.nickname,
            points: userInfo.points || 0, // 기본값 설정
            imageUrl: userInfo.imageUrl || '' // 기본값 설정
        });

    } catch (error) {
        if (error.response) {
            Swal.fire({
                icon: "error",
                title: "에러",
                text: error.response.data,
            });
        } else {
            Swal.fire({
                icon: "error",
                title: "에러",
                text: "네트워크 오류가 발생했습니다. 나중에 다시 시도해 주세요.",
            });
        }
    }
};

export const SendEmailApi = async (email, setVerificationSent, setSendEmail) => {
    try {
        const response = await axiosInstance.post('/user/email-check', {
            email
        });
        Swal.fire({
            title: "전송완료",
            text: "30분 이내에 인증번호를 입력 해 주세요.",
            icon: "success"
        });
        setVerificationSent(true);
        setSendEmail(true);
    } catch (err) {
        if (err.response) {
            Swal.fire({
                icon: "error",
                title: "에러",
                text: err.response.data,
            });
            setVerificationSent(false);
            setSendEmail(false);
        } else {
            Swal.fire({
                icon: "error",
                title: "에러",
                text: "메일 전송 중 오류가 발생하였습니다.",
            });
            setVerificationSent(false);
            setSendEmail(false);
        }
    }
}

// 인증완료
export const ValidateEmail = async (email, otp) => {
    try {
        const response = await axiosInstance.post('/user/email-validation', {
            email, otp
        });
        Swal.fire({
            title: "인증완료",
            text: "30분 이내에 인증번호를 입력 해 주세요.",
            icon: "success"
        });
    } catch (err) {
        if (err.response) {
            Swal.fire({
                icon: "error",
                title: "에러",
                text: err.response.data,
            });
        } else {
            Swal.fire({
                icon: "error",
                title: "에러",
                text: "메일 전송 중 오류가 발생하였습니다.",
            });
        }
    }
}

export const JoinApi = async (profileImage, userId, password, nickname, email, otp) => {
    try {
        const response = await axiosInstance.post('/user/join', {
            userId,
            password,
            nickname,
            email,
            otp,
            profileImage,
        });
        Swal.fire({
            title: "축하합니다!",
            text: "회원가입을 환영합니다!",
            icon: "success"
        });
    } catch (err) {
        if (err.response) {
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

export const FindIdApi = async () => {
    try {

    } catch (err) {
        if (err.response) {
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

