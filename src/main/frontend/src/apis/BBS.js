import Swal from "sweetalert2";
import axiosInstance from "./Axios";

export const WritePost = async (title, content, urlFirst, urlSecond, gameKey, navigate) => {
  try {
      const response = await axiosInstance.post('/bbs/write', {
          title,
          content,
          urlOne: urlFirst,
          urlTwo: urlSecond,
          postType: 'GENERAL', // 예시로 일반 게시글 타입
          categoryType: gameKey.toUpperCase() // 경로에서 추출한 gameKey 사용
      });
      Swal.fire({
          title: "작성완료",
          text: "개시글이 성공적으로 작성되었습니다!",
          icon: "success",

      }).then(() => {
          navigate(`/${gameKey}`);
      });
  } catch (error) {
      if (error.response) {
          Swal.fire({
              icon: "error",
              title: "에러",
              text: JSON.stringify(error.response.data),
          });
      } else {
          console.error('Error:', error);
          Swal.fire({
              icon: "error",
              title: "에러",
              text: "네트워크 오류가 발생했습니다. 나중에 다시 시도해 주세요.",
          });
      }
  }
}

export const GetPost = async (gameKey, page) => {
    try {
        const response = await axiosInstance.get(`/bbs/${gameKey}`, {
            params: {
                page: page - 1, // 백엔드의 페이지 번호는 0부터 시작
                size: 15 // 페이지 당 게시글 수
            }
        });
        const { content, totalElements } = response.data; // 응답 구조가 Page<PostDTO> 형태일 경우

        return {
            posts: content || [],
            totalRows: totalElements || 0
        };
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
}

