import styled from "styled-components";

const Popup = ({isOpen, title, content, onClose, children}) => {
    if (!onClose) return null;

    return (
        <Overlay>
            <PopupModal>
                {title && <PopupHeader>{title}</PopupHeader>}
                <PopupContent>
                    {content}
                    {children}
                </PopupContent>
                <CloseButton onClick={onClose}>X</CloseButton>
            </PopupModal>
        </Overlay>
    );
}

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
`;

const PopupModal = styled.div`
    width: 35%;
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    position: relative;
`;

const PopupHeader = styled.h2`
    text-align: center;
    padding-left: 10px;
    color: black;
`;

const PopupContent = styled.div`
    margin-top: 20px;
`;

const CloseButton = styled.button`
    position: absolute;
    top: 10px;
    right: 10px;
    border: none;
    background: none;
    cursor: pointer;
    font-size: 16px;
`;

export default Popup;