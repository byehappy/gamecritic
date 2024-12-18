import { PictureOutlined } from "@ant-design/icons";
import styled from "styled-components";

const CardWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  animation: slider 1.8s linear infinite forwards;
  background: ${({theme})=> theme.gradient.loading};
  background-size: 1200px 100%;
  height: 24vh;
  @keyframes slider {
    0% {
      background-position: -1200px 0;
    }
    100% {
      background-position: 1200px 0;
    }
  }
`;

export const TemplateSkeleton = () => {
  return (
    <CardWrapper>
      <PictureOutlined style={{ fontSize: "2.5rem", color: "#3333337f" }} />
    </CardWrapper>
  );
};
