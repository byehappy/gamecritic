import styled from "styled-components";

const IconWrapper = styled.div`
  border-radius: 100%;
  animation: slider 1.8s linear infinite forwards;
  background: linear-gradient(to right, #f6f6f6 8%, #f0f0f0 18%, #f6f6f6 33%);
  background-size: 1200px 100%;
  width: 12vw;
  height: 16vh;
  @keyframes slider {
    0% {
      background-position: -1200px 0;
    }
    100% {
      background-position: 1200px 0;
    }
  }
`;

export const IconSkeleton = () => {
  return <IconWrapper />;
};
