import styled from "styled-components";
import { device } from "../../styles/size";

export const Item = styled.div<{ $IsDisabled: boolean; $notClick: boolean }>`
  position: relative;
  flex: none;
  overflow: hidden;
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
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px;
    text-align: center;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    @media ${device.mobileS} {
      height: 45px;
    }
    @media ${device.tablet} {
      height: 55px;
    }
    color: white;
    line-height: 22px;
    background-color: black;
    font-size: ${({ theme }) => theme.fontSizes.adaptivSmallText};
    white-space: pre-wrap;
  }
  button {
    pointer-events: auto !important;
    span {
      height: 30px;
    }
  }
  a {
    opacity: ${(props) => props.$IsDisabled && "0.5"};
  }
`;
