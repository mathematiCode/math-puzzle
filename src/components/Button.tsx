import styled from 'styled-components';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  disabled?: boolean;
  children: any;
}

export const StyledButton = styled.button.attrs(props => ({
  onClick: props.onClick,
  disabled: props.disabled,
}))`
  color: white;
  background-color: hsl(178, 100%, 23%);
  border-radius: 10px;
  padding: 10px;
  margin: 20px;
  cursor: pointer;
  -webkit-user-select: none;
  user-select: none; // Makes the text not selectable

  &:focus,
  &:hover {
    background-color: hsl(178, 60%, 35%);
  }

  &:disabled,
  &:disabled.hover {
    background-color: lightgrey;
    color: rgb(89, 88, 88);
  }
`;

function Button({ children, onClick, disabled }: ButtonProps) {
  return (
    <StyledButton onClick={onClick} disabled={disabled}>
      {children}
    </StyledButton>
  );
}

export default Button;
