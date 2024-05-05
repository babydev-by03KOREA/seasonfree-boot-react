import styled from "styled-components";

const ButtonComponent = ({width = '330px', height = '25px', color = '#adb5bd', text = '', margin = ''}) => {
    return (
        <Button
            width={width}
            height={height}
            margin={margin}
            color={color}
        >
            {text}
        </Button>
    );
}

const Button = styled.button`
    width: ${props => props.width};
    height: ${props => props.height};
    background-color: ${props => props.color};
    margin: ${props => props.margin};
    font-weight: bold;
`;

export default ButtonComponent;