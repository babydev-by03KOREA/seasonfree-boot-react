import axios from 'axios';

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
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

// 응답 인터셉터 추가
axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        if (error.response && error.response.status === 401) {
            const refreshToken = localStorage.getItem('refreshToken');
            // 리프레시 토큰 로직 추가...
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
