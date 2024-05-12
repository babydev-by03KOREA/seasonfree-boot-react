import styled from "styled-components";

const ButtonComponent = ({
                             width = '330px',
                             height = '25px',
                             background = '#adb5bd',
                             color = 'black',
                             text = '',
                             margin = '',
                             fontsize = '',
                             onClick
                         }) => {
    return (
        <Button
            width={width}
            height={height}
            margin={margin}
            background={background}
            color={color}
            onClick={onClick}
            fontsize={fontsize}
        >
            {text}
        </Button>
    );
}

const Button = styled.button`
    width: ${props => props.width};
    height: ${props => props.height};
    background-color: ${props => props.background};
    color: ${props => props.color};
    margin: ${props => props.margin};
    font-size: ${props => props.fontsize};
    font-weight: bold;
    cursor: pointer;
`;

export default ButtonComponent;