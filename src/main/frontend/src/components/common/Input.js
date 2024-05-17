import styled from "styled-components";
import {useState} from "react";

// LoginInput 함수 컴포넌트
// width와 height를 props로 받아서 사용
const InputComponent = ({width = '100px', height = '30px', placeholder = '', onChange, type = 'text', margin = ''}) => {
    const [inputValue, setInputValue] = useState("");

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);
        onChange(e);  // 부모 컴포넌트로 값 전달
    };

    // Input 컴포넌트에 width와 height props를 전달
    return (
        <Input
            type={type}
            width={width}
            height={height}
            margin={margin}
            value={inputValue}
            onChange={handleInputChange}
            placeholder={placeholder}
        />
    );
}

// Input 스타일드 컴포넌트
// props를 사용하여 width와 height 동적으로 설정
const Input = styled.input`
    width: ${props => props.width};
    height: ${props => props.height};
    margin: ${props => props.margin};
    padding: 5px;
    border: 1px solid black;
    border-radius: 2px;
    display: block;
`;

export default InputComponent;