import styled from "styled-components";

export const Item = styled.div<{ $IsDisabled: boolean }>`
  width: 10em;
  max-width:130px;
  position: relative;
  flex: none;
  height: 20vh;
  transition: transform 0.3s ease-in-out;
  pointer-events: ${(props) => props.$IsDisabled && "none"};
  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
    min-height:20vh;
  }
  span {
    padding: 5px;
    text-align: center;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    color: white;
    line-height: 22px;
    background-color: black;
  }
`;
