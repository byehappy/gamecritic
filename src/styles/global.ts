import { createGlobalStyle } from "styled-components";
import SilkscreenRegular from "../assets/fonts/Silkscreen-Regular.ttf";

export default createGlobalStyle`
    @font-face {
        font-family: "Silkscreen";
        font-style: normal;
        font-weight: 400;
        src: url(${SilkscreenRegular});
    }
    #root{
        display:flex;
        flex-direction:column;
        min-height:100vh;
        background-color:#fbfbfb
    }
    #content{
        flex-grow:1;
        margin: 0 10vw;
    }
    *,
    *::before,
    *::after {
        box-sizing: border-box;
        padding: 0;
        margin: 0;
    }
    a{
        text-decoration:none;
        color:hsl(237,50%,45%);;
        &:hover{
            color:hsl(237,55%,57%);
        }
    }
    *::-webkit-scrollbar {
        width: 4px;       
    }
    *::-webkit-scrollbar-thumb {
        background-color: gray;
    }
    *::-webkit-scrollbar-track { 
        -webkit-box-shadow: 5px 5px 5px -5px rgba(34, 60, 80, 0.2) inset; 
        background-color: #f9f9fd; 
    }
`;
