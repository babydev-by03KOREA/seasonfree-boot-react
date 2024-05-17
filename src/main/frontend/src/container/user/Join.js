import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import styled from "styled-components";
import { JoinApi, SendEmailApi } from "../../apis/user";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faUser } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

const Join = () => {
    const [sendEmail, setSendEmail] = useState(false);
    const [verificationSent, setVerificationSent] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        if (data.password !== data.confirmPassword) {
            alert("비밀번호가 일치하지 않습니다!");
            return;
        }
        // 회원가입 API 호출
        await JoinApi(data.profileImageInput, data.id, data.password, data.nickname, data.email, data.code);
    };

    const handleSendEmail = async (data) => {
        setSendEmail(true);
        await SendEmailApi(data.email, setVerificationSent, setSendEmail);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setProfileImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <ProfileIconRow>
                <ProfileIcon onClick={() => document.getElementById('profileImageInput').click()}>
                    {profileImage ? (
                        <img src={profileImage} alt="Profile" />
                    ) : (
                        <AddIcon icon={faCirclePlus} />
                    )}
                </ProfileIcon>
                <input
                    id="profileImageInput"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />
            </ProfileIconRow>
            <InputComponent
                {...register("id", {
                    required: "ID를 입력해주세요.",
                    pattern: {
                        value: /^[A-Za-z0-9]{4,12}$/,
                        message: "ID는 4~12글자의 영문 및 숫자만 가능합니다."
                    }
                })}
                placeholder="아이디를 입력해주세요.(영문 숫자조합 4자이상 ~ 12자 미만)"
                disabled={sendEmail || verificationSent}
            />
            {errors.id && <div style={{ color: "red", marginLeft: "10px" }}>{errors.id.message}</div>}

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
                disabled={sendEmail || verificationSent}
            />
            {errors.password && <div style={{ color: "red", marginLeft: "10px" }}>{errors.password.message}</div>}

            <InputComponent
                {...register("confirmPassword", { required: true })}
                type="password"
                placeholder="비밀번호를 한번 더 입력 해 주세요."
                disabled={sendEmail || verificationSent}
            />
            {errors.confirmPassword && <div style={{ color: "red", marginLeft: "10px" }}>비밀번호 확인을 입력해주세요.</div>}

            <InputComponent
                {...register("nickname", { required: true })}
                placeholder="닉네임을 입력 해 주세요."
                disabled={sendEmail || verificationSent}
            />
            {errors.nickname && <div style={{ color: "red", marginLeft: "10px" }}>닉네임을 입력해주세요.</div>}

            <InputComponent
                {...register("email", { required: true, pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i })}
                type="email"
                placeholder="이메일 주소를 입력 해 주세요."
                disabled={sendEmail || verificationSent}
            />
            {errors.email && <div style={{ color: "red", marginLeft: "10px" }}>유효한 이메일 주소를 입력해주세요.</div>}

            {verificationSent && (
                <>
                    <InputComponent
                        {...register("code", { required: "인증번호를 입력해주세요." })}
                        placeholder="인증번호를 입력하세요."
                    />
                    {errors.code && <ErrorText>{errors.code.message}</ErrorText>}
                </>
            )}

            {verificationSent ? (
                <SubmitButton type="submit">회원가입</SubmitButton>
            ) : (
                <SubmitButton type="button" onClick={handleSubmit(handleSendEmail)}>인증번호 전송</SubmitButton>
            )}
        </form>
    );
};

const ProfileIconRow = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ProfileIcon = styled.div`
    width: 70px;
    height: 70px;
    background-color: gray;
    border-radius: 50%;
    overflow: hidden;
    position: relative;
    border: black solid 1px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    svg {
        width: 100%;
        height: auto;
        color: white;
    }
`;

const AddIcon = styled(FontAwesomeIcon)`
    position: absolute;
    bottom: 0;
    right: 0;
    background-color: gray;
    color: white;
    border-radius: 50%;
    width: 20%;
    height: 20%;
`;

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
