import styled from "styled-components";

const IconWrapper = styled.div`
  border-radius: 100%;
  animation: slider 1.8s linear infinite forwards;
  background: ${({theme})=> theme.gradient.loading};
  background-size: 1200px 100%;
  width: 100%;
  height: 100%;
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
