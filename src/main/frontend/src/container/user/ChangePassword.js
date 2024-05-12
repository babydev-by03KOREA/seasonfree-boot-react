import styled from "styled-components";

const ChangePassword = () => {
    return (
        <>
            가입하실 때 입력하신 ID를 입력하세요.
            가입하실 때 입력하신 이메일 주소를 입력하세요.
            {/*  이메일 인증번호 전송됨  */}
            {/*  이메일 인증 완료  */}
            {/*  암호 변경  */}
        </>
    );
}

const SubmitButton = styled.button`
    width: 90%;
    padding: 10px;
    margin: 20px;
    background-color: #4CAF50;
    color: white;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    border: none;
    border-radius: 5px;
`;

export default ChangePassword;