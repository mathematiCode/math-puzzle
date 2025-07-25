import styled from 'styled-components';

// Utility to lighten HSL/HSLA color strings by increasing the lightness by 10%
function lightenHSL(hsl: string, amount = 6) {
  // Match hsl(a) color
  const hslRegex = /hsla?\((\d+),\s*([\d.]+)%,\s*([\d.]+)%(?:,\s*([\d.]+))?\)/i;
  const match = hsl.match(hslRegex);
  if (!match) return hsl;
  const [_, h, s, l, a] = match;
  let newL = Math.min(100, parseFloat(l) + amount);
  if (typeof a !== 'undefined') {
    return `hsla(${h}, ${s}%, ${newL}%, ${a})`;
  }
  return `hsl(${h}, ${s}%, ${newL}%)`;
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  disabled?: boolean;
  children: any;
  color: string;
  textColor?: string;
}

export const StyledButton = styled.button.attrs(props => ({
  onClick: props.onClick,
  disabled: props.disabled,
}))<{
  color: string;
  textColor?: string;
}>`
  background-color: ${props => props.color};
  color: ${props => props.textColor || 'white'};
  border-radius: 5px;
  padding: 12px;
  margin: 20px;
  cursor: pointer;
  -webkit-user-select: none;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-size: 1.3rem;
  font-weight: 600;

  svg {
    width: 24px;
    height: 24px;
    flex-shrink: 0;
  }

  &:focus,
  &:hover {
    background-color: ${props => lightenHSL(props.color)};
  }

  &:disabled,
  &:disabled.hover {
    background-color: lightgrey;
    color: rgb(89, 88, 88);
  }
`;

function Button({
  children,
  onClick,
  disabled,
  color,
  textColor,
}: ButtonProps) {
  return (
    <StyledButton
      onClick={onClick}
      disabled={disabled}
      color={color}
      textColor={textColor}
    >
      {children}
    </StyledButton>
  );
}

export default Button;
