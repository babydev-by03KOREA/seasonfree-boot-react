import axiosInstance from "./Axios";

export const CalendarApi = async (today, comment) => {
    console.log("Sending data:", { today, comment });
    try {
        const response = await axiosInstance.post('/attendance/check', {today, comment});
        return response.data;  // 서버 응답 처리
    } catch (error) {
        console.error('Error making API call:', error);
        throw error;  // 이 에러를 호출한 곳에서 처리할 수 있도록 넘깁니다.
    }
}