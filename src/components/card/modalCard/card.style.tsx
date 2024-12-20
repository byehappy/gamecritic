import styled, { keyframes } from "styled-components";

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
  width: 40vw;
  height: 47vh;
  overflow: hidden;
  position: relative;
  cursor: zoom-in;
`;

export const SliderImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
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
  width: min-content;
  display: flex;
  gap: 1vw;
`;
