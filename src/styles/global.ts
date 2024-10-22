import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
    #root{
        display:flex;
        flex-direction:column;
        min-height:100vh
    }
    main{
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
        text-decoration:none
    }
`;
