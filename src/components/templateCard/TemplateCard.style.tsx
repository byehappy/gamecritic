import { Link } from "react-router-dom";
import styled from "styled-components";

export const Item = styled(Link)`
  width: 8vw;
  position: relative;
  flex: none;
  max-height:20vh;
  transition: transform 0.3s ease-in-out;
  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
  span {
    padding: 5px;
    text-align: center;
    position: absolute;
    bottom: 0;
    left:0;
    width: 100%;
    color: white;
    line-height: 22px;
    background-color: black;
  }
`;