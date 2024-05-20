import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Banner from './Banner';

const AdminBannerPage = ({ banners, setBanners }) => {
    const [selectedBanner, setSelectedBanner] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleBannerChange = (event) => {
        setSelectedBanner(event.target.value);
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async (event) => {
        event.preventDefault();
        if (!selectedBanner || !selectedFile) {
            alert('배너와 파일을 선택해주세요.');
            return;
        }

        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
            const response = await axios.post('/api/banner-upload', formData);
            const imageUrl = response.data.url;

            const updatedBanners = banners.map(banner =>
                banner.id === selectedBanner ? { ...banner, imageUrl } : banner
            );
            setBanners(updatedBanners);
            alert('배너가 성공적으로 업데이트되었습니다.');
        } catch (error) {
            console.error('배너 업로드 실패:', error);
            alert('배너 업로드에 실패했습니다.');
        }
    };

    return (
        <AdminContainer>
            <h2>광고 배너 관리</h2>
            <BannerUploadForm onSubmit={handleUpload}>
                <select value={selectedBanner} onChange={handleBannerChange}>
                    <option value="">배너를 선택하세요</option>
                    {banners.map(banner => (
                        <option key={banner.id} value={banner.id}>{banner.name}</option>
                    ))}
                </select>
                <Input type="file" onChange={handleFileChange} />
                <button type="submit">업로드</button>
            </BannerUploadForm>
            <div>
                {banners.map(banner => (
                    <Banner key={banner.id} {...banner} />
                ))}
            </div>
        </AdminContainer>
    );
};

const AdminContainer = styled.div`
  padding: 20px;
`;

const BannerUploadForm = styled.form`
  margin-bottom: 20px;
`;

const Input = styled.input`
  margin-right: 10px;
`;

export default AdminBannerPage;
