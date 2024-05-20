import React, {useState} from "react";
import {useForm} from "react-hook-form";
import styled from "styled-components";
import {FindIdApi, SendEmailApi, ValidateEmail} from "../../apis/User";

const FindId = () => {
    const {register, handleSubmit, formState: {errors}} = useForm();
    const [sendEmail, setSendEmail] = useState(false);
    const [verificationSent, setVerificationSent] = useState(false);

    const handleSendEmail = async (data) => {
        console.log("Sending email to:", data.email);

        await FindIdApi(data.email, setVerificationSent, setSendEmail);
    };

    // REDIS 자원 공유
    const handleVerifyCode = async (data) => {
        console.log("Verifying code:", data.code);

        await ValidateEmail(data.email, data.code);
    };

    return (
        <FormContainer>
            <form onSubmit={handleSubmit(sendEmail ? handleVerifyCode : handleSendEmail)}
                  style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                <InputComponent
                    {...register("email", {
                        required: "이메일은 필수 입력 항목입니다.",
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "유효한 이메일 주소를 입력해주세요."
                        }
                    })}
                    placeholder="가입하실 때 입력하신 이메일 주소를 입력 해 주세요."
                    disabled={sendEmail}
                />
                {errors.email && <ErrorText>{errors.email.message}</ErrorText>}

                {verificationSent && (
                    <>
                        <InputComponent
                            {...register("code", {required: "인증번호를 입력해주세요."})}
                            placeholder="인증번호를 입력하세요."
                        />
                        {errors.code && <ErrorText>{errors.code.message}</ErrorText>}
                    </>
                )}

                <SubmitButton type="submit">{verificationSent ? "인증하기" : "인증번호 전송하기"}</SubmitButton>
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

export default FindId;
