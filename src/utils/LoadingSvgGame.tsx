import styled, { keyframes } from "styled-components";
const backgroundFrames = keyframes`
  0%{
    background-color:${({ theme }) => theme.colors.backgroundLoading};
  } 
  60%{  
    background-color:${({ theme }) => theme.colors.bg};
    opacity:0.9;
  }100%{
    background-color:transparent;
    opacity:0;
  }
`;
const Container = styled.div`
  position: fixed;
  margin-inline: auto;
  width: 100%;
  height: 100%;
  color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  background-color: ${({ theme }) => theme.colors.bg};
  animation: ${backgroundFrames} 5s linear;
`;

export const LoadingGameCritic = () => {
  return (
    <Container id="load-container">
      <svg
        id="loader"
        width="408"
        height="40"
        viewBox="0 0 408 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            id="lingrad"
            x1="0"
            y1="0"
            x2="408"
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="LawnGreen">
              <animate
                attributeName="stop-color"
                values="LawnGreen;MediumBlue"
                begin="1s"
                dur="1s"
                fill="freeze"
              />
              <animate
                attributeName="offset"
                values="0;1"
                begin="1.5s"
                dur="1.5s"
                fill="freeze"
              />
            </stop>
            <stop stopColor="yellow">
              <animate
                attributeName="stop-color"
                values="DeepPink;LawnGreen"
                begin=".5s"
                dur="1s"
                fill="freeze"
              />
              <animate
                attributeName="offset"
                values="0;1"
                begin=".5s"
                dur="2s"
                fill="freeze"
              />
            </stop>
            <stop stopColor="yellow">
              <animate
                attributeName="stop-color"
                values="yellow;red;DeepPink"
                begin=".2s"
                dur="1s"
                fill="freeze"
              />
              <animate
                attributeName="offset"
                values="0;1"
                begin="1s"
                dur="1.5s"
                fill="freeze"
              />
            </stop>
            <stop stopColor="yellow">
              <animate
                id="yellowanim"
                attributeName="offset"
                values="0;1"
                dur="1.5s"
                fill="freeze"
              />
            </stop>
            <stop stopColor="transparent" />
          </linearGradient>
        </defs>

        <g fill="url(#lingrad)">
          <path d="M400 16V8H384V0H400V8H408V16H400ZM384 40V32H376V8H384V32H400V40H384ZM400 32V24H408V32H400Z" />
          <path d="M352 40V0H360V40H352Z" />
          <path d="M320 40V8H312V0H336V8H328V40H320Z" />
          <path d="M288 40V0H296V40H288Z" />
          <path d="M240 40V0H264V8H272V16H264V32H272V40H264V32H256V24H248V40H240ZM248 16H263.68V8H248V16Z" />
          <path d="M216 16V8H200V0H216V8H224V16H216ZM200 40V32H192V8H200V32H216V40H200ZM216 32V24H224V32H216Z" />
          <path d="M152 40V0H176V8H160V16H176V24H160V32H176V40H152Z" />
          <path d="M96 40V0H104V8H112V16H120V24H112V16H104V40H96ZM128 40V16H120V8H128V0H136V40H128Z" />
          <path d="M48 40V8H56V0H72V8H80V40H72V24H56V40H48ZM56 16H72V8.32H56V16Z" />
          <path d="M8 8V0H32V8H8ZM0 32V8H8V32H0ZM24 32V24H16V16H32V32H24ZM8 40V32H24V40H8Z" />
        </g>
      </svg>
    </Container>
  );
};
