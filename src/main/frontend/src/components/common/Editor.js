import React, { useMemo } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import ImageResize from 'quill-image-resize-module-react/src/ImageResize';
import { ImageDrop } from 'quill-image-drop-module';

/**
 * @Issue
 * https://github.com/kensnyder/quill-image-resize-module/issues/143
 * */
window.Quill = Quill;
Quill.register("modules/imageDrop", ImageDrop);
Quill.register('modules/imageResize', ImageResize);

const Editor = ({ value, onChange }) => {
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
        },
        imageDrop: true,
        imageResize: {
            modules: ['Resize', 'DisplaySize']
        }
    }), [toolbarOptions]);

    return (
        <div style={{ marginBottom: "50px" }}>
            <ReactQuill
                style={{ width: "800px", height: "500px" }}
                modules={modules}
                formats={formats}
                value={value}
                onChange={onChange}
            />
        </div>
    );
}

export default Editor;
