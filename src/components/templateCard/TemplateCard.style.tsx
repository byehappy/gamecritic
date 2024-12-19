import styled from "styled-components";

export const Item = styled.div<{ $IsDisabled: boolean; $notClick: boolean }>`
  position: relative;
  flex: none;
  overflow: hidden;
  height: 24vh;
  transition: transform 0.3s ease-in-out;
  pointer-events: ${(props) =>
    (props.$IsDisabled || props.$notClick) && "none"};
  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
    min-height: 20vh;
  }
  span {
    padding: 5px;
    text-align: center;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    color: white;
    line-height: 22px;
    background-color: black;
    font-size: ${({ theme }) => theme.fontSizes.adaptivSmallText};
    white-space: pre-wrap;
  }
  button {
    pointer-events: auto !important;
  }
  a {
    opacity: ${(props) => props.$IsDisabled && "0.5"};
  }
`;
