import { createGlobalStyle } from "styled-components";
import { device } from "./size";
export default createGlobalStyle`
    #root{
        display:flex;
        flex-direction:column;
        min-height:100vh;
        background-color:${({ theme }) => theme.colors.bg};
        color:${({ theme }) => theme.colors.font};
        font-family:'Raleway'
    }
    #content{
        flex-grow:1;
        @media ${device.mobileS} {
            margin:5px;
        }
        @media ${device.laptopL} {
            margin: 0 8vw;
        }
        @media ${device.desktop} {
            margin: 0 10vw;
        }
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
        color:${({ theme }) => theme.colors.links.color};
        &:hover{
            color:${({ theme }) => theme.colors.links.secondaryColor};
        }
        text-underline-offset: 3px;
    }
    *::-webkit-scrollbar {
        width: 4px;       
        height:4px;
    }
    *::-webkit-scrollbar-thumb {
        background-color: gray;
    }
    *::-webkit-scrollbar-track { 
        -webkit-box-shadow: 5px 5px 5px -5px rgba(34, 60, 80, 0.2) inset; 
        background-color: #f9f9fd; 
    }
    *::-webkit-scrollbar-track:horizontal{
        background-color: rgba(255, 255, 255, 0.1);
    }
    img {  
       position:relative;
    }
    img:after {  
        content:"";
        background-image:url(${({ theme }) => theme.image.no_image});
        background-color:(${({ theme }) => theme.colors.bg});
        backdrop-filter: blur(300px);
        background-origin: border-box;
        background-repeat:no-repeat;
        background-position: center;
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
    input[type="range"]{
        accent-color:${({ theme }) => theme.colors.primary};
    }
`;
