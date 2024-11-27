import styled from "styled-components";
import { PictureOutlined } from "@ant-design/icons";

const CardWrapper = styled.div<{$size: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  animation: slider 1.8s linear infinite forwards;
  background: linear-gradient(to right, #f6f6f6 8%, #f0f0f0 18%, #f6f6f6 33%);
  background-size: 1200px 100%;
  height: ${(props) => (props.$size === "large" ? "15rem" : "10rem")};
  width: 7vw;
  @keyframes slider {
    0% {
      background-position: -1200px 0;
    }
    100% {
      background-position: 1200px 0;
    }
  }
`;

export const CardSkeleton = () => {
  return (
    <CardWrapper $size={'large'}>
      <PictureOutlined style={{fontSize:"2.5rem",color:"#3333337f"}}/>
    </CardWrapper>
  );
};

export const CardSmallSkeleton = () => {
  return (
    <CardWrapper $size={'small'}>
      <PictureOutlined style={{fontSize:"2.5rem",color:"#3333337f"}}/>
    </CardWrapper>
  );
};

