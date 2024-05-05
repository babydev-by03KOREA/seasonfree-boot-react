import styled from "styled-components";
import {useState} from "react";

// LoginInput 함수 컴포넌트
// width와 height를 props로 받아서 사용
const LoginInput = ({ width = '100px', height = '30px' }) => {
    const [inputValue, setInputValue] = useState("");

    // Input 컴포넌트에 width와 height props를 전달
    return (
        <Input width={width} height={height} value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
    );
}

// Input 스타일드 컴포넌트
// props를 사용하여 width와 height 동적으로 설정
const Input = styled.input`
    width: ${props => props.width};  // width 값 동적으로 받기
    height: ${props => props.height}; // height 값 동적으로 받기
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
`;

export default LoginInput;