import styled, { keyframes } from "styled-components";
import { device } from "../../../styles/size";

const fadeIn = keyframes`
  from {
    opacity: 0.5;
    transform: scale(0.8);
  }
  to {
    opacity: 0.75;
    transform: scale(1);
  }
`;

export const DotsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.8vw;
  padding: 0 1vw;
  position: absolute;
  bottom: 2%;
  width: 100%;
`;

export const Dot = styled.div<{ $isActive: boolean }>`
  width: 100%;
  height: 1vh;
  border-radius: 4px;
  background-color: ${(props) => (props.$isActive ? "#8a2be2" : "#ccc")};
  animation: ${(props) => (props.$isActive ? fadeIn : "none")} 0.3s ease-in-out;
  opacity: 0.75;
  transition: background-color 0.3s, transform 0.3s;
`;

export const SliderContainer = styled.div`
  position: relative;
  cursor: zoom-in;
`;

export const SliderImage = styled.img`
  object-fit: cover;
  width:100%;
  max-height:470px;
`;

export const PortalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 101;
  cursor: zoom-out;
  img {
    width: 75%;
  }
  button {
    width: 100%;
    height: auto;
    z-index: 102;
  }
`;
export const MoadalWrapperGameInfo = styled.div`
  display: flex;
  gap: 10px;
  @media ${device.mobileS} {
    flex-direction: column;
  }
  @media ${device.laptopL} {
    flex-direction: row;
  }
`;
