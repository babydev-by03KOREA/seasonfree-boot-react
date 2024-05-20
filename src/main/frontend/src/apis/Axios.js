import axios from 'axios';
import Swal from 'sweetalert2';

const tokenRequiredRoutes = ['/bbs/write', '/attendance/check', '/user/info'];

// Axios 인스턴스 생성
const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 10000,
});

// 요청 인터셉터 추가
axiosInstance.interceptors.request.use(
    config => {
        // 현재 요청의 URL이 토큰이 필요한 경로 배열에 포함되어 있는지 확인
        if (tokenRequiredRoutes.some(path => config.url.includes(path))) {
            const accessToken = localStorage.getItem('accessToken');
            if (accessToken) {
                config.headers['Authorization'] = `Bearer ${accessToken}`;
            }
        }
        return config;
    },
    error => Promise.reject(error)
);

// 응답 인터셉터 추가
axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refreshToken');

            if (refreshToken) {
                try {
                    const response = await axios.post('http://localhost:8080/user/refresh-token', { refreshToken });
                    const { accessToken } = response.data;

                    // 새로운 액세스 토큰 저장
                    localStorage.setItem('accessToken', accessToken);
                    // 기존 요청에 새로운 액세스 토큰 설정
                    originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

                    // 새로운 액세스 토큰으로 기존 요청 재시도
                    return axiosInstance(originalRequest);
                } catch (refreshError) {
                    // 리프레시 토큰이 유효하지 않으면 로그아웃 처리
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    window.location.href = '/';
                    return Promise.reject(refreshError);
                }
            } else {
                // 리프레시 토큰이 없으면 로그아웃 처리
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/';
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;