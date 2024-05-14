import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import styled from "styled-components";

const Join = () => {
    const [sendEmail, setSendEmail] = useState(false);
    const [verificationSent, setVerificationSent] = useState(false);
    const {register, handleSubmit, watch, formState: {errors}} = useForm();
    const onSubmit = data => {
        if (data.password !== data.confirmPassword) {
            alert("비밀번호가 일치하지 않습니다!");
            return;
        }
        setSendEmail(true);
        setVerificationSent(true);
        // TODO API
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <InputComponent
                {...register("id", {
                    required: "ID를 입력해주세요.",
                    pattern: {
                        value: /^[A-Za-z0-9]{4,12}$/,
                        message: "ID는 4~12글자의 영문 및 숫자만 가능합니다."
                    }
                })}
                placeholder="아이디를 입력해주세요.(영문 숫자조합 4자이상 ~ 12자 미만)"
                disabled={sendEmail}
            />
            {errors.id && <div style={{color: "red", marginLeft: "10px"}}>{errors.id.message}</div>}

            <InputComponent
                {...register("password", {
                    required: "비밀번호를 입력해주세요.",
                    minLength: {
                        value: 6,
                        message: "비밀번호는 최소 6자 이상입니다."
                    },
                    maxLength: {
                        value: 20,
                        message: "비밀번호는 최대 20자 이하입니다."
                    }
                })}
                type="password"
                placeholder="비밀번호를 입력해주세요.(최소 6자 ~ 최대 20자)"
                disabled={sendEmail}
            />
            {errors.password && <div style={{color: "red", marginLeft: "10px"}}>{errors.password.message}</div>}

            <InputComponent
                {...register("confirmPassword", {required: true})}
                type="password"
                placeholder="비밀번호를 한번 더 입력 해 주세요."
                disabled={sendEmail}
            />
            {errors.confirmPassword && <div style={{color: "red", marginLeft: "10px"}}>비밀번호 확인을 입력해주세요.</div>}

            <InputComponent
                {...register("nickname", {required: true})}
                placeholder="닉네임을 입력 해 주세요."
                disabled={sendEmail}
            />
            {errors.nickname && <div style={{color: "red", marginLeft: "10px"}}>닉네임을 입력해주세요.</div>}

            <InputComponent
                {...register("email", {required: true, pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i})}
                type="email"
                placeholder="이메일 주소를 입력 해 주세요."
                disabled={sendEmail}
            />
            {errors.email && <div style={{color: "red", marginLeft: "10px"}}>유효한 이메일 주소를 입력해주세요.</div>}

            {verificationSent && (
                <>
                    <InputComponent
                        {...register("code", { required: "인증번호를 입력해주세요." })}
                        placeholder="인증번호를 입력하세요."
                    />
                    {errors.code && <ErrorText>{errors.code.message}</ErrorText>}
                </>
            )}

            <SubmitButton type="submit">회원가입</SubmitButton>
        </form>
    );
};

const InputComponent = styled.input`
    width: 90%;
    margin: 10px;
    padding: 8px;
`;

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

const ErrorText = styled.div`
    color: red;
    font-size: 14px;
    padding-left: 10px;
`;

export default Join;
