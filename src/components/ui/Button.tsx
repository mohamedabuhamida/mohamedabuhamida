import React from "react";
import styled from "styled-components";

interface ButtonProps {
  text?: string;
  size?: "sm" | "md" | "lg";
  padding?: string;
  fontSize?: string;
  bgColor?: string;
  textColor?: string;
  circleColor?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

const Button = ({
  text = "Button",
  size = "md",
  padding,
  fontSize,
  bgColor = "#b1dae7",
  textColor = "#234567",
  circleColor,
  icon,
  fullWidth = false,
  disabled = false,
  onClick,
}: ButtonProps) => {
  const sizeMap = {
    sm: { padding: "8px 14px", fontSize: "14px", circle: "35px" },
    md: { padding: "12px 18px", fontSize: "18px", circle: "45px" },
    lg: { padding: "16px 26px", fontSize: "22px", circle: "60px" },
  };

  const selected = sizeMap[size] || sizeMap.md;

  return (
    <StyledButton
      $padding={padding || selected.padding}
      $fontSize={fontSize || selected.fontSize}
      $circleSize={selected.circle}
      $bgColor={bgColor}
      $circleColor={circleColor || bgColor}
      $textColor={textColor}
      $fullWidth={fullWidth}
      disabled={disabled}
      onClick={onClick}
    >
      <span>{text}</span>
      {icon && icon}
    </StyledButton>
  );
};

interface StyledButtonProps {
  $padding: string;
  $fontSize: string;
  $circleSize: string;
  $bgColor: string;
  $circleColor: string;
  $textColor: string;
  $fullWidth: boolean;
}

const StyledButton = styled.button<StyledButtonProps>`
  position: relative;
  padding: ${(p) => p.$padding};
  transition: all 0.25s ease;
  border: none;
  background: none;
  cursor: pointer;
  width: ${(p) => (p.$fullWidth ? "100%" : "fit-content")};
  opacity: ${(p) => (p.disabled ? 0.6 : 1)};
  pointer-events: ${(p) => (p.disabled ? "none" : "auto")};

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 50px;
    background: ${(p) => p.$circleColor};
    width: ${(p) => p.$circleSize};
    height: ${(p) => p.$circleSize};
    transition: all 0.3s ease;
  }

  span {
    position: relative;
    font-size: ${(p) => p.$fontSize};
    font-weight: 700;
    letter-spacing: 0.05em;
    color: ${(p) => p.$textColor};
    margin-right: 8px;
  }

  svg {
    position: relative;
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke: ${(p) => p.$textColor};
    stroke-width: 2;
    transform: translateX(-5px);
    transition: all 0.3s ease;
  }

  &:hover:before {
    width: 100%;
  }

  &:hover svg {
    transform: translateX(0);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export default Button;