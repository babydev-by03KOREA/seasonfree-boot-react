import {useForm} from "react-hook-form";
import styled from "styled-components";
import React from "react";

const CustomerService = () => {
    const {register, handleSubmit, formState: {errors}} = useForm();

    const onSubmit = data => {
        console.log(data);
    }

    return (
        <FormContainer>
            <form onSubmit={handleSubmit(onSubmit)}>
                <InputComponent
                    {...register("email", {
                        required: "이메일은 필수 입력 항목입니다.",
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "유효한 이메일 주소를 입력해주세요."
                        }
                    })}
                    placeholder="가입하실 때 입력하신 이메일 주소를 입력 해 주세요."
                />
                {errors.email && <ErrorText>{errors.email.message}</ErrorText>}

                <TextAreaComponent
                    {...register("message", {required: "문의 내용을 입력해주세요."})}
                    placeholder="문의 내용을 입력해주세요."
                />
                {errors.message && <ErrorText>{errors.message.message}</ErrorText>}

                <SubmitButton type="submit">문의하기</SubmitButton>
            </form>
        </FormContainer>
    );
}

const FormContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
`;

const InputComponent = styled.input`
    width: 400px;
    padding: 8px;
    margin: 10px 0;
`;

const TextAreaComponent = styled.textarea`
    width: 415px;
    height: 50px;
    margin-bottom: 20px;
`;

// TODO 공통컴포넌트로 export
const SubmitButton = styled.button`
    width: 100%;
    padding: 10px;
    background-color: #4CAF50;
    color: white;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    border: none;
    border-radius: 5px;
`;

const ErrorText = styled.div`
    color: red;
    font-size: 14px;
    padding-left: 10;
`;

export default CustomerService;