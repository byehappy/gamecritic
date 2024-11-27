import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from {
    opacity: 0.5;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

export const DotsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: .8vw;
  padding:0 1vw;
  position: absolute;
  bottom: 2%;
  width: 100%;
`;

export const Dot = styled.div<{ $isActive: boolean }>`
  width: 100%;
  height: 1vh;
  border-radius: 4px;
  background-color: ${(props) =>
    props.$isActive ? "#8a2be2" : "#ccc"};
  animation: ${(props) => (props.$isActive ? fadeIn : "none")} 0.3s ease-in-out;
  transition: background-color 0.3s, transform 0.3s;
`;

export const SliderContainer = styled.div`
  width: 40vw;
  height:47vh;
  overflow: hidden;
  position: relative;
`;

export const SliderImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit:cover;
`;
