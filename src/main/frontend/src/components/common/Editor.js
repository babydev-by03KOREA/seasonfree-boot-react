import React, { useEffect, useRef, useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Quill from 'quill';
import { ImageDrop } from 'quill-image-drop-module';
import ImageResize from 'quill-image-resize-module-react';

window.Quill = Quill;
Quill.register('modules/imageDrop', ImageDrop);
Quill.register('modules/imageResize', ImageResize);

const Editor = ({ value, onChange }) => {
    const quillRef = useRef(null);

    const handleImageUpload = async (file) => {
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch('http://localhost:8080/image/bbs-upload', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const result = await response.json();
                console.log(result);
                const url = result.url;
                console.log(`image url: ${url}`);
                // Quill 편집기에 이미지 삽입
                const quill = quillRef.current.getEditor();
                const range = quill.getSelection();
                quill.insertEmbed(range.index, 'image', url);
                quill.setSelection(range.index + 1);
            } else {
                console.error('Image upload failed.');
            }
        } catch (err) {
            console.error('Error:', err);
        }
    };


    const handleImage = () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            await handleImageUpload(file);
        };
    };

    useEffect(() => {
        const quill = quillRef.current.getEditor();
        quill.getModule('imageDrop').handleDrop = async (event) => {
            event.preventDefault();
            const files = event.dataTransfer.files;
            if (files.length > 0) {
                const file = files[0];
                await handleImageUpload(file);
            }
        };
    }, []);

    const toolbarOptions = useMemo(() => [
        ["link", "image"],
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        ["blockquote"],
        [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
    ], []);

    const formats = useMemo(() => [
        'font', 'header', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block', 'formula',
        'list', 'bullet', 'indent',
        'link', 'image', 'video',
        'align', 'color', 'background',
    ], []);

    const modules = useMemo(() => ({
        toolbar: {
            container: toolbarOptions,
            handlers: { image: handleImage },
        },
        imageDrop: true,
        imageResize: {
            modules: ['Resize', 'DisplaySize']
        },
    }), [toolbarOptions]);

    return (
        <div style={{ marginBottom: "50px" }}>
            <ReactQuill
                style={{ width: "800px", height: "500px" }}
                ref={quillRef}
                modules={modules}
                formats={formats}
                value={value}
                onChange={onChange}
            />
        </div>
    );
};

export default Editor;
