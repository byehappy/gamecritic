import { createGlobalStyle } from "styled-components";
import SilkscreenRegular from '../assets/fonts/Silkscreen-Regular.ttf'

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
        min-height:100vh
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
`;
