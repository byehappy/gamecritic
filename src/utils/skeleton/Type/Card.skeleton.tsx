import styled from "styled-components";
import { PictureOutlined } from "@ant-design/icons";

const CardWrapper = styled.div<{ $size: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  animation: slider 1.8s linear infinite forwards;
  background: ${({theme})=> theme.gradient.loading};
  background-size: 1200px 100%;
  height: ${(props) => (props.$size === "large" ? "15rem" : "10rem")};
  min-width: calc(94px + 36 * (100vw / 1280));
  max-height:192px;
  @keyframes slider {
    0% {
      background-position: -1200px 0;
    }
    100% {
      background-position: 1200px 0;
    }
  }
`;
const AbouteCardWrapper = styled.div`
  width:15vw;
  min-width:250px;
  padding:1%;
  border-radius:1em;
  animation: slider 1.8s linear infinite forwards;
  background: ${({theme})=> theme.gradient.loading};
  background-size: 1200px 100%;
  span{
    width:100%;
    display:flex;
    justify-content:center;
    height:20vh;
  }
  div{
    width:100%;
    height:10vh;
  }
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
    <CardWrapper $size={"large"}>
      <PictureOutlined style={{ fontSize: "2.5rem", color: "#3333337f" }} />
    </CardWrapper>
  );
};

export const CardSmallSkeleton = () => {
  return (
    <CardWrapper $size={"small"}>
      <PictureOutlined style={{ fontSize: "2.5rem", color: "#3333337f" }} />
    </CardWrapper>
  );
};

export const AbouteCardSkeleton = () => {
  return (
    <AbouteCardWrapper>
      <PictureOutlined style={{ fontSize: "5em", color: "#3333337f"}} />
      <div></div>
    </AbouteCardWrapper>
  );
};
